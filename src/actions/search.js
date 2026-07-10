import { search } from '@inquirer/prompts';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import Fuse from 'fuse.js';
import { getContests } from '../utils/contest.js';
import { getProblemFilePath } from '../utils/problem.js';

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

	const fuse = new Fuse(allProblems, {
		keys: ['searchName', 'content'],
		includeScore: true,
		includeMatches: true,
		ignoreLocation: true,
		threshold: 0.4,
	});

	const searchProblems = async (input) => {
		input = input || '';
		let results = [];
		if (!input) {
			results = allProblems.map(p => ({ item: p }));
		} else {
			results = fuse.search(input);
		}

		return results.map(res => {
			const p = res.item;
			let description = '';

			if (res.matches && res.matches.length > 0) {
				const contentMatch = res.matches.find(m => m.key === 'content');
				if (contentMatch && contentMatch.indices.length > 0) {
					const [start, end] = contentMatch.indices[0];
					const snippetStart = Math.max(0, start - 40);
					const snippetEnd = Math.min(contentMatch.value.length, end + 40);
					const snippet = contentMatch.value
						.substring(snippetStart, snippetEnd)
						.replace(/\r?\n/g, ' ')
						.trim();
					description = `Preview: ...${snippet}...`;
				} else {
					description = 'Matched by problem name';
				}
			} else {
				if (p.content) {
					description = `Preview: ${p.content
						.substring(0, 80)
						.replace(/\r?\n/g, ' ')
						.trim()}...`;
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
	try {
		execSync(`code "${filePath}"`, { stdio: 'inherit' });
	} catch (e) {
		console.log(
			'Failed to open VS Code. Is `code` command in your PATH?'
				.error,
		);
	}
};
