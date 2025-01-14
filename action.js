import chalk from 'chalk';
import Table from 'cli-table';
import { exec } from 'child_process';
import inquirer from 'inquirer';
import path from 'path';

import { rootDir } from './constant.js';
import { getData } from './utils.js';
import {
	isExistContest,
	createContest,
	deleteContest,
	markContest,
} from './contest.js';

class actions {
	list = (str, option) => {
		const data = getData();

		data.contests.sort((a, b) => a.name.localeCompare(b.name));

		const table = new Table({
			head: ['', 'Name', 'Create At', 'Tasks'],
		});

		table.push(
			...data.contests.map((contest, index) => {
				const res = [
					index + 1,
					contest.name,
					new Date(contest.createAt).toDateString(),
					`${contest.numberOfTask}: ${contest.tasksName}`,
				];
				if (contest.ac) {
					return res.map((item) => chalk.green(item));
				} else {
					return res;
				}
			}),
		);

		console.log(table.toString());
	};

	create = async (str, option) => {
		const data = getData();

		const ans = await inquirer.prompt([
			{
				name: 'contest_name',
				type: 'input',
				message: 'Enter your Contest name:',
				default: `contest${data.contests.length + 1}`,
				validate: (input) => {
					if (isExistContest(input)) {
						return Error(
							`Contest "${input}" already exists`,
						);
					}
					return true;
				},
			},
			{
				name: 'number_of_task',
				type: 'number',
				message: 'Enter the number of task:',
				default: 4,
				validate: (input) => {
					if (input <= 0) {
						return Error(
							'Number of task must be greater than 0',
						);
					}
					return true;
				},
			},
			{
				name: 'sub',
				type: 'list',
				message:
					'Do you want to create sub folder for each task?',
				choices: ['NO', 'YES'],
				filter: (input) => {
					return input == 'YES';
				},
			},
		]);

		let tasks = [];

		for (let i = 1; i <= ans.number_of_task; i++) {
			const res = await inquirer.prompt({
				name: 'task',
				type: 'input',
				message: `Enter problem ${i} name: `,
				default: `cau${i}`,
				validate: (input) => {
					const regex = /^[a-zA-Z0-9]+$/;

					if (!regex.test(input)) {
						return Error(
							'Task name can only contain letters and numbers',
						);
					}

					if (tasks.includes(input)) {
						return Error('Task already exists');
					}

					return true;
				},
			});
			tasks.push(res.task);
		}

		createContest(ans.contest_name, tasks, ans.sub);
		console.log(chalk.green('Create contest successfull!'));
	};

	delete = async (str, option) => {
		const data = getData();

		if (!data.contests) {
			console.log(
				chalk.red('There are no contest to deleted!'),
			);
			return;
		}

		const ans = await inquirer.prompt([
			{
				type: 'search-list',
				message: 'Select contest:',
				name: 'name',
				choices: data.contests,
			},
			{
				type: 'confirm',
				message:
					'Are you sure you want to delete this contest?',
				name: 'ok',
			},
		]);

		if (ans.ok) {
			deleteContest(ans.name);
			console.log(chalk.green('Delete contest successfull!'));
		} else {
			console.log(
				chalk.rgb(250, 154, 0)('Cancel delete contest!'),
			);
		}
	};

	open = async (str, option) => {
		const data = getData();

		if (!data.contests) {
			console.log(
				chalk.red('There are no contest to deleted!'),
			);
			return;
		}

		const ans = await inquirer.prompt([
			{
				type: 'search-list',
				message: 'Select contest:',
				name: 'name',
				choices: data.contests,
			},
		]);

		console.log(chalk.blue('Opening...'));

		exec(`code -r ${path.join(rootDir, ans.name)}`);
	};
	mark = async (str, option) => {
		const data = getData();

		if (!data.contests) {
			console.log(chalk.red('There are no contest to mark!'));
			return;
		}

		const ans = await inquirer.prompt([
			{
				type: 'search-list',
				message: 'Select contest:',
				name: 'name',
				choices: data.contests,
			},
		]);

		markContest(ans.name, true);
		console.log(chalk.green('Mark contest successfull!'));
	};

	unmark = async (str, option) => {
		const data = getData();

		if (!data.contests) {
			console.log(chalk.red('There are no contest to unmark!'));
			return;
		}

		const ans = await inquirer.prompt([
			{
				type: 'search-list',
				message: 'Select contest:',
				name: 'name',
				choices: data.contests,
			},
		]);

		markContest(ans.name, false);
		console.log(chalk.green('Unmark contest successfull!'));
	};

	export = async (str, option) => {
		console.log('EXPORT');
	};
}

export default new actions();
