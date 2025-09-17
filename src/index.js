#!/usr/bin/env node
import { Command } from 'commander';

import { appName, version } from './constants/index.js';
import { ensureDefaultConfig } from './services/config.js';
import { ensureDefaultTemplates } from './services/template.js';

ensureDefaultConfig();
ensureDefaultTemplates();

const program = new Command();

program
	.name(appName)
	.description('Cli tool to manage competitive programming contest ' + 'solution'.bgBlue)
	.version(version);

program.parse(process.argv);
