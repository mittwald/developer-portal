Update to the latest possible version:

```typescript
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { assertStatus } from "@mittwald/api-client-commons";

const client = MittwaldAPIClient.newWithToken(process.env.MITTWALD_API_TOKEN);

const appInstallationId = "<insert uuid here>";

// Retrieve app installation from API
const installationResponse = await mittwaldAPI.app.getAppinstallation({
  appInstallationId,
});
assertStatus(installationResponse, 200);

// Get versions to update to
const candidatesResponse = await mittwaldAPI.app.listUpdateCandidatesForAppversion({
  "appId": installationResponse.data.appId,
  "baseAppVersionId": installationResponse.data.appVersion.current
});
assertStatus(candidatesResponse, 200);

// Get recommended version
const recommendedVersion = candidatesResponse.data.find(version => version.recommended);

// Perform the update
const response = await mittwaldAPI.app.patchAppinstallation({
  appInstallationId,
  "data": {
    "appVersionId": recommendedVersion.id,
  }
});
assertStatus(response, 204);
```

Update PHP to latest compatible version:

```typescript
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { assertStatus } from "@mittwald/api-client-commons";

const client = MittwaldAPIClient.newWithToken(process.env.MITTWALD_API_TOKEN);

const appInstallationId = "<insert uuid here>";
const phpSoftwareId = "34220303-cb87-4592-8a95-2eb20a97b2ac";

// Retrieve app installation from API
const installationResponse = await mittwaldAPI.app.getAppinstallation({
  appInstallationId,
});
assertStatus(installationResponse, 200);

// Retrieve app version metadata
const versionResponse = await mittwaldAPI.app.getAppversion({
  appVersionId: installationResponse.data.appVersion.current
});
assertStatus(versionResponse, 200);

const phpVersionRange = versionResponse.data.systemSoftwareDependencies.find(dep => dep.systemSoftwareId === phpSoftwareId).versionRange;
const phpVersionsResponse = await mittwaldAPI.app.listSystemsoftwareVersions({
  "systemSoftwareId": phpSoftwareId,
  "versionRange": phpVersionRange
});
assertStatus(phpVersionsResponse, 200);

// Get recommended version
const recommendedVersion = phpVersionsResponse.data.find(version => version.recommended);

// Perform the update
const response = await mittwaldAPI.app.patchAppinstallation({
  appInstallationId,
  "data": {
    "systemSoftware": {
      [phpSoftwareId]: {
        "systemSoftwareVersion": recommendedVersion.id
      }
    }
  }
});
assertStatus(response, 204);
```