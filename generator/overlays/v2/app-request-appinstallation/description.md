This API operation requests a new app installation.

## Usage notes

### Determining the `appVersionId`

Both the app that should be installed and the specific version are identified by the `appVersionId` body parameter.

To determine available apps, use the <OperationLink tag="App" operation="app-list-apps" /> API operation. To determine available versions for a given app, use the app ID (as returned by the `app-list-apps` operation) as input parameter for the <OperationLink tag="App" operation="app-list-appversions" /> operation.

### On user inputs

Pay attention to the `userInputs` parameter in the request body. This parameter is a list of objects, each with a `name` and `value` property.

The allowed values for `name` are dependent on the app version being installed. To determine the required inputs for a given app version, inspect the `userInputs` property of the app version object returned by the <OperationLink tag="App" operation="app-list-appversions" /> operation.

### Determining when the installation is complete

Note that this operation does not block until the installation is complete. To determine the status of the installation, use the <OperationLink tag="App" operation="app-get-appinstallation" /> operation. When the operation is complete, the `.appVersion.current` property will be equal to `.appVersion.desired`.