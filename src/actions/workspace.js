import { getConfig } from '../utils/config.js';
import { openEditorAsync } from '../utils/editor.js';

export default () => {
	const { contestDir } = getConfig();
	openEditorAsync(contestDir, true);
};

