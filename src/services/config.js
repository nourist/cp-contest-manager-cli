import envPaths from 'env-paths';
import fs from 'fs';
import path from 'path';

import { appName } from '../constants';

const paths = envPaths(appName);
const configFile = path.join(paths.config, 'config.json');

const defaultConfig = {
	defaultEditor: 'code', //vscode
	defaultLanguage: 'cpp',
	exportDir: 'C:/Downloads', // Windows default download location
};

export const ensureDefaultConfig = () => {
	if (!fs.existsSync(paths.config)) {
		fs.mkdirSync(paths.config, { recursive: true });
	}

	if (!fs.existsSync(configFile)) {
		fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, 2), 'utf-8');
	}
};

export const getAll = () => {
	const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
	return {
		...defaultConfig,
		...config,
	};
};

export const get = (key) => {
	const config = getAll();
	if (key in config) {
		return config[key];
	} else {
		return null;
	}
};

export const setAll = (newConfig) => {
	const config = {
		...getAll(),
		...newConfig,
	};
	fs.writeFileSync(configFile, JSON.stringify(config, null, 2), 'utf-8');
};

export const set = (key, value) => {
	const config = getAll();
	config[key] = value;
	setAll(config);
};

export const reset = () => {
	fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, 2), 'utf-8');
};
