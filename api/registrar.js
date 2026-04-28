// api/registrar.js
// Auth key di-hardcode di sini
const HARDCODED_AUTH_KEY = "9fKxP2aLz_88sX_NATAZA_2126";

export default async function handler(req, res) {
  // 1. Hanya izinkan metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Verifikasi - LANGSUNG CEK dengan hardcoded value
  //    Client TIDAK PERLU kirim x-auth-key lagi
  //    Atau bisa tetap cek dari header untuk keamanan tambahan
  
  // OPSI A: Tanpa auth dari client (siapa pun bisa akses)
  // (komentar atau hapus bagian pengecekan auth)
  
  // OPSI B: Tetap cek dari header tapi hardcode di sini
  const clientAuthKey = req.headers['x-auth-key'];
  if (clientAuthKey !== HARDCODED_AUTH_KEY) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const BASE_URL = process.env.API_BASE_URL;
    if (!BASE_URL) {
      return res.status(500).json({ error: 'API_BASE_URL not configured' });
    }

    const targetUrl = `${BASE_URL}/oauth/guest/registrar`;

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
