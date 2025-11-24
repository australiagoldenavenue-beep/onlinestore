'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type StaffInfoFormProps = {
    userId: string
    initialData: {
        phoneNumber?: string | null
        address?: string | null
        tfn?: string | null
        bankAccount?: string | null
        passportNumber?: string | null
        visaType?: string | null
    }
}

export default function StaffInfoForm({ userId, initialData }: StaffInfoFormProps) {
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        const formData = new FormData(e.currentTarget)

        try {
            const response = await fetch('/api/staff/update-info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    phoneNumber: formData.get('phoneNumber'),
                    address: formData.get('address'),
                    tfn: formData.get('tfn'),
                    bankAccount: formData.get('bankAccount'),
                    passportNumber: formData.get('passportNumber'),
                    visaType: formData.get('visaType'),
                })
            })

            const result = await response.json()

            if (result.error) {
                setMessage(result.error)
            } else {
                setMessage('Information updated successfully')
                router.refresh()
            }
        } catch {
            setMessage('Failed to update information')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form key={JSON.stringify(initialData)} onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
            <div style={{ display: 'grid', gap: '1rem' }}>
                {/* Contact Information */}
                <fieldset style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
                    <legend style={{ fontWeight: 'bold', padding: '0 0.5rem' }}>Contact Information</legend>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            defaultValue={initialData.phoneNumber || ''}
                            placeholder="+61 XXX XXX XXX"
                            style={{ padding: '0.5rem', width: '100%', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            Address
                        </label>
                        <textarea
                            name="address"
                            defaultValue={initialData.address || ''}
                            placeholder="Street address, City, State, Postcode"
                            rows={3}
                            style={{ padding: '0.5rem', width: '100%', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
                        />
                    </div>
                </fieldset>

                {/* Employment Information */}
                <fieldset style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
                    <legend style={{ fontWeight: 'bold', padding: '0 0.5rem' }}>Employment Information</legend>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            Tax File Number (TFN)
                        </label>
                        <input
                            type="text"
                            name="tfn"
                            defaultValue={initialData.tfn || ''}
                            placeholder="XXX XXX XXX"
                            maxLength={11}
                            style={{ padding: '0.5rem', width: '100%', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                        <small style={{ color: '#666', fontSize: '0.85rem' }}>9 digits (spaces optional)</small>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            Bank Account
                        </label>
                        <input
                            type="text"
                            name="bankAccount"
                            defaultValue={initialData.bankAccount || ''}
                            placeholder="BSB: XXX-XXX, Account: XXXXXXXX"
                            style={{ padding: '0.5rem', width: '100%', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                        <small style={{ color: '#666', fontSize: '0.85rem' }}>Format: BSB-Account Number</small>
                    </div>
                </fieldset>

                {/* Visa/Passport Information */}
                <fieldset style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
                    <legend style={{ fontWeight: 'bold', padding: '0 0.5rem' }}>Visa/Passport Information</legend>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            Passport Number
                        </label>
                        <input
                            type="text"
                            name="passportNumber"
                            defaultValue={initialData.passportNumber || ''}
                            placeholder="e.g., P1234567"
                            style={{ padding: '0.5rem', width: '100%', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            VISA Type
                        </label>
                        <select
                            name="visaType"
                            defaultValue={initialData.visaType || ''}
                            style={{ padding: '0.5rem', width: '100%', border: '1px solid #ddd', borderRadius: '4px' }}
                        >
                            <option value="">Select VISA Type</option>
                            <option value="Australian Citizen">Australian Citizen</option>
                            <option value="Permanent Resident">Permanent Resident</option>
                            <option value="Student Visa (500)">Student Visa (500)</option>
                            <option value="Working Holiday (417)">Working Holiday (417)</option>
                            <option value="Work and Holiday (462)">Work and Holiday (462)</option>
                            <option value="Skilled Worker (482)">Skilled Worker (482)</option>
                            <option value="Temporary Graduate (485)">Temporary Graduate (485)</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </fieldset>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: loading ? '#ccc' : 'black',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontWeight: '600'
                    }}
                >
                    {loading ? 'Updating...' : 'Update Information'}
                </button>

                {message && (
                    <p style={{
                        marginTop: '0.5rem',
                        color: message.includes('success') ? 'green' : 'red',
                        fontWeight: '500'
                    }}>
                        {message}
                    </p>
                )}
            </div>
        </form>
    )
}
