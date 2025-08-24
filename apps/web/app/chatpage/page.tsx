import ChatPage from '@/components/core/pages/ChatPage';
import { cookies } from 'next/headers';

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get('authjs.session-token');
  return <ChatPage token={token?.value} />;
}
