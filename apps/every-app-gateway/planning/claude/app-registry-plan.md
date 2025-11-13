# Simplified Dynamic App Registry Plan

A minimal stepping stone to enable users to add custom apps manually.

## Current State
- Apps hardcoded in `embedded-app-registry.ts`
- No user-specific app storage
- Static app list served via API

## Goal
Enable users to add their own apps by providing a URL after manual deployment.

## Implementation

### 1. Database Schema (Simple)
Add one table to store user apps:

```sql
CREATE TABLE user_apps (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  app_id TEXT NOT NULL,     -- simple identifier like 'my-todo-app'
  name TEXT NOT NULL,       -- display name
  description TEXT NOT NULL,
  app_url TEXT NOT NULL,    -- user-provided URL
  status TEXT NOT NULL DEFAULT 'installed', -- 'installed' or 'archived'
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
```

### 2. Server Functions (TanStack Start RPC)
Use server functions instead of HTTP API endpoints (following the pattern in `@apps/todo-app/src/utils/todos.ts`):
- `getUserApps()` - return user's installed apps from database (replaces `GET /api/embedded/apps`)
- `getMarketplaceApps()` - return hardcoded recommended apps list
- `createUserApp()` - create new app installation (with validation)

### 3. Two Add App Flows

**Flow A: Install Recommended App**
1. User clicks "Add App" button  
2. Show list of recommended apps (from hardcoded registry)
3. User selects an app (pre-fills name, description, app_id)
4. Simple form with just:
   - App URL (user provides after manual deployment)
5. Submit creates database record with pre-filled metadata

**Flow B: Add Custom App**
1. User clicks "Add Custom App" button
2. Full form with all fields:
   - App ID (user-defined identifier)
   - App Name
   - Description
   - App URL
3. Submit creates database record
4. App appears in their list

### 4. UI Changes
- Add "Add App" and "Add Custom App" buttons to home page
- Two modals:
  - **Add App Modal**: Shows recommended apps list, then URL input form
  - **Add Custom App Modal**: Full form for custom apps
- Update existing `AppCard` to show user's apps from database

## Implementation Steps
1. Create database schema and migration
2. Create server functions in `src/utils/user-apps.ts` (following `@apps/todo-app/src/utils/todos.ts` pattern):
   - `getUserApps()` with auth middleware
   - `getMarketplaceApps()` 
   - `createUserApp()` with validation and auth middleware
3. Create React hooks in `src/api-hooks/` that use the server functions
4. Update existing components to use new hooks instead of API calls
5. Create two UI flows:
   - "Add App" modal with recommended apps list + URL form
   - "Add Custom App" modal with full form
6. Test both flows end-to-end

## What We're NOT Doing (Yet)
- No marketplace of available apps
- No installation instructions or setup wizards
- No app management (edit/delete)
- No installation event tracking
- No automated deployment
- No app health monitoring
