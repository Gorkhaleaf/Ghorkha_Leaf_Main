import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, source } = body

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        {
          success: false,
          message: 'Email is required',
          error: {
            code: 'MISSING_EMAIL',
            message: 'Email field is required'
          }
        },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please enter a valid email address',
          error: {
            code: 'INVALID_EMAIL',
            message: 'Email format is invalid'
          }
        },
        { status: 400 }
      )
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock logic: simulate already subscribed for certain emails
    const alreadySubscribedEmails = ['test@example.com', 'existing@test.com']
    if (alreadySubscribedEmails.includes(email.toLowerCase())) {
      return NextResponse.json(
        {
          success: false,
          message: 'This email is already subscribed to our newsletter',
          error: {
            code: 'ALREADY_SUBSCRIBED',
            message: 'Email already exists in our database'
          }
        },
        { status: 409 }
      )
    }

    // Mock success response
    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to newsletter',
        data: {
          email: email.toLowerCase(),
          subscribed: true,
          timestamp: new Date().toISOString(),
          source: source || 'unknown',
          id: Math.random().toString(36).substr(2, 9)
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred'
        }
      },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message: 'Method not allowed',
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only POST requests are supported'
      }
    },
    { status: 405 }
  )
}