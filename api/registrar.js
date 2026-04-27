export default async function handler(req, res) {
  try {
    // ================= METHOD CHECK =================
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // ================= AUTH CHECK =================
    const authKey = req.headers["x-auth-key"];

    if (!authKey || authKey !== process.env.AUTH_KEY) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // ================= PROXY REQUEST =================
    const response = await fetch(
      "http://130.61.149.246:25400/oauth/guest/registrar",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": req.headers["user-agent"] || ""
        },
        body: JSON.stringify(req.body)
      }
    );

    const text = await response.text();

    // ================= RETURN RESPONSE =================
    return res.status(200).send(text);

  } catch (err) {
    console.error("ERROR:", err);
    return res.status(500).json({
      error: "Proxy error",
      detail: err.message
    });
  }
}
