This API operation can be used to modify an existing app installation. This includes the following changes:

- Changing the app version
- Changing the system software dependencies (like PHP and other system components)
- Changing the configuration parameters (`userInputs`)

## Usage notes

### Determining possible update candidates for `appVersionId`

When performing a version upgrade, the target version is identified by the `appVersionId` body parameter.

To determine the app ID of an existing app installation, use the <OperationLink operation="app-get-appinstallation" /> operation. The response of this operation contains the `appId` and `appVersion.current` properties which contain the relevant IDs.

Using the app ID, you can use the <OperationLink operation="app-list-update-candidates-for-appversion" /> operation to determine possible versions that you can upgrade to.

### Determining possible system softwares

When changing the system software dependencies of an app installation, you can use the <OperationLink operation="app-list-systemsoftwares" /> operation to determine the possible system software dependencies that you can set.

You can also use the <OperationLink operation="app-get-appversion" /> operation to determine the system software dependencies of a specific app version. The response of this operation contains a `.systemSoftwareDependencies` property which contains the relevant system software IDs, along with a semantic version range of compatible versions.

### Removing system software dependencies

Due to the semantics of the HTTP `PATCH` request, omitting a system software entirely from the request body will mean "leave unchanged". To explicitly _uninstall_ a system software dependency, explicitly set it to `null`:

<OperationExample withoutLink operation="app-patch-appinstallation" example={{
  systemSoftware: {
    "34220303-cb87-4592-8a95-2eb20a97b2ac": null
  }
}} />

### On user inputs

Pay attention to the `userInputs` parameter in the request body. This parameter is a list of objects, each with a `name` and `value` property.

The allowed values for `name` are dependent on the app version being installed. To determine the required inputs for a given app version, inspect the `userInputs` property of the app version object returned by the <OperationLink tag="App" operation="app-list-appversion" /> operation.
