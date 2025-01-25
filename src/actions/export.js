import inquirer from 'inquirer';

import { getConfig } from '../utils/config.js';
import {
	exportContest,
	getContest,
	getContests,
} from '../utils/contest.js';

export default async (name, options) => {
	const { exportDir } = getConfig();

	if (!exportDir) {
		console.log(
			"You haven't configured the export directory yet. \nPlease run `cpm config` to configure the export directory."
				.error,
		);
		process.exit(1);
	}

	if (options.all) {
		let contests = getContests();
		if (options.ac) {
			contests = contests.filter((contest) => contest.ac);
		}
		contests.forEach((contest) => {
			exportContest(contest.name);
		});
		return;
	}

	if (name && !getContest(name)) {
		console.log(`Contest ${name} not found`.error);
		return;
	}
	if (!name) {
		const ans = await inquirer.prompt([
			{
				type: 'search-list',
				name: 'name',
				message: 'Select contest:',
				choices: getContests(),
			},
		]);
		name = ans.name;
	}
	exportContest(name);

	console.log('Export contest successfully'.success);
};
