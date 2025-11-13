# Updated Goal
Provide a standard way for apps to stand up cloudflare infra, deploy application code and apply migrations using Wrangler SDK for programmatic resource management.

## Requirements
- Every app should be namespaced within the users cloudflare account.
    - All resources will be prefaced with `coolapps-`. The values should be something like `coolapps-todo-app`. 
    - The workers, kv store and d1 should all have the same name. For now, its fine that apps only have one of each of these. 
- Before we try to initialize the infra, we will check if there is already a worker, kv or d1 resource which has the same key. If there is, we will error and tell the user that they must resolve the conflict. Either they have already ran the initial deploy in which case they don't need to run again or they need to rename / delete the existing resource in their cloudflare account.
- We should validate that their wrangler.jsonc is configured properly.
    - We should parse the file and strip the json comments. We should get the name property. This should be prefixed with `coolapps-`. We'll then use this value for the following step.
- **Updated**: Instead of using CLI commands, we'll use Wrangler SDK RPC calls to create resources programmatically.

## Deployment Logic
- **If no URL is provided**: Check if there is a wrangler.jsonc in the user's current directory
    - If the app is `coolapps-core`, proceed with deployment
    - If not, throw an error that the user must provide a GitHub URL for the app to deploy
- **If URL is provided**: Clone the repository so we can run the rest of the commands

## Resource Creation (Using Wrangler SDK)

### Dependencies
```json
{
  "dependencies": {
    "wrangler": "^3.x.x"
  }
}
```

### D1 Database Creation
```typescript
import { createD1Database } from "wrangler/d1/create";

const db = await createD1Database(config, accountId, "coolapps-todo-app")
```

### KV Namespace Creation
```typescript
import { kvNamespaceCreateCommand } from "wrangler/kv";

const result = await kvNamespaceCreateCommand.handler({
  namespace: "coolapps-todo-app"
}, { sdk });
```

### Worker Deployment
```typescript
import deploy from "wrangler/deploy/deploy";

const result = await deploy({
  config,
  accountId,
  entry,
  name: "coolapps-todo-app",
  // ... other deployment options
});
```

## Wrangler Configuration Updates
Once we create the d1 and kv resources, we should programmatically update the wrangler.jsonc to use the IDs that were just created:

```typescript
// Before 
{
	"name": "coolapps-todo-app",
    ...
	"kv_namespaces": [
		{
			"binding": "coolapps-todo-app",
			"id": "YOUR_ID"
		}
	],
	"d1_databases": [
		{
			"binding": "DB",
			"database_name": "coolapps-todo-app",
			"database_id": "YOUR_ID"
		}
	]
}

// After
{
	"name": "coolapps-todo-app",
    ...
	"kv_namespaces": [
		{
			"binding": "coolapps-todo-app",
			"id": "NEW_ID_FROM_SDK_CALL"
		}
	],
	"d1_databases": [
		{
			"binding": "DB",
			"database_name": "coolapps-todo-app",
			"database_id": "NEW_ID_FROM_SDK_CALL"
		}
	]
}
```

## Code Design

### Main Entry Point
- Deploy functionality accessed via `npx tsx coolapps/deploy.ts [optional-github-url]`
- Eventually part of a CLI, but standalone function for now

### Core Functions
1. **`deployApp(url?: string)`** - Main orchestration function
2. **`validateEnvironment()`** - Check current directory and wrangler.jsonc
3. **`checkExistingResources(appName: string)`** - Verify no conflicts exist
4. **`createCloudflareResources(appName: string)`** - Create D1, KV, and deploy worker
5. **`cloneRepository(url: string)`** - Clone external app repositories

### Wrangler Configuration Manager
Encapsulated class/module for wrangler.jsonc manipulation:
```typescript
class WranglerConfigManager {
  updateKVID(kvId: string): void
  updateD1ID(d1Id: string): void
  parseConfig(): WranglerConfig
  writeConfig(config: WranglerConfig): void
}
```

### Resource Management
```typescript
class CloudflareResourceManager {
  async createD1Database(name: string): Promise<{ id: string }>
  async createKVNamespace(name: string): Promise<{ id: string }>
  async deployWorker(config: WranglerConfig): Promise<void>
  async checkResourceExists(name: string, type: 'worker' | 'kv' | 'd1'): Promise<boolean>
}
```

### Error Handling
- Clear error messages for missing dependencies
- Validation of wrangler.jsonc format
- Conflict resolution guidance
- GitHub URL validation

### Flow
1. Parse command line arguments for optional GitHub URL
2. If no URL provided:
   - Check for wrangler.jsonc in current directory
   - Validate it's coolapps-core or throw error
3. If URL provided:
   - Clone repository to temporary directory
   - Change working directory to cloned repo
4. Validate wrangler.jsonc exists and is properly formatted
5. Extract app name and validate coolapps- prefix
6. Check for existing Cloudflare resources with same name
7. Create D1 database using Wrangler SDK
8. Create KV namespace using Wrangler SDK
9. Update wrangler.jsonc with new resource IDs
10. Deploy worker using Wrangler SDK
11. Clean up temporary directories if applicable
