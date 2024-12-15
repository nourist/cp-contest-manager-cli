import fs from 'fs';
import path from 'path';

import { rootDir } from './constant.js';

export const getData = () => {
	const res = fs.readFileSync(path.join(rootDir, 'data.json'));
	return JSON.parse(res);
};

export const updateData = (data = {}) => {
	fs.writeFileSync(path.join(rootDir, 'data.json'), JSON.stringify(data));
};
