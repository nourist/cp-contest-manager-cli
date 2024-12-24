#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import inquirerSearchList from 'inquirer-search-list';

import fs from 'fs';
import path from 'path';

import { rootDir, version } from './constant.js';

import action from './action.js';

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
	.action(action.list);

program
	.command('create')
	.description('Create contests')
	.action(action.create);

program
	.command('delete')
	.description('Delete contests')
	.action(action.delete);

program
	.command('open')
	.description('Open contest in vscode')
	.action(action.open);

program
	.command('mark')
	.description('Mark contest as done')
	.action(action.mark);

program
	.command('unmark')
	.description('Unmark contest as done')
	.action(action.unmark);

program
	.command('export')
	.description(
		'Export contest to another folder that you can share it easily',
	)
	.action(action.export);

program.parse();
