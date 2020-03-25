
let _isWindows = false;
let _isLinux = false;
let _userAgent: string | undefined = undefined;

export interface IProcessEnvironment {
	[key: string]: string;
}

interface INodeProcess {
	platform: string;
	env: IProcessEnvironment;
	getuid(): number;
	nextTick: Function;
	versions?: {
		electron?: string;
	};
	type?: string;
}
declare const process: INodeProcess;

interface INavigator {
	userAgent: string;
	language: string;
	maxTouchPoints?: number;
}
declare const navigator: INavigator;

const isElectronRenderer = (typeof process !== 'undefined' && typeof process.versions !== 'undefined' && typeof process.versions.electron !== 'undefined' && process.type === 'renderer');

if (typeof navigator === 'object' && !isElectronRenderer) {
	_userAgent = navigator.userAgent;
	_isWindows = _userAgent.indexOf('Windows') >= 0;
	_isLinux = _userAgent.indexOf('Linux') >= 0;
} else if (typeof process === 'object') {
	_isWindows = (process.platform === 'win32');
	_isLinux = (process.platform === 'linux');
}


export const isWindows = _isWindows;
export const isLinux = _isLinux;
