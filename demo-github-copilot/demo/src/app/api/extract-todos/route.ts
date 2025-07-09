import { NextRequest, NextResponse } from 'next/server';
import { extractTodoListFromText } from '../../Agent/todoAgent.js';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check file type
    const allowedTypes = ['text/plain', 'text/markdown'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(file.type) && !['txt', 'md'].includes(fileExtension || '')) {
      return NextResponse.json({ 
        error: 'Invalid file type. Please upload a .txt or .md file.' 
      }, { status: 400 });
    }

    // Read file content
    const text = await file.text();
    
    if (!text.trim()) {
      return NextResponse.json({ error: 'File is empty' }, { status: 400 });
    }

    // Extract todos using the agent
    const todos = await extractTodoListFromText(text);
    
    return NextResponse.json({ 
      success: true, 
      todos,
      filename: file.name,
      fileSize: file.size
    });

  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json({ 
      error: 'Failed to process file. Please try again.' 
    }, { status: 500 });
  }
}
