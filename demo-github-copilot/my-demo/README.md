# AI Todo Extractor

A Next.js application that uses Azure OpenAI to extract actionable todo lists from documents.

## Getting Started

### Prerequisites

- Node.js (version 20 or higher)
- Azure OpenAI API credentials

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Azure OpenAI credentials

3. Clear any existing build cache:
```bash
rm -rf .next
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- **AI-Powered Todo Extraction**: Uses Azure OpenAI GPT-4.1-mini to analyze documents
- **Modern Next.js Architecture**: Built with App Router and React 19
- **TypeScript Support**: Full type safety throughout the application
- **Tailwind CSS**: Modern styling with dark/light theme support
- **Robust Error Handling**: Fallback JSON parsing with regex pattern matching

## Project Structure

```
src/
├── Agent/
│   └── todoAgent.js          # AI agent for todo extraction
├── app/
│   ├── layout.tsx            # Root layout component
│   ├── page.tsx              # Homepage component
│   └── globals.css           # Global styles and Tailwind directives
└── pages/
    └── api/                  # API endpoints (expandable)
```

## Technologies

- **Framework**: Next.js 15.3.4 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4.1 (stable)
- **AI**: Azure OpenAI with LangChain integration
- **Development**: ESLint, PostCSS, Autoprefixer

## Development Scripts

- `npm run dev` - Start development server with turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

```env
AZURE_OPENAI_API_INSTANCE_NAME=your-instance-name
AZURE_OPENAI_API_DEPLOYMENT_NAME=your-deployment-name
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_API_VERSION=2024-04-01-preview
```

## Usage

The AI agent (`src/Agent/todoAgent.js`) provides a function to extract todo lists from text:

```javascript
import { extractTodoListFromText } from '@/Agent/todoAgent';

const todoList = await extractTodoListFromText("Your document text here");
console.log(todoList); // ["Task 1", "Task 2", ...]
```

## Workshop Purpose

This project serves as a foundation for AI-assisted development workshops, demonstrating:
- Azure OpenAI integration patterns
- Modern Next.js development practices
- TypeScript configuration
- Error handling strategies
- Extensible architecture for adding features

## Next Steps

- Add UI components for document upload
- Create API endpoints for todo extraction
- Implement file processing capabilities
- Add user authentication
- Enhance error handling and validation
