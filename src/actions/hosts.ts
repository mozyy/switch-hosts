
import { writeFileSync } from 'fs'
import { join } from 'path';
import * as vscode from 'vscode'
import { TextEncoder } from 'text-encoding'

import * as path from './path'
import { getDefaultHosts, getSelectedConfig, getConfigHosts, setConfigSelected, getConfigSelected } from './config'
import { writeElevated } from './file'

export const saveHosts = async (context: vscode.ExtensionContext) => {
  const defaultHosts = await getDefaultHosts(context)
const selectedConfig = getSelectedConfig(context)
const fileString = selectedConfig ? `${defaultHosts}\n
# from switch-hosts
${selectedConfig}
` : defaultHosts
  
  await writeElevated(path.sysHostsPathString, fileString)
  // TODO: clean hosts cache
  // vscode.workspace.fs.writeFile(path.sysHostsPath, new TextEncoder('utf-8').encode(fileString))
}

export const selectedConfig = async (context: vscode.ExtensionContext) => {
  const configHosts = getConfigHosts()
  const configSelected = getConfigSelected()
  const quickPickItem:vscode.QuickPickItem[] = Object.keys(configHosts)
    .map(host => ({label:host, picked: configSelected.includes(host)}))

  const selected = await vscode.window.showQuickPick(quickPickItem, {canPickMany: true}) || []
  await setConfigSelected(selected.map(pickItem=>pickItem.label))
  await saveHosts(context)
}