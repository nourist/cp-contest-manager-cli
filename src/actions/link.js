import { execSync } from 'child_process';
import { getConfig } from '../utils/config.js';
import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';

export default async (url) => {
	const { contestDir } = getConfig();

	if (!url) {
		const ans = await inquirer.prompt([{
			type: 'input',
			name: 'url',
			message: 'Enter Git repository URL:',
			validate: (val) => val.trim() ? true : 'Please enter a valid URL'
		}]);
		url = ans.url.trim();
	}

	if (!fs.existsSync(contestDir)) {
		console.log('Contest directory not found.'.error);
		return;
	}

	try {
		// Initialize git if not already
		if (!fs.existsSync(path.join(contestDir, '.git'))) {
			execSync('git init', { cwd: contestDir, stdio: 'inherit' });
			console.log('Initialized empty Git repository.'.success);
		}

		// Check if remote origin already exists
		try {
			execSync('git remote get-url origin', { cwd: contestDir, stdio: 'ignore' });
			// If it doesn't throw, origin exists, so we set-url
			execSync(`git remote set-url origin ${url}`, { cwd: contestDir, stdio: 'inherit' });
			console.log(`Updated remote origin to: ${url}`.success);
		} catch (e) {
			// Origin doesn't exist, so add it
			execSync(`git remote add origin ${url}`, { cwd: contestDir, stdio: 'inherit' });
			console.log(`Added remote origin: ${url}`.success);
		}
	} catch (error) {
		console.log(`Failed to configure git repository: ${error.message}`.error);
	}
};
