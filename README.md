# switch-hosts

Fast and convenience switch hosts file for vs code.

## Features

switch system hosts for development.
![Features](images/features.gif)

<!-- ## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them. -->

## Extension Settings

This extension contributes the following settings:

* ```json
  "switchHosts.config": {
    "config name": {
      "domain": "ip"
    }
  },
  ```
* ```json
  "switchHosts.selected": [
    "config name"
  ],
  ```

## Known Issues

save system hosts file sudoCommand,
should use environmentService.cliPath, but not find this.environmentService.
see [environmentService](https://github.com/microsoft/vscode/blob/21ce78cf25a7a3b82502f0fc9e764e7840b315b3/src/vs/platform/environment/node/environmentService.ts#L50)

fix it: [launchEditor](https://github.com/facebook/create-react-app/blob/cc985d0b00b6f5dd4248aa590f139410177293fc/packages/react-dev-utils/launchEditor.js)

## Release Notes

### 1.0.0

Initial release of switch-hosts

### 2.0.0

Complete basic functions:

* hosts config
* hosts save
* hosts selected

### 2.1.0

* hosts update default hosts
* add README features gif

-----------------------------------------------------------------------------------------------------------


**Enjoy!**
