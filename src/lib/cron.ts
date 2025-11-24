import cron from 'node-cron'
import { sendDailySummary } from './email'

let cronInitialized = false

export function initializeCron() {
    if (cronInitialized) {
        console.log('Cron jobs already initialized')
        return
    }

    // Schedule daily summary at 22:00 (10 PM)
    cron.schedule('0 22 * * *', async () => {
        console.log('Running daily order summary job...')
        try {
            await sendDailySummary()
            console.log('Daily summary sent successfully')
        } catch (error) {
            console.error('Failed to send daily summary:', error)
        }
    }, {
        timezone: 'Australia/Sydney' // Adjust to your timezone
    })

    cronInitialized = true
    console.log('Cron jobs initialized - Daily summary scheduled for 22:00')
}

// Manual trigger for testing
export async function triggerDailySummary() {
    console.log('Manually triggering daily summary...')
    await sendDailySummary()
}
