#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import inquirerSearchList from 'inquirer-search-list';
import chalk from 'chalk';
import Table from 'cli-table';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

import { rootDir, version } from './constant.js';
import { getData } from './utils.js';
import { isExistContest, createContest, deleteContest } from './contest.js';

inquirer.registerPrompt('search-list', inquirerSearchList);

const program = new Command();

/*
Create root project
*/

if (!fs.existsSync(rootDir)) {
	fs.mkdirSync(rootDir);
}

/*
Create data file
*/

if (!fs.existsSync(path.join(rootDir, 'data.json'))) {
	fs.writeFileSync(
		path.join(rootDir, 'data.json'),
		JSON.stringify({
			contests: [],
		}),
	);
}

/*
Create config file
*/

if (!fs.existsSync(path.join(rootDir, 'config.json'))) {
	fs.writeFileSync(path.join(rootDir, 'config.json'), '{}');
}

program
	.name('cp-contest-manager')
	.description('Cli tool to manage competitive programming contest')
	.version(version); //BETA

program
	.command('list')
	.description('List contests')
	.action((str, option) => {
		const data = getData();

		// data.contests.forEach((contest, index) =>
		// 	console.log(index + 1, contest),
		// );
		const table = new Table({
			head: ['', 'Name', 'Create At', 'Tasks'],
		});

		table.push(
			...data.contests.map((contest, index) => [
				index + 1,
				contest.name,
				new Date(contest.createAt).toDateString(),
				`${contest.numberOfTask}: ${contest.tasksName}`,
			]),
		);

		console.log(table.toString());
	});

program
	.command('create')
	.description('Create contests')
	.action(async (str, option) => {
		const data = getData();

		const ans = await inquirer.prompt([
			{
				name: 'contest_name',
				type: 'input',
				message: 'Enter your Contest name:',
				default: `contest${data.contests.length + 1}`,
				validate: (input) => {
					if (isExistContest(input)) {
						return Error(`Contest "${input}" already exists`);
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
						return Error('Number of task must be greater than 0');
					}
					return true;
				},
			},
			{
				name: 'sub',
				type: 'list',
				message: 'Do you want to create sub folder for each task?',
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
				message: `Enter task ${i} name: `,
				default: `bai${i}`,
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
	});

program
	.command('delete')
	.description('Delete contests')
	.action(async (str, option) => {
		const data = getData();

		if (!data.contests) {
			console.log(chalk.red('There are no contest to deleted!'));
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
				message: 'Are you sure you want to delete this contest?',
				name: 'ok',
			},
		]);

		if (ans.ok) {
			deleteContest(ans.name);
			console.log(chalk.green('Delete contest successfull!'));
		} else {
			console.log(chalk.rgb(250, 154, 0)('Cancel delete contest!'));
		}
	});

program
	.command('open')
	.description('Open contest in vscode')
	.action(async(str, option) => {
		const data = getData();

		if (!data.contests) {
			console.log(chalk.red('There are no contest to deleted!'));
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

		console.log(chalk.blue("Opening..."));

		exec(`code -r ${path.join(rootDir, ans.name)}`)
	});

program.command('export').action((str, option) => {
	console.log('EXPORT');
});

program.parse();
