import inquirer from 'inquirer';
import { getContests, getContest } from '../../utils/contest.js';
import { moveProblem } from '../../utils/problem.js';

export default async (contestName) => {
	let str = contestName;
	if (!str) {
		const ans = await inquirer.prompt([{
			type: 'search-list', name: 'name', message: 'Select source contest:', choices: getContests(),
		}]);
		str = ans.name;
	}
	const contest = getContest(str);
	if (!contest || contest.problems.length === 0) {
		console.log('No problems found in this contest.'.yellow);
		return;
	}
	const ans2 = await inquirer.prompt([{
		type: 'list', name: 'problem', message: 'Select problem to move:', choices: contest.problems,
	}, {
		type: 'search-list', name: 'toContest', message: 'Select destination contest:', 
		choices: getContests().filter(c => c.name !== str),
	}]);
	try {
		moveProblem(str, ans2.toContest, ans2.problem);
		console.log(`Problem moved to ${ans2.toContest} successfully!`.success);
	} catch (e) {
		console.log(`Error: ${e.message}`.error);
	}
};
