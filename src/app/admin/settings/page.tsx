import { getSettings, updateSettings } from '@/app/actions/settings'
import SettingsForm from './SettingsForm'

export default async function AdminSettingsPage() {
    const settings = await getSettings()

    return (
        <div>
            <h1>Business Settings</h1>
            <p style={{ color: '#666', marginBottom: '2rem' }}>Configure payment and notification settings</p>
            <SettingsForm settings={settings} />
        </div>
    )
}
