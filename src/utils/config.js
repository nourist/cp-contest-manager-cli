import appRootPath from 'app-root-path';
import fs from 'fs-extra';
import path from 'path';

export const configTemplate = { defaultLang: 'cpp', autoCommit: false };
export const configFileName = 'config.json';

export const updateConfig = (config = configTemplate) => {
	fs.writeFileSync(
		path.join(appRootPath.toString(), configFileName),
		JSON.stringify(config),
	);
};

export const getConfig = () => {
	if (
		!fs.existsSync(path.join(appRootPath.toString(), configFileName))
	) {
		updateConfig();
	}

	const config = JSON.parse(
		fs.readFileSync(path.join(appRootPath.toString(), configFileName)),
	);
	
	if (!config.defaultLang) {
		config.defaultLang = 'cpp';
	}
	if (config.autoCommit === undefined) {
		config.autoCommit = false;
	}
	
	return config;
};
