import FriendReq from "@/components/core/features/FriendReq"
import { cookies } from "next/headers"
export default async function FriendRequestPage() {
    const cookieStore = await cookies()
    const token = cookieStore.get('authjs.session-token')
    return <FriendReq token={token?.value} />
}
