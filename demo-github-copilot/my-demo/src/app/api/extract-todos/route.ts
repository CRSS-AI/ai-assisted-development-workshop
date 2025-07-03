import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import { extractTodoListFromText } from '../../../Agent/todoAgent.js';

// Disable body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    let text = '';
    
    // Check if text was provided directly
    const textField = formData.get('text') as string;
    if (textField) {
      text = textField;
    }
    // Check if a file was uploaded
    else {
      const file = formData.get('file') as File;
      if (file) {
        // Validate file type
        const validTypes = [
          'text/plain',
          'text/markdown',
          'application/markdown'
        ];
        const validExtensions = ['.txt', '.md'];
        
        const isValidType = validTypes.includes(file.type) || 
                           validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
        
        if (!isValidType) {
          return NextResponse.json(
            { error: 'Invalid file type. Please upload a .txt or .md file.' },
            { status: 400 }
          );
        }

        text = await file.text();
      }
    }

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: 'No text or file provided' },
        { status: 400 }
      );
    }

    // Extract todos using the AI agent
    const todoList = await extractTodoListFromText(text);
    
    return NextResponse.json({ 
      success: true, 
      todos: todoList,
      count: todoList.length 
    });

  } catch (error) {
    console.error('Error extracting todos:', error);
    return NextResponse.json(
      { 
        error: 'Failed to extract todos', 
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
