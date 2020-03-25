// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { saveHosts, selectedConfig } from './actions/hosts'
import { updateDefaultHosts } from './actions/config'
import * as path from './actions/path'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "switch-hosts" is now active!');
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposableSaveConfig = vscode.commands.registerCommand('switch-hosts.saveConfig', ()=>{
		// The code you place here will be executed every time your command is executed

		saveHosts(context).catch((err: Error)=> {
			vscode.window.showErrorMessage(err.message)
		})
	});


	let disposableSelectedConfig = vscode.commands.registerCommand('switch-hosts.selectedConfig', async () => {
		selectedConfig(context).catch((err: Error)=> {
			vscode.window.showErrorMessage(err.message)
		})
	});

	let disposableUpdateDefaultHosts = vscode.commands.registerCommand('switch-hosts.updateDefaultHosts', async () => {
		updateDefaultHosts(context).catch((err: Error)=> {
			vscode.window.showErrorMessage(err.message)
		})
	});

	let disposableOpenHostsFile = vscode.commands.registerCommand('switch-hosts.openHostsFile', async () => {
		updateDefaultHosts(context).catch((err: Error)=> {
			vscode.window.showErrorMessage(err.message)
		})
	});

	context.subscriptions.push(disposableSaveConfig, disposableSelectedConfig, disposableUpdateDefaultHosts, disposableOpenHostsFile);
}

// this method is called when your extension is deactivated
export function deactivate() {}
