#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';

const program = new Command();

/*
Create root project
Data will auto save in volume D
*/

const rootDir = 'D:/cpm';

if (!fs.existsSync(rootDir)) {
	fs.mkdirSync(rootDir);
}

/*
Create data file
*/

if (!fs.existsSync(path.join(rootDir, 'data.json'))) {
	fs.writeFileSync(path.join(rootDir, 'data.json'), '{}');
}

program
	.name('cp-contest-manager')
	.description('Cli tool to manage competitive programming contest')
	.version('0.0.1'); //BETA

program.command('list').action((str, option) => {
	console.log('LIST');
});

program.command('create').action((str, option) => {
	console.log('CREATE');
});

program.command('delete').action((str, option) => {
	console.log('DELETE');
});

program.command('open').action((str, option) => {
	console.log('OPEN');
});

program.command('export').action((str, option) => {
	console.log('EXPORT');
});

program.parse();
