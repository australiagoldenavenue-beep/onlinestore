'use client'

import { useActionState } from 'react'
import { updateSettings } from '@/app/actions/settings'

export default function SettingsForm({ settings }: { settings: Record<string, string> }) {
    const [state, formAction, isPending] = useActionState(updateSettings, null)

    return (
        <form action={formAction} style={{ maxWidth: '600px', padding: '2rem', background: 'white', borderRadius: '8px' }}>
            <h2>Payment & Notification Settings</h2>

            {state?.success && <p style={{ color: 'green' }}>{state.message}</p>}
            {state?.error && <p style={{ color: 'red' }}>{state.error}</p>}

            <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1rem' }}>
                <div>
                    <label htmlFor="businessName" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Business Name
                    </label>
                    <input
                        id="businessName"
                        name="businessName"
                        defaultValue={settings.businessName || ''}
                        placeholder="My Online Store"
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>

                <div>
                    <label htmlFor="businessAddress" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Business Address
                    </label>
                    <input
                        id="businessAddress"
                        name="businessAddress"
                        defaultValue={settings.businessAddress || ''}
                        placeholder="123 Main St, City, Country"
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>

                <div>
                    <label htmlFor="openingHours" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Opening Hours
                    </label>
                    <textarea
                        id="openingHours"
                        name="openingHours"
                        defaultValue={settings.openingHours || ''}
                        placeholder="Mon-Fri: 9am - 5pm&#10;Sat: 10am - 4pm&#10;Sun: Closed"
                        rows={3}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>

                <div>
                    <label htmlFor="ownerEmail" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Owner Email (for notifications)
                    </label>
                    <input
                        id="ownerEmail"
                        name="ownerEmail"
                        type="email"
                        defaultValue={settings.ownerEmail || ''}
                        placeholder="owner@example.com"
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="bankName" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Bank Name
                    </label>
                    <input
                        id="bankName"
                        name="bankName"
                        defaultValue={settings.bankName || ''}
                        placeholder="Example Bank"
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="accountNumber" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Account Number
                    </label>
                    <input
                        id="accountNumber"
                        name="accountNumber"
                        defaultValue={settings.accountNumber || ''}
                        placeholder="123456789"
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="accountHolder" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Account Holder Name
                    </label>
                    <input
                        id="accountHolder"
                        name="accountHolder"
                        defaultValue={settings.accountHolder || ''}
                        placeholder="John Doe"
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="alertMessage" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Alert Message (Front Page)
                    </label>
                    <input
                        id="alertMessage"
                        name="alertMessage"
                        defaultValue={settings.alertMessage || ''}
                        placeholder="e.g. Free shipping on orders over $50!"
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                    <small style={{ color: '#666' }}>Leave empty to hide the alert.</small>
                </div>

                <div>
                    <label htmlFor="backgroundImageUrl" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Background Image URL
                    </label>
                    <input
                        id="backgroundImageUrl"
                        name="backgroundImageUrl"
                        type="url"
                        defaultValue={settings.backgroundImageUrl || ''}
                        placeholder="https://example.com/background.jpg"
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                    <small style={{ color: '#666' }}>Enter a URL for a background image. Leave empty for default gradient.</small>
                </div>

                <div>
                    <label htmlFor="paymentInstructions" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Payment Instructions
                    </label>
                    <textarea
                        id="paymentInstructions"
                        name="paymentInstructions"
                        defaultValue={settings.paymentInstructions || ''}
                        placeholder="Please transfer the total amount to the account above and include your order number in the reference."
                        rows={4}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: '#0070f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    {isPending ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
        </form>
    )
}
