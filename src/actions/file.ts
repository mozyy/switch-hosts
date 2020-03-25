import { tmpdir } from 'os';
import { join, dirname } from 'path';
import { writeFileSync, unlinkSync } from 'fs'
import { exec } from 'sudo-prompt';
import * as vscode from 'vscode'

import {isWindows, isLinux} from './platform'

const sudoPromptCopy = async (source: string, target: string): Promise<void> => {

  // load sudo-prompt module lazy
  // const sudoPrompt = await import('sudo-prompt');

  return new Promise<void>((resolve, reject) => {
    const promptOptions = {
      name: 'switchHosts',
      icns: undefined
    };

    // TODO: add cliPath [`"${this.environmentService.cliPath}"`];
    // https://github.com/microsoft/vscode/blob/21ce78cf25a7a3b82502f0fc9e764e7840b315b3/src/vs/platform/environment/node/environmentService.ts#L50
    const sudoCommand: string[] = [`"${cliPath}"`];

    // if (options && options.overwriteReadonly) {
    //   sudoCommand.push('--file-chmod');
    // }

    sudoCommand.push('--file-write', `"${source}"`, `"${target}"`);

    exec(sudoCommand.join(' '), promptOptions, (error: string, stdout: string, stderr: string) => {
      if (error || stderr) {
        reject(error || stderr);
      } else {
        resolve(undefined);
      }
    });
  });
}

export const writeElevated = async (path: string, content: string) => {

  //  ------ open and save by system text document start ---------
  // let doc = await vscode.workspace.openTextDocument(path); // calls back into the provider
  // const textEdit = await vscode.window.showTextDocument(doc, { preview: false });
  // textEdit.hide()
  // const range = new vscode.Range(doc.positionAt(0), doc.positionAt(doc.getText().length))
  // textEdit.edit(editBuilder=>{
  //   editBuilder.replace(range, content)
  // })
  // doc.save()
  //  ------ open and save by system text document end ---------

  // write into a tmp file first
  const tmpPath = join(tmpdir(), `code-elevated-${Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 6)}`);
  writeFileSync(tmpPath, content)

  // sudo prompt copy
  await sudoPromptCopy(tmpPath, path);

  // clean up
  // await rimraf(tmpPath);
  unlinkSync(tmpPath);
  // return this.fileService.resolve(resource, { resolveMetadata: true });
}

const  getPathFromAmdModule = (requirefn: typeof require, relativePath: string): string =>{
	return getUriFromAmdModule(requirefn, relativePath).fsPath;
}

const getUriFromAmdModule = (requirefn: any, relativePath: string): vscode.Uri => {
	return vscode.Uri.parse(requirefn.toUrl(relativePath));
}

const isBuilt = !process.env['VSCODE_DEV']
// const appRoot = dirname(getPathFromAmdModule(require, ''))
const appRoot = process.cwd() // TODO: need check appRoot, see above
const execPath = process.execPath


const getApplicationName = () => {
  if(vscode.env.appName.toLowerCase().indexOf('insiders') > -1){
    return 'code-insiders'
  }
  return 'code'
}

const getCLIPath = (execPath: string, appRoot: string, isBuilt: boolean): string => {

	// Windows
	if (isWindows) {
		if (isBuilt) {
			return join(dirname(execPath), 'bin', `${getApplicationName()}.cmd`); // 
		}

		return join(appRoot, 'scripts', 'code-cli.bat');
	}

	// Linux
	if (isLinux) {
		if (isBuilt) {
			return join(dirname(execPath), 'bin', `${getApplicationName()}`); // 
		}

		return join(appRoot, 'scripts', 'code-cli.sh');
	}

	// macOS
	if (isBuilt) {
		return join(appRoot, 'bin', 'code');
	}

	return join(appRoot, 'scripts', 'code-cli.sh');
}

const cliPath = getCLIPath(execPath, appRoot, isBuilt)
