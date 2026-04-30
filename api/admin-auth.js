export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { password } = req.body;
  if (password === 'Zamor2026') {
    return res.status(200).json({ token: 'philobaucis-admin-token-ok' });
  }
  return res.status(401).json({ error: 'Invalid password' });
}
