import { NextRequest, NextResponse } from 'next/server';
import { extractTodoListFromText } from '../../../Agent/todoAgent.js';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check file type
    const allowedTypes = ['text/plain', 'text/markdown', 'application/octet-stream'];
    const fileName = file.name.toLowerCase();
    const isValidFile = allowedTypes.includes(file.type) || 
                       fileName.endsWith('.txt') || 
                       fileName.endsWith('.md');

    if (!isValidFile) {
      return NextResponse.json({ 
        error: 'Invalid file type. Please upload a .txt or .md file' 
      }, { status: 400 });
    }

    // Read file content
    const text = await file.text();
    
    if (!text.trim()) {
      return NextResponse.json({ 
        error: 'File is empty. Please upload a file with content' 
      }, { status: 400 });
    }

    // Extract todos using the AI agent
    const todos = await extractTodoListFromText(text);
    
    return NextResponse.json({ 
      success: true, 
      todos,
      fileName: file.name 
    });

  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json({ 
      error: 'Failed to process file. Please try again.' 
    }, { status: 500 });
  }
}
