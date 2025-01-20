#!/usr/bin/env node

import { Command } from 'commander';

import './config/colors.js';
import './config/inquirer.js';
import { version } from './constants/index.js';

const program = new Command();

program
	.name('cp-contest-manager')
	.description(
		'Cli tool to manage competitive programming contest solution',
	)
	.version(version);

program.parse();
