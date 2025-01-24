import Table from 'cli-table';

import { getContests } from '../utils/contest.js';

export default (options) => {
	const contests = getContests({ ac: options.ac });

	const table = new Table({
		head: ['', 'Name', 'Problems'],
	});

	table.push(
		...contests.map((contest, index) => {
			let res = [
				index + 1,
				contest.name,
				`${contest.problems.length}: ${contest.problems.join(' ')}`,
			];
			if (contest.ac) {
				res = res.map(
					(item) => toString(item).success,
				);
			}
			return res;
		}),
	);

	console.log(table.toString());
};
