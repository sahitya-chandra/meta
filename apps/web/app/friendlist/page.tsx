import FriendList from "@/components/core/features/FriendList"
import { cookies } from "next/headers"

export default async function FriendListPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('authjs.session-token')
  return <FriendList token={token?.value} />
}
