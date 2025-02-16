import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access')?.value;
  if (!accessToken) {
    redirect('/login');
  } else {
    redirect('/control');
  }
}