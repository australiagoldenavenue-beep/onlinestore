import { auth } from '@/auth'
import { logout } from '@/app/actions/auth'
import { getSettings } from '@/app/actions/settings'
import ClientNavbar from './ClientNavbar'

export default async function Navbar() {
    const session = await auth()
    const settings = await getSettings()
    const businessName = settings.businessName || 'Online Store'

    return <ClientNavbar session={session} businessName={businessName} logoutAction={logout} />
}
