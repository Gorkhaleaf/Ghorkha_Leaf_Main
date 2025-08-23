// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'

// Create contacts directory if it doesn't exist
const contactsDir = path.join(process.cwd(), 'data')
const contactsFile = path.join(contactsDir, 'contacts.json')

// Ensure directory exists
if (!fs.existsSync(contactsDir)) {
  fs.mkdirSync(contactsDir, { recursive: true })
}

// Initialize contacts file if it doesn't exist
if (!fs.existsSync(contactsFile)) {
  fs.writeFileSync(contactsFile, JSON.stringify([]))
}

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function POST(request: NextRequest) {
  try {
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

    // Save to JSON file
    const existingContacts = JSON.parse(fs.readFileSync(contactsFile, 'utf8'))
    existingContacts.push(contact)
    fs.writeFileSync(contactsFile, JSON.stringify(existingContacts, null, 2))

    // Send email to owner with table format
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

    // Send confirmation email to user (unchanged)
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
