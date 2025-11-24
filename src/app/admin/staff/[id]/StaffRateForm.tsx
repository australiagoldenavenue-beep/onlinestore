'use client'

import { updateStaffProfile } from "@/app/actions/staff"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function StaffRateForm({ userId, initialRate }: { userId: string, initialRate: number }) {
    const [message, setMessage] = useState('')
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        const res = await updateStaffProfile(formData)
        if (res.error) {
            setMessage(res.error)
        } else {
            setMessage('Rate updated successfully')
            router.refresh()
        }
    }

    return (
        <form action={handleSubmit}>
            <input type="hidden" name="userId" value={userId} />
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Hourly Rate ($)</label>
                <input
                    key={initialRate}
                    type="number"
                    name="hourlyRate"
                    defaultValue={initialRate}
                    step="0.01"
                    min="0"
                    style={{ padding: '0.5rem', width: '100%' }}
                />
            </div>
            <button type="submit" style={{ padding: '0.5rem 1rem', background: 'black', color: 'white', border: 'none', borderRadius: '4px' }}>
                Update Rate
            </button>
            {message && <p style={{ marginTop: '0.5rem', color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
        </form>
    )
}
