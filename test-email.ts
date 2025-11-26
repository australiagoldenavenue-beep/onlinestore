import { Resend } from 'resend'

const resend = new Resend('re_LEMxU7o3_HoqvFANQHmHECx5AMQNXNhXT')

async function main() {
    try {
        console.log('Attempting to send test email...')
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'delivered@resend.dev', // This is a special test address for Resend
            subject: 'Test Email',
            html: '<p>It works!</p>'
        })
        console.log('Success:', data)
    } catch (error) {
        console.error('Error:', error)
    }
}

main()
