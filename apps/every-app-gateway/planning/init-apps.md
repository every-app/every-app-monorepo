# Goal
Provide a standard way for apps to stand up cloudflare infra, deploy application code and apply migrations. 

## Requirements
- Every app should be namespaced within the users cloudflare account.
    - All resources will be prefaced with `coolapps-`. The values should be something like `coolapps-todo-app`. 
    - The workers, kv store and d1 should all have the same name. For now, its fine that apps only have one of each of these. 
- Before we try to initialize the infra, we will check if there is already a worker, kv or d1 resource which has the same key. If there is, we will error and tell the user that they must resolve the conlfict. Either they have already ran the inital deploy in which case they don't need to run again or they need to rename / delete the existing resource in their cloudflare account. 
- We should validate that their wrangler.jsonc is configured properly.
    - We should parse the file and strip the json comments. We should get the name property. This should be prefixed with `coolapps-`. We'll then use this value for the following step. 
- If none of the resouces exist, we should run the commands to create them. Here would be an example:
```
npx wrangler d1 create coolapps-todo-app
npx wrangler k1 namespace create coolapps-todo-app
npx wrangler deploy
```
- Once we create the d1 and k1, we should create a function which programtically updates the wrangler.jsonc to use the ids that were just created for both of these. We should just make two functions `updateWrangelerKVID` and `updateWranglerD1ID`.
```
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
			"id": "NEW_ID_FROM_COMMAND"
		}
	],
	"d1_databases": [
		{
			"binding": "DB",
			"database_name": "coolapps-todo-app",
			"database_id": "NEW_ID_FROM_COMMAND"
		}
	]
}
``` 

## Code Design
- This whole deploy functionality should be one function that we run via a `npx tsx coolapps/deploy.ts` command. 
    - Eventually, this will be part of a CLI, but it should just be a standalone function fow now.
- For the functions for manipulating the wrangler file, can you encapsulate that in a class or module to make them grouped together nicely?
- Please break into small functions when it makes sense. 


