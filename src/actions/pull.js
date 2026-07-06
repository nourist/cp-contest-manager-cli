import { execSync } from 'child_process';
import { getConfig } from '../utils/config.js';

export default () => {
	const { contestDir } = getConfig();

	try {
		let branchName = 'main';
		try {
			branchName = execSync('git rev-parse --abbrev-ref HEAD', { cwd: contestDir, encoding: 'utf-8' }).trim();
		} catch (e) {
			// default to main if rev-parse fails
		}

		console.log(`Pulling from remote repository (branch ${branchName})...`.cyan);
		execSync(`git pull origin ${branchName}`, { cwd: contestDir, stdio: 'inherit' });
		
		console.log('Pulled successfully!'.success);
	} catch (error) {
		console.log(`Failed to pull from git repository. Please check your connection or remote configuration.`.error);
		console.log(`Error: ${error.message}`.error);
	}
};
