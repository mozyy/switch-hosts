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
  const configuration = getVscodeSwitchHostsConfig()
  const workspaceConfig = configuration.get<WorkspaceConfig>('config') || {}
  return workspaceConfig
}
export const getConfigSelected = () => {
  const configuration = getVscodeSwitchHostsConfig()
  const selected = configuration.get<string[]>('selected') || []
  return selected
}
export const setConfigSelected = (selected: string[]) => {
  const configuration = getVscodeSwitchHostsConfig()
  return configuration.update('selected', selected)
}

export const getSelectedConfig = (selected:string[]) => {
  const configuration = getVscodeSwitchHostsConfig()
  
  const workspaceConfig = configuration.get<WorkspaceConfig>('config') || {}
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

const getVscodeSwitchHostsConfig = () => {
  return vscode.workspace.getConfiguration(workspaceConfigName);
}
