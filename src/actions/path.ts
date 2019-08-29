import { Uri } from 'vscode'

export const sysHostsDirString = process.platform === 'win32' ? `${process.env.windir || 'C:\\WINDOWS'}\\system32\\drivers\\etc\\` : '/etc/';
export const sysHostsPathString = sysHostsDirString + 'hosts';
// export const switchHostsConfigString = sysHostsPathString + 'hosts.switch-hosts.json'

export const sysHostsDir = Uri.file(sysHostsDirString)
export const sysHostsPath =Uri.file(sysHostsPathString)
// export const switchHostsConfig =Uri.file(switchHostsConfigString)
