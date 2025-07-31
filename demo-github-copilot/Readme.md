# Next.js Project Setup with Agent Configuration

This guide will help you create the copilot aided Agentic Todo App.

## Setup Instructions

### 1. Install npm

```bash
npm install
```

### 2. Create environment variables file

Create a `.env` file in the root of your project:

```bash
touch .env
```

Add the content that will be provided in the chat to the `.env` file

### 3. Start the development server

```bash
npm run dev
```

Your Next.js application will be available at `http://localhost:3000`.

## Notes

- Make sure to add `.env` to your `.gitignore` file to keep sensitive information secure
- Install npm if needed.
- The agent files should be properly configured in the `src` directory
- Wait for Dani to provide the specific environment variable content for the `.env` file
- The agent will be deactivated after the workshop is complete.

Prompt
Using next.js, create a simple page that receives a txt or .md file from the user. the text must be sent to the extractTodoListfromText function in the Agent/todoAgent.js, which uses an Azure Open Ai model and a .env file that already exists. This should return a json file that should be displayed in the front end as the result. Make sure to delete the content of any existing page before developing the page for the app. Handle errors so that when an invalid format is used for the file upload, the app does not break. Also create a mockup version of the to do list. If the file upload does not work, display the mockup instead in the front end.