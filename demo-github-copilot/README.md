# 🤖 Agentic To-Do List - Next.js Edition

An AI-powered application built with Next.js that transforms documents into intelligent, prioritized to-do lists using LangChain.js and foundational models.

## 🚀 Features

- **Next.js 14**: Modern React framework with App Router
- **AI-Powered Processing**: Uses Claude (Anthropic) or GPT-4 (OpenAI) via LangChain.js
- **Document Support**: .txt and .md file processing
- **Smart Analysis**: Automatic task extraction with priority and size estimation
- **Beautiful UI**: Tailwind CSS with drag-and-drop interface
- **TypeScript**: Full type safety throughout the application
- **REST API**: Clean `/api/make_todo_list` endpoint

## 🏗️ Architecture

```
Next.js App Router
├── /app
│   ├── page.tsx              # Main page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   └── /api/make_todo_list
│       └── route.ts          # API endpoint
├── /components
│   └── TodoUploader.tsx      # Main UI component
└── /lib
    └── todoAgent.ts          # LangChain.js AI agent
```

## 📋 Prerequisites

- Node.js 18+ and npm
- API key for either:
  - **Anthropic Claude** (recommended): [Get API key](https://console.anthropic.com/)
  - **OpenAI GPT-4**: [Get API key](https://platform.openai.com/)

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your API key:

```env
# For Anthropic Claude (recommended)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# OR for OpenAI GPT-4
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📖 API Usage

### POST `/api/make_todo_list`

Upload a document and receive an AI-generated to-do list.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: File upload with key 'document'
- Supported formats: .txt, .md files (max 10MB)

**Response:**
```json
{
  "success": true,
  "document": {
    "name": "project-plan.md",
    "size": 2048,
    "type": "text/markdown"
  },
  "todoList": {
    "title": "E-commerce Development Tasks",
    "totalTasks": 8,
    "tasks": [
      {
        "id": 1,
        "task": "Set up Node.js server with Express framework",
        "description": "Initialize backend infrastructure",
        "priority": "high",
        "size": "medium",
        "estimatedTime": "4 hours",
        "category": "Backend",
        "dependencies": []
      }
    ],
    "summary": "Comprehensive development tasks for e-commerce platform"
  }
}
```

## 🤖 AI Agent Details

The `TodoAgent` class leverages LangChain.js to:

- **Analyze Documents**: Extract actionable tasks from text content
- **Smart Prioritization**: Assign urgency levels (urgent, high, medium, low)
- **Size Estimation**: Evaluate complexity (small, medium, large, xl)
- **Dependency Detection**: Identify task relationships
- **Validation**: Ensure structured JSON output with Zod schema
- **Retry Logic**: Multiple attempts with fallback mechanisms

### Task Properties

- **Priority Levels**:
  - `urgent`: Critical, immediate action required
  - `high`: Important with tight deadlines
  - `medium`: Standard priority
  - `low`: Nice-to-have, flexible timing

- **Size Categories**:
  - `small`: < 30 minutes
  - `medium`: 30 minutes - 2 hours
  - `large`: 2-8 hours
  - `xl`: > 8 hours (should be broken down)

## 🎨 Frontend Features

- **Modern Design**: Clean, professional interface with gradients
- **Drag & Drop**: Intuitive file upload experience
- **Real-time Feedback**: Loading states and error handling
- **Responsive Layout**: Works on desktop and mobile
- **Visual Prioritization**: Color-coded task priorities
- **JSON Preview**: View raw JSON output in new window
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🧪 Testing

Upload the included `sample-ecommerce-project.md` file to test the AI agent:

1. Start the development server
2. Open http://localhost:3000
3. Upload the sample file or drag & drop it
4. Watch the AI analyze and generate tasks
5. View the prioritized to-do list with categorization

## 🔧 Customization

### Adding New File Types

Modify the validation in both:
- `components/TodoUploader.tsx` (line ~26)
- `app/api/make_todo_list/route.ts` (line ~19)

### Adjusting AI Behavior

Edit the system prompt in `lib/todoAgent.ts` to modify how the AI analyzes documents and generates tasks.

### Styling Changes

Update Tailwind classes in the components or modify `app/globals.css` for global styles.

## 🚦 Troubleshooting

### Common Issues

1. **TypeScript Errors During Development**
   - Run `npm install` to ensure all dependencies are installed
   - Restart the TypeScript server in your IDE

2. **API Key Issues**
   - Verify your API key is correctly set in `.env.local`
   - Restart the development server after adding environment variables
   - Check your API account has sufficient credits

3. **File Upload Fails**
   - Ensure file is .txt or .md format
   - Check file size is under 10MB
   - Verify browser allows file uploads

4. **AI Generation Fails**
   - Check console logs for detailed error messages
   - Verify API key permissions and usage limits
   - The system provides fallback task generation if AI fails

### Development Tips

- Use `npm run dev` for hot reloading during development
- Check browser console and terminal for debugging information
- Test with various document types and sizes
- Monitor your API usage and costs

## 📦 Production Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables for Production

Ensure your production environment has the required API keys:

```env
ANTHROPIC_API_KEY=your_production_key
# OR
OPENAI_API_KEY=your_production_key
```

### Deployment Platforms

This Next.js app can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker containers**

## 📄 License

MIT License - feel free to use this project for learning and development!

## 🤝 Contributing

This is a demo project showcasing AI-powered document processing. Potential enhancements:

- Additional file format support (PDF, DOCX)
- Task completion tracking
- Export to project management tools
- Multiple AI model comparison
- Collaborative features
- Integration with calendar apps

---

Built with ❤️ using Next.js 14, TypeScript, Tailwind CSS, and LangChain.js
