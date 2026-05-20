import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactEmailPayload {
  fullName: string
  email: string
  message: string
}

export async function sendContactNotification(data: ContactEmailPayload): Promise<boolean> {
  const { fullName, email, message } = data

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com',
      to: process.env.NOTIFICATION_TO_EMAIL || 'sukrisstiyo29@gmail.com',
      subject: `📬 New Message from ${fullName} — Portfolio Contact Form`,
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a27; color: #ffffff; padding: 32px; border-radius: 12px;">
          <h2 style="color: #f5a623; margin-bottom: 24px;">📬 New Contact Message</h2>
          
          <div style="background: #222233; padding: 20px; border-radius: 8px; margin-bottom: 16px;">
            <p style="margin: 0 0 8px; color: #a0a0b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">From</p>
            <p style="margin: 0; font-size: 18px; font-weight: 600;">${fullName}</p>
            <p style="margin: 4px 0 0; color: #a0a0b8;">${email}</p>
          </div>

          <div style="background: #222233; padding: 20px; border-radius: 8px;">
            <p style="margin: 0 0 8px; color: #a0a0b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Message</p>
            <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>

          <p style="margin-top: 24px; color: #606080; font-size: 12px;">
            Sent via Portfolio Contact Form • ${new Date().toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' })} WIB
          </p>
        </div>
      `,
    })
    return true
  } catch (error) {
    console.error('Failed to send contact notification email:', error)
    return false
  }
}
