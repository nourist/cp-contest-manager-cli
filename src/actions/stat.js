import Table from 'cli-table3';
import { getContests } from '../utils/contest.js';
import 'colors';

export default () => {
	const contests = getContests();

	let totalContests = contests.length;
	let acContests = 0;
	
	let totalProblems = 0;
	let acProblems = 0;

	const tagStats = {};

	contests.forEach(contest => {
		let tag = 'No tag';
		const underscoreIndex = contest.name.indexOf('_');
		if (underscoreIndex !== -1) {
			tag = contest.name.substring(0, underscoreIndex);
		}

		if (!tagStats[tag]) {
			tagStats[tag] = { total: 0, ac: 0 };
		}
		tagStats[tag].total++;
		if (contest.ac) {
			acContests++;
			tagStats[tag].ac++;
		}

		totalProblems += contest.problems.length;
		
		const solvedInContest = contest.problems.filter(p => contest.problemAc && contest.problemAc[p]).length;
		acProblems += solvedInContest;
	});

	const incompleteContests = totalContests - acContests;
	const unsolvedProblems = totalProblems - acProblems;
	
	const problemRate = totalProblems === 0 ? 0 : ((acProblems / totalProblems) * 100).toFixed(2);
	const contestRate = totalContests === 0 ? 0 : ((acContests / totalContests) * 100).toFixed(2);

	const table = new Table({
		head: ['Statistic'.info, 'Value'.info],
		colWidths: [35, 40]
	});

	table.push(
		['Total Contests', String(totalContests).bold],
		['Completed Contests (AC)', String(acContests).success],
		['Incomplete Contests', String(incompleteContests).warn],
		['Contest Completion Rate', `${contestRate}%`.magenta],
		['', ''], // Empty row for spacing
		['Total Problems', String(totalProblems).bold],
		['Solved Problems (AC)', String(acProblems).success],
		['Unsolved Problems', String(unsolvedProblems).warn],
		['Problem Solving Rate', `${problemRate}%`.magenta]
	);

	console.log('\n📊 ' + 'Contest Manager Statistics'.bold.magenta + '\n');
	console.log(table.toString());

	const tagTable = new Table({
		head: ['Tag'.info, 'Total'.info, 'AC'.info, 'Rate'.info],
		colWidths: [35, 10, 10, 15]
	});

	// Sort tags alphabetically
	const sortedTags = Object.keys(tagStats).sort((a, b) => a.localeCompare(b));

	for (const tag of sortedTags) {
		const stat = tagStats[tag];
		const rate = stat.total === 0 ? 0 : ((stat.ac / stat.total) * 100).toFixed(2);
		
		let rateStr = `${rate}%`;
		if (rate === '100.00') rateStr = rateStr.success;
		else if (rate === '0.00') rateStr = rateStr.gray;
		else rateStr = rateStr.warn;

		tagTable.push([
			tag === 'No tag' ? tag.gray : tag,
			String(stat.total).bold,
			String(stat.ac).success,
			rateStr
		]);
	}

	console.log('\n🏷️  ' + 'Contest Tags Statistics'.bold.magenta + '\n');
	console.log(tagTable.toString());
};
