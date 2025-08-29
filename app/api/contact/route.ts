// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with error handling
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let supabase: any = null
if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey)
} else {
  console.warn('Supabase configuration missing - contacts will not be saved to database')
}

// Create nodemailer transporter with better error handling and fallback options
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER
  const emailPass = process.env.EMAIL_PASS
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = process.env.SMTP_PORT
  const sendgridApiKey = process.env.SENDGRID_API_KEY

  // Try SendGrid first (most reliable for production)
  if (sendgridApiKey) {
    console.log('Using SendGrid for email delivery')
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: 'apikey',
        pass: sendgridApiKey,
      },
    } as any)
  }

  // Try custom SMTP configuration
  if (smtpHost && smtpPort) {
    console.log('Using custom SMTP configuration')
    return nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: parseInt(smtpPort) === 465,
      auth: emailUser && emailPass ? {
        user: emailUser,
        pass: emailPass,
      } : undefined,
    } as any)
  }

  // Fallback to Gmail
  if (emailUser && emailPass) {
    console.log('Using Gmail SMTP (fallback)')
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    } as any)
  }

  console.error('No email configuration found')
  return null
}

const transporter = createTransporter()

export async function POST(request: NextRequest) {
  try {
    // Check if email transporter is configured
    if (!transporter) {
      console.error('Email transporter not configured')
      return NextResponse.json(
        { error: 'Email service is not configured. Please contact us directly at gorkhaleaf@gmail.com' },
        { status: 500 }
      )
    }

    const { name, email, message } = await request.json()

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Create contact object
    const contact = {
      id: Date.now(),
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-IN'),
      time: new Date().toLocaleTimeString('en-IN')
    }

    // Save to Supabase database (if available)
    if (supabase) {
      try {
        const { error } = await supabase
          .from('contacts')
          .insert([contact])

        if (error) {
          console.error('Error saving contact to database:', error)
          // Continue with the process even if database save fails
        } else {
          console.log('Contact saved to database successfully')
        }
      } catch (dbError) {
        console.error('Database operation failed:', dbError)
        // Continue with the process even if database save fails
      }
    } else {
      console.log('Database not configured - contact data will only be sent via email')
    }

    // Send email to owner with table format
    try {
      console.log('Attempting to send email to owner...')
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: 'gorkhaleaf@gmail.com',
        cc: process.env.EMAIL_USER, // CC yourself
        subject: `New Contact Form Submission - Ghorkha Leaf`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #16a34a; text-align: center; margin-bottom: 30px;">New Contact Form Submission</h2>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #f9fafb; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <thead>
                <tr style="background-color: #16a34a; color: white;">
                  <th style="padding: 15px; text-align: left; font-weight: bold; border-bottom: 2px solid #15803d;">Field</th>
                  <th style="padding: 15px; text-align: left; font-weight: bold; border-bottom: 2px solid #15803d;">Details</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 12px 15px; font-weight: 600; color: #374151; background-color: #f3f4f6;">Contact ID</td>
                  <td style="padding: 12px 15px; color: #4b5563;">#${contact.id}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 12px 15px; font-weight: 600; color: #374151; background-color: #f3f4f6;">Name</td>
                  <td style="padding: 12px 15px; color: #4b5563;">${name}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 12px 15px; font-weight: 600; color: #374151; background-color: #f3f4f6;">Email</td>
                  <td style="padding: 12px 15px; color: #4b5563;"><a href="mailto:${email}" style="color: #16a34a; text-decoration: none;">${email}</a></td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 12px 15px; font-weight: 600; color: #374151; background-color: #f3f4f6;">Date</td>
                  <td style="padding: 12px 15px; color: #4b5563;">${contact.date}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 12px 15px; font-weight: 600; color: #374151; background-color: #f3f4f6;">Time</td>
                  <td style="padding: 12px 15px; color: #4b5563;">${contact.time}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 15px; font-weight: 600; color: #374151; background-color: #f3f4f6; vertical-align: top;">Message</td>
                  <td style="padding: 12px 15px; color: #4b5563; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</td>
                </tr>
              </tbody>
            </table>

            <div style="margin-top: 30px; padding: 20px; background-color: #f0fdf4; border-radius: 8px; border-left: 4px solid #16a34a;">
              <h3 style="color: #15803d; margin: 0 0 10px 0; font-size: 16px;">Quick Actions</h3>
              <p style="margin: 5px 0; color: #166534;">
                <strong>Reply:</strong> <a href="mailto:${email}?subject=Re: Your inquiry to Ghorkha Leaf" style="color: #16a34a; text-decoration: none;">Click to reply directly</a>
              </p>
              <p style="margin: 5px 0; color: #166534;">
                <strong>Call:</strong> Contact customer for immediate response
              </p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                This email was automatically generated from the Ghorkha Leaf contact form.<br>
                Timestamp: ${contact.timestamp}
              </p>
            </div>
          </div>
        `,
      })
      console.log('Owner email sent successfully')
    } catch (emailError) {
      console.error('Failed to send email to owner:', emailError)
      // Continue with the process even if owner email fails
    }

    // Send confirmation email to user
    try {
      console.log('Attempting to send confirmation email to user...')
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Thank you for contacting Ghorkha Leaf!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #16a34a;">Thank You for Your Message!</h2>
            <p>Dear ${name},</p>
            <p>Thank you for reaching out to Ghorkha Leaf. We have received your message and will get back to you as soon as possible.</p>

            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
              <h3 style="color: #15803d; margin-top: 0;">Your Message:</h3>
              <p style="line-height: 1.6; color: #166534;">${message}</p>
            </div>

            <p>We typically respond within 24-48 hours during business days.</p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Best regards,<br>
                The Ghorkha Leaf Team<br>
                <a href="mailto:gorkhaleaf@gmail.com" style="color: #16a34a;">gorkhaleaf@gmail.com</a>
              </p>
            </div>
          </div>
        `,
      })
      console.log('Confirmation email sent successfully to user')
    } catch (emailError) {
      console.error('Failed to send confirmation email to user:', emailError)
      // Continue with the process even if user email fails
    }

    return NextResponse.json(
      { success: true, message: 'Contact form submitted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Failed to process contact form' },
      { status: 500 }
    )
  }
}
