import { execSync } from 'child_process';
import { getConfig } from '../utils/config.js';

export default (message) => {
	const { contestDir } = getConfig();
	const baseCommitMsg = message ? ` - ${message}` : '';

	try {
		// Unstage any previously staged files to ensure clean commits
		try {
			execSync('git reset', { cwd: contestDir, stdio: 'ignore' });
		} catch (e) {}

		// Get all changed files
		let statusOutput = '';
		try {
			statusOutput = execSync('git status --porcelain', { cwd: contestDir, encoding: 'utf-8' });
		} catch (e) {
			console.log('Failed to get git status.'.error);
			return;
		}

		if (!statusOutput.trim()) {
			console.log('No changes to commit.'.yellow);
		} else {
			const lines = statusOutput.trim().split(/\r?\n/);
			const contestChanges = new Set();
			const rootFiles = new Set();

			for (const line of lines) {
				if (!line) continue;
				// The path starts at index 3 in `git status --porcelain`
				// For renames (e.g. `R  old -> new`), we extract the new path
				let filePath = line.substring(3).trim();
				// Handle quotes if file name has spaces
				filePath = filePath.replace(/^"|"$/g, ''); 
				if (filePath.includes(' -> ')) {
					// It's a rename, get the destination path
					filePath = filePath.split(' -> ')[1].replace(/^"|"$/g, '');
				}

				const parts = filePath.split('/');
				
				if (parts.length > 1) {
					// It's in a subdirectory (contest name)
					contestChanges.add(parts[0]);
				} else {
					// It's a file in the root of the repo
					rootFiles.add(filePath);
				}
			}

			let hasCommits = false;

			// Commit per contest
			for (const contest of contestChanges) {
				console.log(`Adding changes for contest: ${contest}...`.cyan);
				execSync(`git add "${contest}"`, { cwd: contestDir, stdio: 'ignore' });
				
				const commitMsg = `Update contest: ${contest}${baseCommitMsg}`;
				console.log(`Committing contest ${contest}...`.cyan);
				try {
					execSync(`git commit -m "${commitMsg}"`, { cwd: contestDir, stdio: 'ignore' });
					hasCommits = true;
				} catch (e) {
					console.log(`Failed to commit contest ${contest}`.yellow);
				}
			}

			// Commit root files if any
			if (rootFiles.size > 0) {
				console.log(`Adding general changes...`.cyan);
				for (const file of rootFiles) {
					execSync(`git add "${file}"`, { cwd: contestDir, stdio: 'ignore' });
				}
				const commitMsg = `Update: general changes${baseCommitMsg}`;
				console.log(`Committing general changes...`.cyan);
				try {
					execSync(`git commit -m "${commitMsg}"`, { cwd: contestDir, stdio: 'ignore' });
					hasCommits = true;
				} catch (e) {}
			}

			if (!hasCommits) {
				console.log('Nothing was committed.'.yellow);
			}
		}

		let branchName = 'main';
		try {
			branchName = execSync('git rev-parse --abbrev-ref HEAD', { cwd: contestDir, encoding: 'utf-8' }).trim();
		} catch (e) {
			// default to main if rev-parse fails
		}

		console.log(`Pushing to remote repository (branch ${branchName})...`.cyan);
		execSync(`git push -u origin ${branchName}`, { cwd: contestDir, stdio: 'inherit' });
		
		console.log('Pushed successfully!'.success);
	} catch (error) {
		console.log(`Failed to push to git repository. Please check if your remote is configured correctly and you have push access.`.error);
		console.log(`Error: ${error.message}`.error);
	}
};
