import inquirer from 'inquirer';
import { getContests, getContest } from '../../utils/contest.js';
import { deleteProblems } from '../../utils/problem.js';

export default async (contestName) => {
    let str = contestName;
    if (!str) {
        const ans = await inquirer.prompt([
            {
                type: 'search-list',
                name: 'name',
                message: 'Select contest to delete problems from:',
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
            type: 'checkbox',
            name: 'problems',
            message: 'Select problems to delete:',
            choices: contest.problems,
        },
    ]);

    if (ans2.problems.length === 0) {
        console.log('No problems selected.'.yellow);
        return;
    }

    const confirmAns = await inquirer.prompt([{
        type: 'confirm',
        name: 'confirm',
        message: `Are you sure you want to delete the selected problems? This cannot be undone.`,
        default: false,
    }]);

    if (confirmAns.confirm) {
        deleteProblems(str, ans2.problems);
        console.log(`Problems deleted successfully from ${str}`.success);
    } else {
        console.log('Deletion cancelled.'.yellow);
    }
};
