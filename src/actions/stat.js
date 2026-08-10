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
			tagStats[tag] = { totalContests: 0, acContests: 0, totalProblems: 0, acProblems: 0 };
		}
		tagStats[tag].totalContests++;
		if (contest.ac) {
			acContests++;
			tagStats[tag].acContests++;
		}

		totalProblems += contest.problems.length;
		
		const solvedInContest = contest.problems.filter(p => contest.problemAc && contest.problemAc[p]).length;
		acProblems += solvedInContest;

		tagStats[tag].totalProblems += contest.problems.length;
		tagStats[tag].acProblems += solvedInContest;
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
		head: ['Tag'.info, 'Contest'.info, 'C. AC'.info, 'C. Rate'.info, 'Problem'.info, 'P. AC'.info, 'P. Rate'.info],
		colWidths: [20, 11, 9, 11, 11, 9, 11]
	});

	// Sort tags alphabetically
	const sortedTags = Object.keys(tagStats).sort((a, b) => a.localeCompare(b));

	for (const tag of sortedTags) {
		const stat = tagStats[tag];
		const cRate = stat.totalContests === 0 ? 0 : ((stat.acContests / stat.totalContests) * 100).toFixed(2);
		const pRate = stat.totalProblems === 0 ? 0 : ((stat.acProblems / stat.totalProblems) * 100).toFixed(2);
		
		let cRateStr = `${cRate}%`;
		if (cRate === '100.00') cRateStr = cRateStr.success;
		else if (cRate === '0.00') cRateStr = cRateStr.gray;
		else cRateStr = cRateStr.warn;

		let pRateStr = `${pRate}%`;
		if (pRate === '100.00') pRateStr = pRateStr.success;
		else if (pRate === '0.00') pRateStr = pRateStr.gray;
		else pRateStr = pRateStr.warn;

		tagTable.push([
			tag === 'No tag' ? tag.gray : tag,
			String(stat.totalContests).bold,
			String(stat.acContests).success,
			cRateStr,
			String(stat.totalProblems).bold,
			String(stat.acProblems).success,
			pRateStr
		]);
	}

	console.log('\n🏷️  ' + 'Contest Tags Statistics'.bold.magenta + '\n');
	console.log(tagTable.toString());
};
