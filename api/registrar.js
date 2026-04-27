export default async function handler(req, res) {
  try {
    console.log("API HIT");

    // ================= METHOD =================
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // ================= AUTH =================
    const authKey = req.headers["x-auth-key"];

    if (!authKey || authKey !== process.env.AUTH_KEY) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // ================= REQUEST BODY =================
    const body = req.body;

    // ================= PROXY =================
    const response = await fetch(
      "http://130.61.149.246:25400/oauth/guest/registrar",
      {
        method: "POST",
        headers: {
          "User-Agent": "GarenaMSDK/4.0.39(SM-A325M;Android 13;en;HK;)",
          "Accept": "application/json",
          "Content-Type": "application/json; charset=utf-8",
          "Accept-Encoding": "gzip",
          "Connection": "Keep-Alive"
        },
        body: JSON.stringify(body)
      }
    );

    const text = await response.text();

    console.log("TARGET STATUS:", response.status);
    console.log("TARGET RESPONSE:", text.slice(0, 200)); // potong biar gak kepanjangan

    // ================= RETURN =================
    return res.status(response.status).send(text);

  } catch (err) {
    console.error("ERROR:", err);

    return res.status(500).json({
      error: "Proxy error",
      detail: err.message
    });
  }
}
