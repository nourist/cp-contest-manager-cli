import { exec } from 'child_process';

import { getConfig } from '../utils/config.js';

export default () => {
	const { contestDir, editor } = getConfig();
	const cmd = editor === 'zed' ? `zed ${contestDir}` : `code -r ${contestDir}`;
	exec(cmd);
};
