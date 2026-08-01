import { exec } from 'child_process';
import path from 'path';
import inquirer from 'inquirer';

import { getConfig } from '../utils/config.js';
import { getContest, getContests } from '../utils/contest.js';

export default async (name) => {
	const { contestDir, editor } = getConfig();

	if (name && !getContest(name)) {
		console.log(`Contest ${name} not found`.error);
		return;
	}
	if (!name) {
		const ans = await inquirer.prompt([
			{
				type: 'search-list',
				name: 'name',
				message: 'Select contest to open:',
				choices: getContests(),
			},
		]);
		name = ans.name;
	}
	const cmd = editor === 'zed' ? `zed ${path.join(contestDir, name)}` : `code -r ${path.join(contestDir, name)}`;
	exec(cmd);
	console.log(`Opening contest ${name}...`.info);
};
