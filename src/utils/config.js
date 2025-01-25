import appRootPath from 'app-root-path';
import fs from 'fs-extra';
import path from 'path';

export const configTemplate = {};
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

	return JSON.parse(
		fs.readFileSync(path.join(appRootPath.toString(), configFileName)),
	);
};
