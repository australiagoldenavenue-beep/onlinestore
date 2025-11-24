import { prisma } from "@/lib/prisma"
import StaffScheduleForm from "./StaffScheduleForm"
import { notFound, redirect } from "next/navigation"
import StaffRateForm from "./StaffRateForm"
import StaffInfoForm from "./StaffInfoForm"
import { auth } from "@/auth"

export const dynamic = 'force-dynamic'

export default async function StaffDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'OWNER' && session?.user?.role !== 'MANAGER') {
        redirect('/admin')
    }
    const { id } = await params

    let user;
    let profile;
    let weeklyPay = 0;
    let totalHours = 0;

    try {
        user = await prisma.user.findUnique({
            where: { id },
            include: { staffProfile: { include: { schedules: true } } }
        })

        if (!user || user.role !== 'STAFF') {
            notFound()
        }

        // Ensure staff profile exists
        if (!user.staffProfile) {
            // Create it if missing (lazy init)
            await prisma.staffProfile.create({
                data: { userId: user.id }
            })
            // Redirect to refresh
            redirect(`/admin/staff/${id}`)
        }

        profile = user.staffProfile

        // Calculate Weekly Pay
        profile.schedules.forEach((s) => {
            if (s.isEnabled) {
                const start = parseFloat(s.startTime.split(':')[0]) + parseFloat(s.startTime.split(':')[1]) / 60
                const end = parseFloat(s.endTime.split(':')[0]) + parseFloat(s.endTime.split(':')[1]) / 60
                totalHours += (end - start)
            }
        })
        weeklyPay = totalHours * profile.hourlyRate

    } catch (error: unknown) {
        return (
            <div style={{ color: 'red', padding: '2rem' }}>
                <h1>Error Loading Staff Details</h1>
                <pre>{error instanceof Error ? error.message : 'Unknown error'}</pre>
            </div>
        )
    }

    return (
        <div>
            <h1>Manage Staff: {user.name}</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                <div style={{ background: 'white', padding: '1rem', borderRadius: '8px' }}>
                    <h3>Pay Settings</h3>
                    <StaffRateForm userId={user.id} initialRate={profile.hourlyRate} />

                    <div style={{ marginTop: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
                        <h4>Estimated Weekly Pay</h4>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${weeklyPay.toFixed(2)}</p>
                        <p style={{ color: '#666' }}>Based on {totalHours.toFixed(1)} scheduled hours</p>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '1rem', borderRadius: '8px' }}>
                    <StaffScheduleForm staffProfileId={profile.id} schedules={profile.schedules} />
                </div>
            </div>

            {/* Staff Information Section */}
            <div style={{ marginTop: '2rem', background: 'white', padding: '1rem', borderRadius: '8px' }}>
                <h3>Staff Information</h3>
                <StaffInfoForm
                    userId={user.id}
                    initialData={{
                        phoneNumber: profile.phoneNumber,
                        address: profile.address,
                        tfn: profile.tfn,
                        bankAccount: profile.bankAccount,
                        passportNumber: profile.passportNumber,
                        visaType: profile.visaType,
                    }}
                />
            </div>
        </div>
    )
}
