# Next.js Project Setup with Agent Configuration

This guide will help you create the copilot aided Agentic Todo App.

## Setup Instructions

### 1. Create a new Next.js project in the demo-github-copilot folder

```bash
npx create-next-app@latest {project_name}
```

Replace `{project_name}` with your desired project name.

### 2. Navigate into the created project

```bash
cd {project_name}
```

### 3. Set up the agent

- Move the Agent folder into the created `src` directory

### 4. Create environment variables file

Create a `.env` file in the root of your project:

```bash
touch .env
```

Add the content Dani will provide in the chat to the `.env` file

### 5. Start the development server

```bash
npm run dev
```

Your Next.js application will be available at `http://localhost:3000`.

## Notes

- Make sure to add `.env` to your `.gitignore` file to keep sensitive information secure
- The agent files should be properly configured in the `src` directory
- Wait for Dani to provide the specific environment variable content for the `.env` file
- The agent will be deactivated after the workshop is complete.
