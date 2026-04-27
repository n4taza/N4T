// api/registrar.js
export default async function handler(req, res) {
  // 1. Hanya izinkan metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Verifikasi x-auth-key (PASTIKAN SAMA dengan environment variable di Vercel)
  const authKey = req.headers['x-auth-key'];
  if (authKey !== process.env.AUTH_KEY) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    // 3. 🔥 LINK ASLI DISEMBUNYIKAN - ambil dari environment variable Vercel
    const BASE_URL = process.env.API_BASE_URL;
    if (!BASE_URL) {
      return res.status(500).json({ error: 'API_BASE_URL not configured' });
    }

    const targetUrl = `${BASE_URL}/oauth/guest/registrar`;

    // 4. Proxy request ke server asli
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'Connection': 'Keep-Alive'
      },
      body: JSON.stringify({
        app_id: req.body.app_id ?? 100067,
        client_type: req.body.client_type ?? 2,
        password: req.body.password,
        source: req.body.source ?? 2
      }),
    });

    const data = await response.json();
    res.status(response.status).json(data);

  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Internal error', detail: err.message });
  }
}
