import { getSettings } from '@/lib/settings'
import SettingsForm from './SettingsForm'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
    let settings = {}
    try {
        settings = await getSettings()
    } catch (error) {
        console.error('Failed to load settings:', error)
        // Fallback to empty settings so the page can still render
    }

    return (
        <div>
            <h1>Business Settings</h1>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
                Configure payment and notification settings. Bank account details will be displayed to customers on the payment page.
            </p>
            <SettingsForm settings={settings} />
        </div>
    )
}
