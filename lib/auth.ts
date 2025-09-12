import { createClient } from './supabase-server';
import { redirect } from 'next/navigation';

export async function getUser() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    // Error getting user - silently handle to avoid console warnings
    return null;
  }
}

export async function requireAuth() {
  const user = await getUser();
  
  if (!user) {
    redirect('/auth/signin');
  }
  
  return user;
}

export async function signOut() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (error) {
    // Error signing out - silently handle to avoid console warnings
  }
  redirect('/auth/signin');
}
