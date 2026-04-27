import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  const token = req.headers.authorization;
  if (token !== 'Bearer philobaucis-admin-token-ok') return res.status(401).json({ error: 'Non autorisé' });

  const { data, error } = await supabase.from('reservations').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ reservations: data });
}
