import inquirer from 'inquirer';
import { execSync } from 'child_process';
import { getContests } from '../utils/contest.js';
import { getProblemFilePath } from '../utils/problem.js';

export default async () => {
	const contests = getContests();
	const allProblems = [];
	
	contests.forEach(contest => {
		contest.problems.forEach(problem => {
			allProblems.push({
				contest: contest.name,
				problem: problem,
				ac: contest.problemAc && contest.problemAc[problem]
			});
		});
	});

	if (allProblems.length === 0) {
		console.log('No problems found in workspace.'.yellow);
		return;
	}

	const choices = allProblems.map(p => ({
		name: p.ac ? String(`${p.contest} / ${p.problem}`).success : `${p.contest} / ${p.problem}`,
		value: p
	}));

	const ans = await inquirer.prompt([{
		type: 'search-list',
		name: 'selected',
		message: 'Search and select a problem to open:',
		choices: choices,
	}]);

	const filePath = getProblemFilePath(ans.selected.contest, ans.selected.problem);
	if (!filePath) {
		console.log(`Could not find the source file for ${ans.selected.problem}`.error);
		return;
	}

	console.log(`Opening ${ans.selected.problem}...`.cyan);
	try {
		execSync(`code "${filePath}"`, { stdio: 'inherit' });
	} catch (e) {
		console.log('Failed to open VS Code. Is `code` command in your PATH?'.error);
	}
};
