import { execSync } from 'child_process';
import path from 'path';
import appRootPath from 'app-root-path';
import fs from 'fs-extra';

export default () => {
    const templatePath = path.join(appRootPath.toString(), 'src', 'template', 'cpp.txt');
    
    if (!fs.existsSync(templatePath)) {
        console.log('Template file does not exist!'.error);
        return;
    }

    console.log(`Opening template file in VS Code...`.cyan);
    try {
        execSync(`code "${templatePath}"`, { stdio: 'inherit' });
    } catch (e) {
        console.log('Failed to open VS Code. Please make sure `code` command is available in your PATH.'.error);
    }
};
