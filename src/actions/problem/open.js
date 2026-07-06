import inquirer from 'inquirer';
import { execSync } from 'child_process';
import { getContests, getContest } from '../../utils/contest.js';
import { getProblemFilePath } from '../../utils/problem.js';

export default async (contestName) => {
	let str = contestName;
	if (!str) {
		const ans = await inquirer.prompt([
			{
				type: 'search-list',
				name: 'name',
				message: 'Select contest:',
				choices: getContests(),
			},
		]);
		str = ans.name;
	}
	const contest = getContest(str);
	if (!contest || contest.problems.length === 0) {
		console.log('No problems found in this contest.'.yellow);
		return;
	}
	const ans2 = await inquirer.prompt([
		{
			type: 'list',
			name: 'problem',
			message: 'Select problem to open:',
			choices: contest.problems,
		},
	]);
	const filePath = getProblemFilePath(str, ans2.problem);
	if (!filePath) {
		console.log(
			`Could not find the source file for ${ans2.problem}`.error,
		);
		return;
	}
	console.log(`Opening ${ans2.problem}...`.cyan);
	try {
		execSync(`code "${filePath}"`, { stdio: 'inherit' });
	} catch (e) {
		console.log(
			'Failed to open VS Code. Is `code` command in your PATH?'
				.error,
		);
	}
};
