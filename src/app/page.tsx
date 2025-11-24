import Link from "next/link"
import styles from './page.module.css'
import { getSettings } from "@/app/actions/settings"

export default async function Home() {
  const settings = await getSettings()
  const alertMessage = settings.alertMessage

  return (
    <div className={styles.container}>
      <div className={styles.heroBackground}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Elevate Your Lifestyle
          </h1>
          <p className={styles.subtitle}>
            Curated collection of premium products for the modern home.
          </p>

          {alertMessage && (
            <div className={styles.alertBanner}>
              {alertMessage}
            </div>
          )}

          <Link href="/products" className={styles.ctaButton}>
            Shop Now
          </Link>
        </div>
      </div>

      <div className={styles.features}>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>✨</div>
          <h3>Premium Quality</h3>
          <p>Hand-picked items that meet our high standards.</p>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>🚀</div>
          <h3>Fast Shipping</h3>
          <p>Tracked delivery to your doorstep.</p>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>🛡️</div>
          <h3>Secure Checkout</h3>
          <p>Protected payments for peace of mind.</p>
        </div>
      </div>
    </div>
  )
}

