import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

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

/**
 * Returns the directory where user templates are stored.
 * - Linux/macOS: ~/.config/cpm/templates/
 * - Windows: %APPDATA%\cpm\templates\
 * On first call, default templates (from package src/template/) are copied here
 * if they don't already exist.
 */
export const getTemplateDir = () => {
	const templateDir = path.join(getConfigDir(), 'templates');
	fs.ensureDirSync(templateDir);

	// Copy default templates bundled with the package on first-run
	try {
		const __filename = fileURLToPath(import.meta.url);
		const __dirname = path.dirname(__filename);
		const pkgTemplateDir = path.join(__dirname, '..', 'template');
		if (fs.existsSync(pkgTemplateDir)) {
			const defaults = fs.readdirSync(pkgTemplateDir);
			defaults.forEach((file) => {
				const dest = path.join(templateDir, file);
				if (!fs.existsSync(dest)) {
					fs.copyFileSync(path.join(pkgTemplateDir, file), dest);
				}
			});
		}
	} catch (_) {
		// Non-fatal: if copy fails, user starts with empty template dir
	}

	return templateDir;
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

	if (!fs.existsSync(configPath)) {
		updateConfig();
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
