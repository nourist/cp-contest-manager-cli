import inquirer from 'inquirer';
import { getContests } from '../../utils/contest.js';
import { addProblems } from '../../utils/problem.js';

export default async (contestName, options) => {
    let str = contestName;
    if (!str) {
        const ans = await inquirer.prompt([
            {
                type: 'search-list',
                name: 'name',
                message: 'Select contest to add problems:',
                choices: getContests(),
            },
        ]);
        str = ans.name;
    }

    const ans2 = await inquirer.prompt([
        {
            type: 'input',
            message: 'Enter new problem names (space-separated, can include .ext):',
            name: 'problems',
            validate: (value) => {
                value = value.trim();
                if (!value) return 'Please enter problem names';
                if (!value.split(' ').every((v) => v.match(/^[a-zA-Z0-9_\.]+$/))) {
                    return 'Please enter valid problem names';
                }
                return true;
            },
            filter: (value) => value.trim().split(' '),
        },
    ]);

    addProblems(str, ans2.problems, {
        io: options.io,
        sub: options.sub,
    });

    console.log(`Problems added to ${str} successfully`.success);
};
