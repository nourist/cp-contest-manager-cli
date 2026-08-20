import inquirer from 'inquirer';
import { getContests, getContest } from '../../utils/contest.js';
import { markProblems } from '../../utils/problem.js';
import { autoCommitIfEnabled } from '../../utils/git.js';

export default async (contestName) => {
	let str = contestName;
	if (!str) {
		const ans = await inquirer.prompt([
			{
				type: 'search-list',
				name: 'name',
				message: 'Select contest to mark problems:',
				choices: getContests().map((c) => c.name),
			},
		]);
		str = ans.name;
	}

	const contest = getContest(str);
	if (!contest || contest.problems.length === 0) {
		console.log('No problems found in this contest.'.yellow);
		return;
	}

	const choices = contest.problems.map((p) => ({
		name: p,
		value: p,
		checked: !!contest.problemAc[p],
	}));

	const ans2 = await inquirer.prompt([
		{
			type: 'checkbox',
			name: 'problems',
			message: 'Select problems to mark as AC:',
			choices: choices,
		},
	]);

	markProblems(str, contest.problems, ans2.problems);
	console.log(`Problems updated successfully in ${str}`.success);
	autoCommitIfEnabled(str, ans2.problems);
};
