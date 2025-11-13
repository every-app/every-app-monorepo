# High Level Goal - End State
- List of installable apps in CoolApps marketplace
    - The information about these apps will be hardcoded in our repository. 
- When a user clicks add, this will: 
    1. Clone the github repo of that app
    1. Create an entry in the users `apps` table in the database with its status as `installing`
    1. Run the install script in the `installer` field on the `coolapps.json` file in the root of the repo
    1. Once the script completes, update the status to `installed`. If it errored, update it to `error`
- Archive app
    - Set app status to archived. These will hide it from the home screen. This status should be tracked seperately from the installation status

# Stepping stones 
- First, lets implement the schema to store which apps the user has installed. This will just implement CRUD functionality without implementing the `coolapps.jsonc` or doing anything with cloudflare infra
- Then, we'll implement a flow where the UX basically is like this: 
    - Click add app
    - Add app shows a list of instructions for how to spin up the project
    - Then, there will be a button to click once you've spun up the project which takes you to another page where you input the url for the service that you just spun up. 
    - Then, once you click "Finish adding app", it will create the record in the database pointing to that url. 
- Once, we get that working, we'll work on adding the installation script when the user adds an app. 

# Later (Don't plan for now
- Track all events related to app installations, updates and archives so that we can show it in a unified table
- Update app (Long term)
    - Run any app migrations that the user hasn't ran yet for the app 
- Delete app (Long term)
    - Delete the app completely. Delete all cloudflare infrastructure related to the app

