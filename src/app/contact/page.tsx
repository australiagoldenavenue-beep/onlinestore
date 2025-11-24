import { getSettings } from '@/lib/settings'
import styles from './contact.module.css'

export default async function ContactPage() {
    const settings = await getSettings()

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
                    {settings.businessAddress ? (
                        <iframe
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.businessAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        ></iframe>
                    ) : (
                        <div className={styles.mapPlaceholder}>
                            <span className={styles.mapIcon}>🗺️</span>
                            <p>Map View</p>
                            <p className={styles.mapAddress}>Address not available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
