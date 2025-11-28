import { Resend } from 'resend'
import { prisma } from './prisma'
import { getSettings } from '@/lib/settings'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null




export async function sendOrderConfirmation(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: {
          include: { product: true }
        }
      }
    })

    if (!order) {
      throw new Error('Order not found')
    }

    const settings = await getSettings()

    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">$${item.price.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('')

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Order Confirmation</h1>
        <p>Dear ${order.user.name},</p>
        <p>Thank you for your order! Here are the details:</p>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0;">Order #${order.id.substring(0, 8)}</h2>
          <p><strong>Order Date:</strong> ${order.createdAt.toLocaleDateString()}</p>
          ${order.note ? `<p><strong>Your Note:</strong> ${order.note}</p>` : ''}
        </div>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #f0f0f0;">
              <th style="padding: 10px; text-align: left;">Product</th>
              <th style="padding: 10px; text-align: left;">Quantity</th>
              <th style="padding: 10px; text-align: left;">Price</th>
              <th style="padding: 10px; text-align: left;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="text-align: right; font-size: 1.2em; margin: 20px 0;">
          <strong>Total: $${order.total.toFixed(2)}</strong>
        </div>

        <div style="background: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Payment Instructions</h3>
          <p>${settings.paymentInstructions || 'Please complete payment to finalize your order.'}</p>
          <p><strong>Bank:</strong> ${settings.bankName || 'N/A'}</p>
          <p><strong>Account Number:</strong> ${settings.accountNumber || 'N/A'}</p>
          <p><strong>Account Holder:</strong> ${settings.accountHolder || 'N/A'}</p>
          <p><strong>Reference:</strong> Order #${order.id.substring(0, 8)}</p>
        </div>

        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p>Thank you for your business!</p>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #888; font-size: 12px;">
          <p>This is an automated message, please do not reply.</p>
          &copy; ${new Date().getFullYear()} Universa. All rights reserved.
        </div>
      </div>
    `

    if (!resend) {
      console.warn('Resend API key missing, skipping order confirmation email')
      return
    }

    await resend.emails.send({
      from: `Universa <${process.env.RESEND_FROM_EMAIL || 'noreply@universa.com.au'}>`,
      to: order.user.email,
      subject: `Order Confirmation - #${order.id.substring(0, 8)}`,
      html,
    })

    console.log(`Order confirmation sent to ${order.user.email}`)
  } catch (error) {
    console.error('Failed to send order confirmation:', error)
  }
}

export async function sendOrderNotification(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: {
          include: { product: true }
        }
      }
    })

    if (!order) {
      throw new Error('Order not found')
    }

    const settings = await getSettings()
    const ownerEmail = settings.ownerEmail

    if (!ownerEmail) {
      console.log('Owner email not configured, skipping notification')
      return
    }

    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">$${item.price.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('')

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">New Order Received</h1>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0;">Order #${order.id.substring(0, 8)}</h2>
          <p><strong>Order Date:</strong> ${order.createdAt.toLocaleDateString()}</p>
          <p><strong>Customer:</strong> ${order.user.name}</p>
          <p><strong>Email:</strong> ${order.user.email}</p>
          <p><strong>Phone:</strong> ${order.user.phoneNumber || 'N/A'}</p>
          <p><strong>Address:</strong> ${order.user.address || 'N/A'}</p>
          ${order.note ? `<p><strong>Customer Note:</strong> ${order.note}</p>` : ''}
        </div>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #f0f0f0;">
              <th style="padding: 10px; text-align: left;">Product</th>
              <th style="padding: 10px; text-align: left;">Quantity</th>
              <th style="padding: 10px; text-align: left;">Price</th>
              <th style="padding: 10px; text-align: left;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="text-align: right; font-size: 1.2em; margin: 20px 0;">
          <strong>Total: $${order.total.toFixed(2)}</strong>
        </div>
      </div>
    `

    if (!resend) {
      console.warn('Resend API key missing, skipping order notification email')
      return
    }

    await resend.emails.send({
      from: `Universa <${process.env.RESEND_FROM_EMAIL || 'noreply@universa.com.au'}>`,
      to: ownerEmail,
      subject: `New Order - #${order.id.substring(0, 8)}`,
      html,
    })

    console.log(`Order notification sent to owner: ${ownerEmail}`)
  } catch (error) {
    console.error('Failed to send order notification:', error)
  }
}

