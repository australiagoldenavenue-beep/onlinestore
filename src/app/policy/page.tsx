import styles from './policy.module.css'

export default function PolicyPage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Privacy Policy & Terms</h1>
                <p className={styles.subtitle}>Last updated: November 2025</p>
            </div>

            <div className={styles.content}>
                <section className={styles.section}>
                    <h2>Privacy Policy</h2>
                    <p>
                        We are committed to protecting your privacy. This Privacy Policy explains how we collect,
                        use, and safeguard your personal information.
                    </p>

                    <h3>Information We Collect</h3>
                    <ul>
                        <li>Personal identification information (Name, email address, phone number)</li>
                        <li>Delivery address and payment information</li>
                        <li>Order history and preferences</li>
                        <li>Usage data and cookies</li>
                    </ul>

                    <h3>How We Use Your Information</h3>
                    <ul>
                        <li>Process and fulfill your orders</li>
                        <li>Send order confirmations and updates</li>
                        <li>Improve our products and services</li>
                        <li>Communicate promotional offers (with your consent)</li>
                        <li>Ensure security and prevent fraud</li>
                    </ul>

                    <h3>Data Protection</h3>
                    <p>
                        We implement appropriate technical and organizational measures to protect your personal
                        data against unauthorized or unlawful processing, accidental loss, destruction, or damage.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>Terms of Service</h2>

                    <h3>1. Acceptance of Terms</h3>
                    <p>
                        By accessing and using this website, you accept and agree to be bound by the terms and
                        provision of this agreement.
                    </p>

                    <h3>2. Product Information</h3>
                    <p>
                        We strive to provide accurate product descriptions and pricing. However, we do not warrant
                        that product descriptions or other content is accurate, complete, reliable, current, or error-free.
                    </p>

                    <h3>3. Orders and Payment</h3>
                    <p>
                        All orders are subject to acceptance and availability. We reserve the right to refuse or
                        cancel any order for any reason. Payment must be received before order processing.
                    </p>

                    <h3>4. Shipping and Delivery</h3>
                    <p>
                        We will make every effort to deliver your order within the estimated timeframe. However,
                        delays may occur due to circumstances beyond our control.
                    </p>

                    <h3>5. Returns and Refunds</h3>
                    <p>
                        If you are not satisfied with your purchase, you may return it within 30 days of receipt
                        for a refund or exchange, subject to our return policy conditions.
                    </p>

                    <h3>6. Limitation of Liability</h3>
                    <p>
                        We shall not be liable for any indirect, incidental, special, consequential or punitive
                        damages resulting from your use of or inability to use the service.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>Cookie Policy</h2>
                    <p>
                        We use cookies to improve your browsing experience, analyze site traffic, and personalize
                        content. By using our website, you consent to our use of cookies.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy or Terms of Service, please contact
                        us through our contact page.
                    </p>
                </section>
            </div>
        </div>
    )
}
