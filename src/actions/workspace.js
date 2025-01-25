import { exec } from 'child_process';

import { getConfig } from '../utils/config.js';

export default () => {
	const { contestDir } = getConfig();
	exec(`code -r ${contestDir}`);
};
