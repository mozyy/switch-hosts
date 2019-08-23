
import { writeFileSync } from 'fs'
import { join } from 'path';

export const saveHosts = (content: string) => {
  const sysHostsPath = process.platform === 'win32' ? `${process.env.windir || 'C:\\WINDOWS'}\\system32\\drivers\\etc\\hosts` : '/etc/hosts'
  writeFileSync(join(String(process.env.HOMEPATH), 'hosts'), content)
}