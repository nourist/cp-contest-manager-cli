import inquirer from 'inquirer';

import { getContest, getContests, markContest } from '../utils/contest.js';
import { autoCommitIfEnabled } from '../utils/git.js';

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
				message: 'Select contest to mark:',
				choices: getContests(),
			},
		]);
		str = ans.name;
	}
	markContest(str);
	console.log(`Contest ${str} marked as AC`.success);
	autoCommitIfEnabled(str);
};
