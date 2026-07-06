import inquirer from 'inquirer';
import { getContests, getContest } from '../../utils/contest.js';
import { renameProblem } from '../../utils/problem.js';

export default async (contestName) => {
	let str = contestName;
	if (!str) {
		const ans = await inquirer.prompt([{
			type: 'search-list', name: 'name', message: 'Select contest:', choices: getContests(),
		}]);
		str = ans.name;
	}
	const contest = getContest(str);
	if (!contest || contest.problems.length === 0) {
		console.log('No problems found in this contest.'.yellow);
		return;
	}
	const ans2 = await inquirer.prompt([{
		type: 'list', name: 'problem', message: 'Select problem to rename:', choices: contest.problems,
	}, {
		type: 'input', name: 'newName', message: 'Enter new name:',
		validate: (input) => {
			if (!input.trim()) return 'Name cannot be empty';
			if (contest.problems.includes(input.trim())) return 'Name already exists';
			return true;
		}
	}]);
	try {
		renameProblem(str, ans2.problem, ans2.newName.trim());
		console.log(`Problem renamed to ${ans2.newName} successfully!`.success);
	} catch (e) {
		console.log(`Error: ${e.message}`.error);
	}
};
