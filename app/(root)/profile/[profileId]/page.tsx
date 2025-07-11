// page.tsx (Server Component)
import ProfilePageClient from './ProfilePageClient'

export default function ProfilePage({
  params,
}: {
  params: { profileId: string }
}) {
  return <ProfilePageClient profileId={params.profileId} />
}
