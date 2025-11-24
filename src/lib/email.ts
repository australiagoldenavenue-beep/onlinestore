import { Resend } from 'resend'
import { prisma } from './prisma'
import { getSettings } from '@/app/actions/settings'

const resend = new Resend(process.env.RESEND_API_KEY || 'test_key')

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
      </div>
    `

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
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

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
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

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: today
        }
      },
      include: {
        user: true,
        items: {
          include: { product: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (orders.length === 0) {
      console.log('No orders today, skipping daily summary')
      return
    }

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

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
          <p><strong>Total Orders:</strong> ${orders.length}</p>
          <p><strong>Total Revenue:</strong> $${totalRevenue.toFixed(2)}</p>
        </div>

        <h2>Orders</h2>
        ${ordersHtml}

        <p style="margin-top: 30px; color: #666;">This is your automated daily order summary.</p>
      </div>
    `

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
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
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Password Reset Verification</h1>
        <p>You requested to reset your password. Use the code below to verify your account:</p>
        
        <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px;">${code}</span>
        </div>

        <p>If you didn't request this, please ignore this email.</p>
        <p>This code will expire in 15 minutes.</p>
      </div>
    `

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: 'Password Reset Verification Code',
      html,
    })

    console.log(`Verification code sent to ${email}`)
  } catch (error) {
    console.error('Failed to send verification code:', error)
    throw new Error('Failed to send verification email')
  }
}
