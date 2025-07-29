import { NextRequest, NextResponse } from 'next/server';
import { extractTodoListFromText } from '../../../Agent/todoAgent';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input: text is required and must be a string' },
        { status: 400 }
      );
    }

    // Call the todo extraction function
    const todos = await extractTodoListFromText(text);

    // Check if no todos were found
    if (todos.length === 0) {
      return NextResponse.json({
        success: true,
        todos: [],
        count: 0,
        message: "No todos found in the provided text"
      });
    }

    return NextResponse.json({
      success: true,
      todos: todos,
      count: todos.length
    });

  } catch (error) {
    console.error('Error in extract-todos API:', error);
    
    // Return a fallback response with mockup data if the AI service fails
    const fallbackTodos = [
      "Review quarterly reports",
      "Schedule team meeting for project planning", 
      "Update documentation for new features",
      "Respond to client emails",
      "Prepare presentation for stakeholders"
    ];

    return NextResponse.json({
      success: false,
      error: 'Failed to extract todos from AI service',
      todos: fallbackTodos,
      count: fallbackTodos.length,
      fallback: true
    }, { status: 200 }); // Return 200 so frontend can still display fallback data
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Extract todos API endpoint. Send POST request with text in body.',
    method: 'POST',
    expectedBody: { text: 'string' }
  });
}
