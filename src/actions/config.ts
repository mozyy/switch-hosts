import { readFileSync, existsSync, writeFileSync } from 'fs'
import * as vscode from 'vscode';
import { TextEncoder, TextDecoder } from 'text-encoding'

import * as path from './path'

const workspaceConfigName = 'switchHosts'

interface switchSySConfig {
  default: string
}

interface WorkspaceConfig {
  [configName: string]: {
    [domain: string]: string
  }
}
interface hostsConfig {
  [configName: string]: string
}

export const updateDefaultHosts = async (context: vscode.ExtensionContext) => {
  const defaultHosts = readFileSync(path.sysHostsPathString, 'utf8')
  await context.globalState.update('default', defaultHosts)
  return defaultHosts
}

export const getDefaultHosts = async (context: vscode.ExtensionContext) => {
  let defaultHosts = context.globalState.get<string>('default');
  console.log(vscode)
  // vscode.commands.getCommands().then((r)=>
  //   console.log(r))
  // vscode.commands.executeCommand('workbench.action.files.save').then((r)=>{
  //   console.log(r)
  // })
  if (!defaultHosts) {
    defaultHosts = await updateDefaultHosts(context)
  }
  return defaultHosts
}

export const getConfigHosts = () => {
  const configuration = vscode.workspace.getConfiguration(workspaceConfigName)
  const workspaceConfig = configuration.get('config') as WorkspaceConfig
  return workspaceConfig
}
export const getConfigSelected = () => {
  const configuration = vscode.workspace.getConfiguration(workspaceConfigName)
  const selected = configuration.get('selected') as Array<string>
  return selected
}
export const setConfigSelected = (selected: string[]) => {
  const configuration = vscode.workspace.getConfiguration(workspaceConfigName)
  return configuration.update('selected', selected)
}

export const getSelectedConfig = (context: vscode.ExtensionContext) => {
  const configuration = vscode.workspace.getConfiguration(workspaceConfigName)
  const selected = configuration.get('selected') as Array<string>
  
  const workspaceConfig = configuration.get('config') as WorkspaceConfig
  // TODO: reset fail selected
  let selectedConfig = ''
  Object.entries(workspaceConfig).forEach(([configName, configValue])=>{
    if (selected.includes(configName)) {
      selectedConfig += `# ${configName}
${Object.entries(configValue).map(([domain, ip])=>`${ip} ${domain}`).join('\n')}
`
    }
  })

  return selectedConfig
}