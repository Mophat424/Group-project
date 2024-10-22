
# Project Setup with Xata Database

This guide will help you set up the Xata database using the provided `schema.json` file after you have cloned the repository.

## Prerequisites

Before setting up the Xata database, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **Xata CLI** (Follow the installation steps below)
- An active **Xata account** (Sign up [here](https://xata.io))

## Step 1: Install Xata CLI

1. Open your terminal or command prompt.
2. Install the Xata CLI globally by running:

   ```bash
   npm install -g @xata.io/cli
   ```

3. Verify that Xata CLI is installed by checking the version:

   ```bash
   xata --version
   ```

## Step 2: Login to Xata

Once the Xata CLI is installed, authenticate your Xata account:

```bash
xata auth login
```

Follow the prompts to log in through your web browser.

## Step 3: Set up a New Xata Workspace

If you don’t already have a workspace, create one:

```bash
xata init
```

- Choose or create a workspace.
- You will be prompted to select a database name. You can either choose an existing database or create a new one for this project.
  
## Step 4: Upload the Database Schema

Now that you are logged in and have a workspace ready, it’s time to upload the `schema.json` file to set up the necessary tables:

1. Navigate to the directory containing your `schema.json` file:

   ```bash
   cd src/tables/
   ```

2. Upload the schema to your Xata database:

   ```bash
   xata schema upload schema.json
   ```

This command will create the required tables based on the schema defined in `schema.json`.

## Step 5: Verify the Schema

Once the schema has been uploaded, you can verify the tables in your Xata workspace by visiting your Xata dashboard:

1. Log in to [Xata](https://app.xata.io).
2. Select your workspace and database.
3. Check if the tables (e.g., `users`, `teams`, `projects`, `tasks`, `comments`, `userTeams`) are properly created.

## Step 6: Run Codegen 

After you’ve uploaded your schema, run the following command to generate the client code:

   ```bash
   xata codegen
   ```

This will generate the necessary code (e.g., xata.ts) in your project directory. 

## Step 7: Start the Project

Once the database is set up, you can proceed with the rest of the project:

1. Install the necessary dependencies:

   ```bash
   npm install
   ```

2. Run the project:

   ```bash
   npm start
   ```

Your project should now be connected to the Xata database, and you're ready to start developing!

---

## Troubleshooting

- If you encounter an error during schema upload, check your `schema.json` file for any issues or consult the [Xata schema documentation](https://xata.io/docs/schema).
- Make sure you’re in the correct workspace when uploading the schema.

---

## Useful Links

- [Xata Documentation](https://xata.io/docs)
- [Xata CLI Reference](https://xata.io/docs/cli)