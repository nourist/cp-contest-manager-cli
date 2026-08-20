import inquirer from 'inquirer';

import {
	getContest,
	renameContest,
	getContests,
} from '../utils/contest.js';

export default async (options) => {
	if (options.oldname) options.oldname = options.oldname.trim().toLowerCase();
	if (options.newname) options.newname = options.newname.trim().toLowerCase();

	if (options.oldname && !getContest(options.oldname)) {
		console.log(`Contest ${options.oldname} not found`.error);
		return;
	}
	if (
		options.newname &&
		!RegExp(/^[a-zA-Z0-9\-_]+$/).test(options.newname)
	) {
		console.log('Please enter valid contest name'.error);
		return;
	}
	if (!options.oldname) {
		const ans = await inquirer.prompt([
			{
				type: 'search-list',
				name: 'oldname',
				message: 'Select contest to rename:',
				choices: getContests().map((c) => c.name),
			},
		]);
		options.oldname = ans.oldname;
	}
	if (!options.newname) {
		const ans = await inquirer.prompt([
			{
				type: 'input',
				message: 'Enter new contest name:',
				name: 'newname',
				validate: (value) => {
					value = value.trim().toLowerCase();
					if (!value) {
						return 'Please enter contest name';
					}
					if (!value.match(/^[a-zA-Z0-9\-_]+$/)) {
						return 'Please enter valid contest name';
					}
					if (getContest(value)) {
						return 'Contest already exists';
					}
					return true;
				},
				filter: (value) => value.trim().toLowerCase(),
			},
		]);
		options.newname = ans.newname;
	}
	renameContest(options.oldname, options.newname);
	console.log(
		`Rename contest ${options.oldname} to ${options.newname} successfully`
			.success,
	);
};
