
import { writeFileSync } from 'fs'
import { join } from 'path';
import * as vscode from 'vscode'
import { TextEncoder } from 'text-encoding'

import * as path from './path'
import { getDefaultHosts, getSelectedConfig, getConfigHosts, setConfigSelected, getConfigSelected } from './config'
import { writeElevated } from './file'
import { clearDNSCache } from './cache'

export const saveHosts = async (context: vscode.ExtensionContext) => {
  const defaultHosts = await getDefaultHosts(context)
  const configSelected = getConfigSelected()
  const selectedConfig = getSelectedConfig(configSelected)
  const fileString = selectedConfig ? `${defaultHosts}\n
# from switch-hosts
${selectedConfig}
` : defaultHosts
  
  await writeElevated(path.sysHostsPathString, fileString).then(()=> {
    vscode.window.showInformationMessage(`save hosts: ${configSelected.join(',')} sucess`, 'view').then(value => {
      if (value === 'view') {
        openSysHostsFile()
      }
    })
  }, (err: Error) =>{
    console.log(err)
    vscode.window.showErrorMessage('write system hosts failed')
    return Promise.reject(err)
  })
  // clearDNSCache()
}

export const selectedConfig = async (context: vscode.ExtensionContext) => {
  const configHosts = getConfigHosts()
  const configSelected = getConfigSelected()
  const quickPickItem:vscode.QuickPickItem[] = Object.keys(configHosts)
    .map(host => ({label:host, picked: configSelected.includes(host)}))

  const selected = await vscode.window.showQuickPick(quickPickItem,
    {placeHolder: 'Select the configs to switch', canPickMany: true })
  console.log(selected)
  if (!selected) return
  await setConfigSelected(selected.map(pickItem=>pickItem.label))
  await saveHosts(context)
}

export const openSysHostsFile = () => {
  vscode.workspace.openTextDocument(path.sysHostsPathString).then(document => {
    vscode.window.showTextDocument(document);
  }, error => {
      return vscode.window.showErrorMessage("fastHosts: " + error.message);
  });
}