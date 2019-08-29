import { tmpdir } from 'os';
import { join } from 'path';
import { writeFileSync, unlinkSync } from 'fs'
import { exec } from 'sudo-prompt';
import * as vscode from 'vscode'

export const sudoPromptCopy = async (source: string, target: string): Promise<void> => {

  // load sudo-prompt module lazy
  // const sudoPrompt = await import('sudo-prompt');

  return new Promise<void>((resolve, reject) => {
    const promptOptions = {
      name: 'switchHosts',
      icns: undefined
    };

    // TODO: 添加 cliPath [`"${this.environmentService.cliPath}"`];
    // https://github.com/microsoft/vscode/blob/21ce78cf25a7a3b82502f0fc9e764e7840b315b3/src/vs/platform/environment/node/environmentService.ts#L50
    const sudoCommand: string[] = [`"${join(vscode.env.appRoot, '..', '..', 'bin', 'code.cmd')}"`];

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

