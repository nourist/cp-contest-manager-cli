import appRootPath from 'app-root-path';
import fs from 'fs-extra';
import path from 'path';

export const dataTemplate = {};
export const dataFileName = 'data.json';

export const updateData = (data = dataTemplate) => {
	fs.writeFileSync(
		path.join(appRootPath.toString(), dataFileName),
		JSON.stringify(data),
	);
};

export const getData = () => {
	if (
		!fs.existsSync(
			path.join(appRootPath.toString(), dataFileName),
		)
	) {
		updateData();
	}

	return JSON.parse(
		fs.readFileSync(
			path.join(appRootPath.toString(), dataFileName),
		),
	);
};
