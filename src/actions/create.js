import inquirer from 'inquirer';
import { getContest, createContest } from '../utils/contest.js';

export default async (options) => {
	const ans = await inquirer.prompt([
		{
			type: 'input',
			message: 'Enter contest name:',
			name: 'name',
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
		{
			type: 'input',
			message: 'Enter contest problems (space-separated):',
			name: 'problems',
			validate: (value) => {
				value = value.trim();
				if (!value) {
					return 'Please enter contest problems';
				}
				if (
					!value
						.split(' ')
						.every((v) => v.match(/^[a-zA-Z0-9\-_\.]+$/))
				) {
					return 'Please enter valid problem names';
				}
				return true;
			},
			filter: (value) => value.trim().split(' '),
		},
	]);

	createContest(ans.name, ans.problems, {
		io: options.io,
		sub: options.sub,
	});

	console.log('Create contest successfully'.success);
};
