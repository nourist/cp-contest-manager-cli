import appRootPath from 'app-root-path';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

/**
 * Returns the cross-platform config directory for the app.
 * - Windows: %APPDATA%\cpm  (e.g. C:\Users\HI\AppData\Roaming\cpm)
 * - Linux/macOS: ~/.config/cpm
 */
export const getConfigDir = () => {
	let dir;
	if (process.platform === 'win32') {
		const appData =
			process.env.APPDATA ||
			path.join(os.homedir(), 'AppData', 'Roaming');
		dir = path.join(appData, 'cpm');
	} else {
		const xdgConfig =
			process.env.XDG_CONFIG_HOME ||
			path.join(os.homedir(), '.config');
		dir = path.join(xdgConfig, 'cpm');
	}
	fs.ensureDirSync(dir);
	return dir;
};

export const configTemplate = { defaultLang: 'cpp', autoCommit: false, autoOpen: false, editor: 'vscode' };
export const configFileName = 'config.json';

export const updateConfig = (config = configTemplate) => {
	fs.writeFileSync(
		path.join(getConfigDir(), configFileName),
		JSON.stringify(config),
	);
};

export const getConfig = () => {
	const configPath = path.join(getConfigDir(), configFileName);

	// Auto-migrate old config from package root (for users upgrading)
	if (!fs.existsSync(configPath)) {
		const oldConfigPath = path.join(appRootPath.toString(), configFileName);
		if (fs.existsSync(oldConfigPath)) {
			try {
				fs.copySync(oldConfigPath, configPath);
			} catch (_) {
				updateConfig();
			}
		} else {
			updateConfig();
		}
	}

	const config = JSON.parse(
		fs.readFileSync(configPath),
	);

	if (!config.defaultLang) {
		config.defaultLang = 'cpp';
	}
	if (config.autoCommit === undefined) {
		config.autoCommit = false;
	}
	if (config.autoOpen === undefined) {
		config.autoOpen = false;
	}
	if (!config.editor) {
		config.editor = 'vscode';
	}

	return config;
};
