import inquirer from 'inquirer';

import {
	deleteContest,
	getContest,
	getContests,
} from '../utils/contest.js';

export default async (str) => {
	if (str && !getContest(str)) {
		console.log(`Contest ${str} not found`.error);
		return;
	}
	if (!str) {
		const ans = await inquirer.prompt([
			{
				type: 'search-list',
				name: 'name',
				message: 'Select contest to delete:',
				choices: getContests().map((c) => c.name),
			},
		]);
		str = ans.name;
	}

	const ans = await inquirer.prompt([
		{
			type: 'confirm',
			name: 'confirm',
			message: `Are you sure to delete contest ${str}?`,
			default: true,
		},
	]);

	if (ans.confirm) {
		deleteContest(str);

		console.log(`Delete contest ${str} successfully`.success);
	} else {
		console.log('Delete contest canceled'.warn);
	}
};
