import { execSync } from 'child_process';
import { getConfig } from '../utils/config.js';
import fs from 'fs-extra';
import path from 'path';

export default () => {
	const { contestDir } = getConfig();

	if (!fs.existsSync(contestDir)) {
		console.log('Contest directory not found.'.error);
		return;
	}

	if (!fs.existsSync(path.join(contestDir, '.git'))) {
		console.log('No Git repository linked yet. Use `cpm link <url>` to link one.'.yellow);
		return;
	}

	try {
		const url = execSync('git remote get-url origin', {
			cwd: contestDir,
			encoding: 'utf8'
		}).trim();
		console.log(`Currently linked repository: ` + url.bgMagenta);
	} catch (error) {
		console.log('Git repository initialized but no remote origin found. Use `cpm link <url>` to link one.'.yellow);
	}
};
