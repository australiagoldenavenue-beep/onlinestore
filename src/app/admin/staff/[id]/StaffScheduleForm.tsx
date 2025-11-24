'use client'

import { useState } from 'react'
import { updateStaffSchedule } from '@/app/actions/staff'

import { useRouter } from 'next/navigation'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

type Schedule = {
    dayOfWeek: number
    startTime: string
    endTime: string
    isEnabled: boolean
}

export default function StaffScheduleForm({ staffProfileId, schedules }: { staffProfileId: string, schedules: Schedule[] }) {
    const [saving, setSaving] = useState(false)
    const router = useRouter()

    const handleSave = async (dayOfWeek: number, startTime: string, endTime: string, isEnabled: boolean) => {
        setSaving(true)
        await updateStaffSchedule({
            staffProfileId,
            dayOfWeek,
            startTime,
            endTime,
            isEnabled
        })
        setSaving(false)
        router.refresh()
    }

    return (
        <div>
            <h3>Work Schedule</h3>
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                {DAYS.map((day, index) => {
                    const schedule = schedules.find(s => s.dayOfWeek === index)
                    const startTime = schedule?.startTime || '09:00'
                    const endTime = schedule?.endTime || '17:00'
                    const isEnabled = schedule?.isEnabled ?? false

                    return (
                        <div key={day} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', border: '1px solid #eee', borderRadius: '4px' }}>
                            <div style={{ width: '100px', fontWeight: 'bold' }}>{day}</div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={isEnabled}
                                    onChange={(e) => handleSave(index, startTime, endTime, e.target.checked)}
                                />
                                Active
                            </label>
                            {isEnabled && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input
                                        type="time"
                                        defaultValue={startTime}
                                        onBlur={(e) => handleSave(index, e.target.value, endTime, isEnabled)}
                                        style={{ padding: '0.25rem' }}
                                    />
                                    <span>to</span>
                                    <input
                                        type="time"
                                        defaultValue={endTime}
                                        onBlur={(e) => handleSave(index, startTime, e.target.value, isEnabled)}
                                        style={{ padding: '0.25rem' }}
                                    />
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
            {saving && <p style={{ color: 'green', marginTop: '0.5rem' }}>Saving...</p>}
        </div>
    )
}