export async function sendDailySummary() {
  try {
    const settings = await getSettings()
    const ownerEmail = settings.ownerEmail

    if (!ownerEmail) {
      console.log('Owner email not configured, skipping daily summary')
      return
    }

    // Get orders from today
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get aggregate stats for today
    const stats = await prisma.order.aggregate({
      where: {
        createdAt: { gte: today }
      },
      _sum: { total: true },
      _count: { id: true }
    })

    if (stats._count.id === 0) {
      console.log('No orders today, skipping daily summary')
      return
    }

    // Get recent orders for the list (limit to 50 to prevent memory issues)
    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: today }
      },
      include: {
        user: true,
        items: {
          include: { product: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    })

    const totalRevenue = stats._sum.total || 0
    const totalOrders = stats._count.id


    const ordersHtml = orders.map(order => `
      <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px;">
        <h3 style="margin-top: 0;">Order #${order.id.substring(0, 8)}</h3>
        <p><strong>Customer:</strong> ${order.user.name} (${order.user.email})</p>
        <p><strong>Time:</strong> ${order.createdAt.toLocaleTimeString()}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
        ${order.note ? `<p><strong>Note:</strong> ${order.note}</p>` : ''}
        <details>
          <summary style="cursor: pointer; color: #0070f3;">View Items</summary>
          <ul>
            ${order.items.map(item => `<li>${item.product.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>`).join('')}
          </ul>
        </details>
      </div>
    `).join('')

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1 style="color: #333;">Daily Order Summary - ${new Date().toLocaleDateString()}</h1>
        
        <div style="background: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0;">Summary</h2>
          <p><strong>Total Orders:</strong> ${totalOrders}</p>
          <p><strong>Total Revenue:</strong> $${totalRevenue.toFixed(2)}</p>
        </div>

        <h2>Orders ${totalOrders > 50 ? '(Showing last 50)' : ''}</h2>
        ${ordersHtml}

        <p style="margin-top: 30px; color: #666;">This is your automated daily order summary.</p>
      </div>
    `

    if (!resend) {
      console.warn('Resend API key missing, skipping daily summary email')
      return
    }

    await resend.emails.send({
      from: `Universa <${process.env.RESEND_FROM_EMAIL || 'noreply@universa.com.au'}>`,
      to: ownerEmail,
      subject: `Daily Order Summary - ${new Date().toLocaleDateString()}`,
      html,
    })

    console.log(`Daily summary sent to owner: ${ownerEmail}`)
  } catch (error) {
    console.error('Failed to send daily summary:', error)
  }
}

export async function sendVerificationCode(email: string, code: string) {
  try {
    const baseUrl = process.env.AUTH_URL || 'http://127.0.0.1:3000'
    const link = `${baseUrl}/forgot-password/verify?email=${encodeURIComponent(email)}&code=${code}`

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Your Password</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5; color: #18181b; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
          .container { max-width: 480px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e4e4e7; }
          .header { padding: 40px 40px 0 40px; text-align: center; }
          .logo { font-size: 24px; font-weight: 800; color: #000000; text-decoration: none; letter-spacing: -0.5px; }
          .content { padding: 40px; }
          .title { font-size: 20px; font-weight: 600; margin-bottom: 16px; color: #000000; text-align: center; }
          .text { font-size: 16px; line-height: 1.6; color: #52525b; margin-bottom: 24px; text-align: center; }
          .code-box { background-color: #f4f4f5; border-radius: 12px; padding: 20px; text-align: center; margin: 32px 0; letter-spacing: 8px; font-size: 32px; font-weight: 700; color: #000000; border: 1px solid #e4e4e7; font-family: 'SF Mono', 'Roboto Mono', monospace; }
          .button { display: block; width: 100%; background-color: #000000; color: #ffffff; text-decoration: none; padding: 16px 0; border-radius: 12px; font-weight: 600; font-size: 16px; text-align: center; transition: opacity 0.2s; }
          .button:hover { opacity: 0.9; }
          .footer { padding: 32px; text-align: center; font-size: 12px; color: #a1a1aa; background-color: #fafafa; border-top: 1px solid #f4f4f5; }
          .link { color: #000000; text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Universa</div>
          </div>
          <div class="content">
            <h1 class="title">Reset your password</h1>
            <p class="text">We received a request to reset the password for your account. Enter the following code to continue:</p>
            
            <div class="code-box">${code}</div>
            
            <p class="text">Or click the button below:</p>
            
            <a href="${link}" class="button">Reset Password</a>
            
            <p style="margin-top: 32px; font-size: 14px; color: #71717a; text-align: center;">
              This code will expire in 15 minutes. If you didn't request this, you can safely ignore this email.
            </p>
          </div>
          <div class="footer">
            <p style="margin-bottom: 10px;">No reply required.</p>
            <p style="margin-bottom: 10px;">universa.com.au send this verify code</p>
            &copy; ${new Date().getFullYear()} Universa. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `

    if (!resend) {
      throw new Error('Resend API key is missing')
    }

    const result = await resend.emails.send({
      from: `Universa <${process.env.RESEND_FROM_EMAIL || 'noreply@universa.com.au'}>`,
      to: email,
      subject: 'Reset Your Password',
      html,
    })

    if (result.error) {
      console.error('Resend API Error:', result.error)
      throw new Error(`Failed to send email: ${result.error.message}`)
    }

    console.log(`Verification code sent to ${email}. ID: ${result.data?.id}`)
  } catch (error) {
    console.error('Failed to send verification code:', error)
    throw new Error('Failed to send verification email')
  }
}
