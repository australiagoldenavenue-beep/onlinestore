'use client'
import { useEffect, useState } from 'react'
import { getSettings } from '@/app/actions/settings'
import styles from './contact.module.css'

export default function ContactPage() {
    const [settings, setSettings] = useState<Record<string, string>>({})

    useEffect(() => {
        getSettings().then(setSettings)
    }, [])

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Contact & Location</h1>

            <div className={styles.grid}>
                <div>
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Visit Us</h2>
                        <p className={styles.infoText}>
                            <strong>Address:</strong><br />
                            {settings.businessAddress || 'Address not available'}
                        </p>
                        <p className={styles.infoText}>
                            <strong>Email:</strong><br />
                            {settings.ownerEmail || 'Email not available'}
                        </p>
                    </div>

                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Opening Hours</h2>
                        <div className={styles.hoursText}>
                            {settings.openingHours || 'Opening hours not available'}
                        </div>
                    </div>
                </div>

                <div className={styles.mapContainer}>
                    <div className={styles.mapPlaceholder}>
                        <span className={styles.mapIcon}>🗺️</span>
                        <p>Map View</p>
                        <p className={styles.mapAddress}>{settings.businessAddress}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
