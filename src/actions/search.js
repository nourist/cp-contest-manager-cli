import { search } from '@inquirer/prompts';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import { getContests } from '../utils/contest.js';
import { getProblemFilePath } from '../utils/problem.js';
import { getConfig } from '../utils/config.js';

export default async () => {
	const contests = getContests();
	const allProblems = [];

	contests.forEach((contest) => {
		contest.problems.forEach((problem) => {
			const filePath = getProblemFilePath(contest.name, problem);
			let content = '';
			if (filePath && fs.existsSync(filePath)) {
				content = fs.readFileSync(filePath, 'utf8');
			}
			
			allProblems.push({
				contest: contest.name,
				problem: problem,
				ac: contest.problemAc && contest.problemAc[problem],
				content: content,
				searchName: `${contest.name} / ${problem}`,
			});
		});
	});

	if (allProblems.length === 0) {
		console.log('No problems found in workspace.'.yellow);
		return;
	}

	const searchProblems = async (input) => {
		input = input || '';
		let terms = input.trim().toLowerCase().split(/\s+/).filter(Boolean);

		let results = [];
		if (terms.length === 0) {
			results = allProblems.map(p => ({
				item: p,
				matchedTermsCount: 0,
				matchCount: 0,
				matchesByLine: new Map(),
				lines: (p.content || '').split(/\r?\n/)
			}));
		} else {
			for (let p of allProblems) {
				let lines = (p.content || '').split(/\r?\n/);
				let nameLower = p.searchName.toLowerCase();
				
				let matchedTerms = new Set();
				let matchesByLine = new Map();
				
				for (let term of terms) {
					if (nameLower.includes(term)) {
						matchedTerms.add(term);
					}
					for (let i = 0; i < lines.length; i++) {
						let lowerLine = lines[i].toLowerCase();
						let idx = -1;
						while ((idx = lowerLine.indexOf(term, idx + 1)) !== -1) {
							matchedTerms.add(term);
							if (!matchesByLine.has(i)) matchesByLine.set(i, []);
							matchesByLine.get(i).push({ term: term, start: idx, end: idx + term.length });
						}
					}
				}
				
				if (matchedTerms.size > 0) {
					results.push({ item: p, matchedTermsCount: matchedTerms.size, matchesByLine, lines });
				}
			}

			results.sort((a, b) => b.matchedTermsCount - a.matchedTermsCount);
		}

		return results.map(res => {
			const p = res.item;
			let description = '';

			if (res.matchesByLine && res.matchesByLine.size > 0) {
				let previewParts = [];
				let linesWithMatches = Array.from(res.matchesByLine.keys());
				let lineTerms = new Map();
				for (let lineIdx of linesWithMatches) {
					lineTerms.set(lineIdx, new Set(res.matchesByLine.get(lineIdx).map(m => m.term)));
				}
				
				let selectedLines = [];
				let unselectedLines = new Set(linesWithMatches);
				let coveredTerms = new Set();
				
				while (selectedLines.length < 4 && unselectedLines.size > 0) {
					let bestLine = -1;
					let maxNewTerms = -1;
					for (let lineIdx of unselectedLines) {
						let tSet = lineTerms.get(lineIdx);
						let newTermsCount = 0;
						for (let t of tSet) {
							if (!coveredTerms.has(t)) newTermsCount++;
						}
						if (newTermsCount > maxNewTerms || (newTermsCount === maxNewTerms && lineIdx < bestLine)) {
							maxNewTerms = newTermsCount;
							bestLine = lineIdx;
						}
					}
					if (bestLine !== -1) {
						selectedLines.push(bestLine);
						unselectedLines.delete(bestLine);
						for (let t of lineTerms.get(bestLine)) coveredTerms.add(t);
					}
				}
				
				selectedLines.sort((a, b) => a - b);
				
				for (let i = 0; i < selectedLines.length; i++) {
					let lineIdx = selectedLines[i];
					let rawLine = res.lines[lineIdx];
					let intervals = res.matchesByLine.get(lineIdx).sort((a, b) => a.start - b.start);
					
					let merged = [];
					for (let m of intervals) {
						if (merged.length === 0) { merged.push({...m}); continue; }
						let last = merged[merged.length - 1];
						if (m.start <= last.end + 5) {
							last.end = Math.max(last.end, m.end);
						} else {
							merged.push({...m});
						}
					}
					
					let firstMatch = merged[0].start;
					let lastMatch = merged[merged.length - 1].end;
					let snippetStart = Math.max(0, firstMatch - 40);
					let snippetEnd = Math.min(rawLine.length, lastMatch + 40);
					let truncated = rawLine.substring(snippetStart, snippetEnd);
					
					let adjusted = merged.map(m => ({ start: m.start - snippetStart, end: m.end - snippetStart }));
					
					let colored = '';
					let lastPos = 0;
					for (let m of adjusted) {
						if (m.end <= 0 || m.start >= truncated.length) continue;
						let s = Math.max(0, m.start);
						let e = Math.min(truncated.length, m.end);
						colored += truncated.substring(lastPos, s);
						colored += truncated.substring(s, e).bgYellow.black;
						lastPos = e;
					}
					colored += truncated.substring(lastPos);
					
					let cleanColored = colored.replace(/\s+/g, ' ').trim();
					previewParts.push(`  [Line ${lineIdx + 1}] ...${cleanColored}...`);
				}
				
				let suffix = '';
				if (unselectedLines.size > 0) {
					let extraLines = Array.from(unselectedLines).sort((a, b) => a - b).map(l => l + 1);
					let displayLines = extraLines.slice(0, 10);
					let extraCount = extraLines.length - displayLines.length;
					suffix = `\n  ... also found on line(s): ${displayLines.join(', ')}`;
					if (extraCount > 0) suffix += `, and ${extraCount} more`;
				}
				
				description = previewParts.join('\n') + suffix;
			} else if (terms.length > 0) {
				description = 'Matched by problem name';
			} else {
				if (p.content) {
					let cleanContent = p.content.replace(/\s+/g, ' ').trim();
					description = `Preview: ${cleanContent.substring(0, 70)}...`;
				} else {
					description = 'No content available';
				}
			}

			return {
				name: p.ac
					? String(`${p.contest} / ${p.problem}`).success
					: `${p.contest} / ${p.problem}`,
				value: p,
				description: description,
			};
		});
	};

	const selected = await search({
		message: 'Search and select a problem to open:',
		source: searchProblems,
	});

	const filePath = getProblemFilePath(
		selected.contest,
		selected.problem,
	);
	if (!filePath) {
		console.log(
			`Could not find the source file for ${selected.problem}`
				.error,
		);
		return;
	}

	console.log(`Opening ${selected.problem}...`.cyan);
	const { editor } = getConfig();
	try {
		const cmd = editor === 'zed' ? `zed "${filePath}"` : `code "${filePath}"`;
		execSync(cmd, { stdio: 'inherit' });
	} catch (e) {
		console.log(
			`Failed to open editor. Is \`${editor === 'zed' ? 'zed' : 'code'}\` command in your PATH?`
				.error,
		);
	}
};
