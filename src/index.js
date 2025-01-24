#!/usr/bin/env node

import { Command, Option } from 'commander';

import './config/colors.js';
import './config/inquirer.js';
import { version } from './constants/index.js';
import { getConfig } from './utils/config.js';

import config from './actions/config.js';
import list from './actions/list.js';

const program = new Command();

program
	.name('cpm')
	.description(
		'Cli tool to manage competitive programming contest solution',
	)
	.version(version);

program.hook('preAction', (thisCommand, actionCommand) => {
	const { contestDir } = getConfig();

	if (
		!contestDir &&
		actionCommand.name() !== 'config' &&
		actionCommand.name() !== 'help' &&
		actionCommand.name() !== thisCommand.name()
	) {
		console.log(
			"You haven't configured the contest directory yet. \nPlease run `cpm config` to configure the contest directory."
				.error,
		);
		process.exit(1);
	}
});

program
	.command('config')
	.description('Configure contest manager')
	.argument('[path]')
	.addOption(
		new Option(
			'-c, --content <content>',
			'Content to configure',
		).choices(['contest', 'export']),
	)
	.action(config);

program
	.command('list')
	.description('List contests')
	.option('-a, --ac', 'List only AC contests')
	.action(list);

program.parse(process.argv);
