import Link from 'next/link'
import { getSettings } from '@/app/actions/settings'

export default async function Footer() {
    const settings = await getSettings()
    const businessName = settings.businessName || 'Online Store'
    const year = new Date().getFullYear()

    return (
        <footer style={{
            background: '#f8f9fa',
            padding: '3rem 2rem',
            marginTop: 'auto',
            borderTop: '1px solid #eaeaea'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '2rem'
            }}>
                <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#333' }}>{businessName}</h3>
                    <p style={{ color: '#666', lineHeight: '1.6' }}>
                        Providing quality products and exceptional service to our customers.
                    </p>
                </div>

                <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#333' }}>Quick Links</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}><Link href="/products" style={{ color: '#666', textDecoration: 'none' }}>Products</Link></li>
                        <li style={{ marginBottom: '0.5rem' }}><Link href="/cart" style={{ color: '#666', textDecoration: 'none' }}>Cart</Link></li>
                        <li style={{ marginBottom: '0.5rem' }}><Link href="/contact" style={{ color: '#666', textDecoration: 'none' }}>Contact & Location</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#333' }}>Contact</h3>
                    <p style={{ color: '#666', marginBottom: '0.5rem' }}>{settings.businessAddress || 'Address not set'}</p>
                    <p style={{ color: '#666' }}>{settings.ownerEmail || 'Email not set'}</p>
                </div>
            </div>
            <div style={{
                textAlign: 'center',
                marginTop: '3rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid #eaeaea',
                color: '#888',
                fontSize: '0.9rem'
            }}>
                © {year} {businessName}. All rights reserved.
            </div>
        </footer>
    )
}
