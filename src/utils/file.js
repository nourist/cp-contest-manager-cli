import fs from 'fs-extra';
import path from 'path';

export const getLastUpdate = (dir) => {
	let res = fs.statSync(dir).mtime;

	const items = fs.readdirSync(dir);

	items.forEach((item) => {
		const fullPath = path.join(dir, item);
		const stats = fs.statSync(fullPath);

		res = Math.max(res, stats.mtime);

		if (stats.isDirectory()) {
			res = Math.max(res, getLastUpdate(fullPath));
		}
	});

	return res;
};

export const getSources = (dir) => {
	const items = fs.readdirSync(dir);

	const res = [];

	items.forEach((item) => {
		if (item === 'test') return;
		const fullPath = path.join(dir, item);
		const stats = fs.statSync(fullPath);
		const ext = path.extname(item);

		if (stats.isDirectory()) {
			res.push(...getSources(fullPath));
		} else if (ext === '.cpp' || ext === '.c' || ext === '.py') {
			res.push(path.basename(item, ext));
		}
	});

	return res;
};

export const renameSources = (dir, oldName, newName) => {
	const items = fs.readdirSync(dir);

	items.forEach((item) => {
		if (item === 'test') return;
		const fullPath = path.join(dir, item);
		const stats = fs.statSync(fullPath);
		const ext = path.extname(item);

		const fullname = path.basename(item, ext);

		if (fullname === oldName) {
			fs.renameSync(fullPath, path.join(dir, newName + ext));
		}

		if (stats.isDirectory()) {
			renameSrouces(fullPath, oldName, newName);
		} else if (ext === '.cpp' || ext === '.c' || ext === '.py') {
			const content = fs.readFileSync(fullPath, 'utf-8');
			content = content.replaceAll(
				new RegExp(oldName + '.', 'i'),
				newName + '.',
			);
		}
	});
};

export const exportSources = (dir, dest) => {
	const items = fs.readdirSync(dir);

	items.forEach((item) => {
		if (item === 'test') return;
		const fullPath = path.join(dir, item);
		const stats = fs.statSync(fullPath);
		const ext = path.extname(item);

		if (stats.isDirectory()) {
			exportSources(fullPath, dest);
		} else if (ext === '.cpp' || ext === '.c' || ext === '.py') {
			fs.copyFileSync(fullPath, path.join(dest, item));
		}
	});
};
