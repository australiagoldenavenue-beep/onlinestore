'use client'

import { useState } from 'react'
import { addFinanceRecord } from '@/app/actions/finance'

export default function AddRecordForm() {
    const [isExpanded, setIsExpanded] = useState(false)
    const [gstRate, setGstRate] = useState('0.1')

    async function handleSubmit(formData: FormData) {
        const result = await addFinanceRecord(null, formData)
        if (result?.success) {
            setIsExpanded(false)
            // Optional: Reset form or show success message
        } else {
            alert('Failed to add record')
        }
    }

    if (!isExpanded) {
        return (
            <button
                onClick={() => setIsExpanded(true)}
                style={{
                    padding: '0.75rem 1.5rem',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginBottom: '2rem'
                }}
            >
                + Add Manual Record
            </button>
        )
    }

    return (
        <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
            <h3 style={{ marginBottom: '1rem' }}>Add Manual Finance Record</h3>
            <form action={handleSubmit} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Date</label>
                    <input
                        type="date"
                        name="date"
                        required
                        defaultValue={new Date().toISOString().split('T')[0]}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Amount ($)</label>
                    <input
                        type="number"
                        name="amount"
                        step="0.01"
                        required
                        placeholder="0.00"
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Order Count</label>
                    <input
                        type="number"
                        name="orderCount"
                        defaultValue="0"
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>GST Rate</label>
                    <select
                        name="gstRate"
                        value={gstRate}
                        onChange={(e) => setGstRate(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                        <option value="0.1">10% (Included)</option>
                        <option value="0">0% (No GST)</option>
                    </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Description</label>
                    <input
                        type="text"
                        name="description"
                        placeholder="e.g. Offline Sales, Adjustment"
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button
                        type="submit"
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Save Record
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsExpanded(false)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}
