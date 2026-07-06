import { execSync } from 'child_process';
import { getConfig } from './config.js';

export const autoCommitIfEnabled = (contestName, problems = null) => {
	const config = getConfig();
	if (!config.autoCommit) return;

	try {
		execSync(`git add "${contestName}"`, { cwd: config.contestDir, stdio: 'ignore' });
		
		const status = execSync('git status --porcelain', { cwd: config.contestDir, encoding: 'utf-8' });
		if (!status.trim()) return;

		let message = `AC: Contest ${contestName}`;
		if (problems && problems.length > 0) {
			message = `AC Update: ${problems.join(', ')} - Contest ${contestName}`;
		}
		
		execSync(`git commit -m "${message}"`, { cwd: config.contestDir, stdio: 'ignore' });
		console.log(`Auto committed: "${message}"`.gray);
	} catch (e) {
		// Ignore errors silently for auto commit to not interrupt the main workflow
	}
};
