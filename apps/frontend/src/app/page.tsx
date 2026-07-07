import { redirect } from 'next/navigation';

/** Browse is the home screen — one obvious place to start. */
export default function HomePage() {
  redirect('/browse');
}
