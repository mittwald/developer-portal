---
sidebar_label: Migrate Node.js App to Container
description: Step-by-step guide for migrating a mittwald mStudio Node.js app to a container
---

# Running a Node.js App in a Container – Migration Guide

## Introduction

This guide shows how to migrate an existing Node.js application in mittwald mStudio from the classic Node.js app environment to a container.

### Benefits of Container Migration

- **System Dependencies**: All required system binaries and tools are available
- **Reproducible Environment**: Identical development and production environments
- **Flexibility**: Free choice of base image and configuration

## Prerequisites

- Access to a mittwald mStudio project
- SSH access to the existing Node.js app
- A hosting plan that supports [containerized workloads](/docs/v2/platform/workloads/containers)

## Migration Process

### Step 1: Stop Current Node.js App

Connect to the Node.js app via SSH and stop the running application:

```bash
# Show processes
mittnitectl job list

# Output:
# The following processes are managed, and controllable:
#   ▶︎ node (running; reason=started; pid=203)

# Stop Node.js process
mittnitectl job stop node

# Output:
# ⏸️  stopping job node
# 🕑 waiting for job node to stop
# 😵 job node stopped
```

### Step 2: Prepare Application Code

There are two options to prepare the application code for the container:

#### Option A: Duplicate Code in Project

Connect to the Node.js app via SSH and copy the directory:

```bash
# Example: Copy the application directory
# Note: Paths must be adjusted to your actual directory structure
cp -r /html/nodejs-app /html/nodejs-container
```

#### Option B: Redeploy Code

Transfer the files using your preferred method, e.g., Git, CI/CD pipeline, or manually via `scp`/`rsync`:

```bash
# Example with rsync
rsync -avz ./my-app/ user@server:/html/nodejs-container/
```

### Step 3: Configure and Start Container

1. **Open mStudio** and navigate to the project

2. **Go to the container interface** within your mStudio project and select "Create container". Then configure:

   **Container Image:**
   - `node:24` for a specific version
   - `node:lts` for the current LTS version
   - Or any desired version number

   **Command:**
   ```bash
   # If code was duplicated (and yarn install was already executed):
   sh -c "cd /app && yarn start"
   
   # If code was redeployed (and yarn install has not been executed yet):
   sh -c "cd /app && yarn install && yarn start"
   ```

   **Volume Configuration:**
   - **Path in Project**: `/html/nodejs-container` (or the chosen directory)
   - **Mount Point in Container**: `/app`

   **Environment Variables:**
   ```env
   NODE_ENV=production
   PORT=3000  # Use the port from the previous Node.js app
   ```

   **Port Configuration:**
   - Add the same port the Node.js app was using
   - Enable port exposure

3. **Start container** using the "Start" button

### Step 4: Switch Domain

After successfully starting the container:

1. Navigate to domain settings in mStudio
2. Change the domain's target from the Node.js app to the new container

### Step 5: Verification and Cleanup

1. **Test the application** via the domain
2. **Check the container logs** for errors
3. **Monitoring**: Observe the application for some time

Once everything works properly:
- Delete the old Node.js app from your project
- Remove any unnecessary files

## Troubleshooting

### Container Won't Start

- Check the logs in mStudio
- Ensure all environment variables are correctly set
- Verify that the start command is correct

### Application Not Reachable

- Check the port configuration
- Ensure the application listens on the configured port
- Verify domain settings

### Missing Dependencies

If system dependencies are missing, consider:
- Using a different base image
- Creating a custom Dockerfile with the required dependencies

## Further Resources

- [Container Workloads Documentation](/docs/v2/platform/workloads/containers)
- [Node.js Apps Documentation](/docs/v2/platform/workloads/nodejs)
- [mittwald CLI Reference](/docs/v2/cli/reference/container)