import Table from 'cli-table3';

import { getContests } from '../utils/contest.js';

export default (options) => {
	const contests = getContests({ ac: options.ac });

	const width = process.stdout.columns || 80;

	const table = new Table({
		head: ['', 'Name', 'Problems', 'Last Update'],
		colWidths: [
			10, // STT
			30, // Name
			width - 10 - 30 - 15 - 8, // Problems
			15, // Date
		],
	});

	table.push(
		...contests.map((contest, index) => {
			let res = [
				index + 1,
				contest.name,
				`${contest.problems.length}: ` +
					contest.problems
						.map((p) =>
							!contest.ac &&
							contest.problemAc &&
							contest.problemAc[p]
								? String(p).success
								: p,
						)
						.join(' '),
				new Date(contest.lastUpdate).toLocaleDateString(),
			];
			if (contest.ac) {
				res = res.map((item) => String(item).success);
			}
			return res;
		}),
	);

	console.log(table.toString());
};
