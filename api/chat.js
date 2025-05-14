export default async function handler(req, res) {
  try {
    const body = req.body;

    if (!body || !body.message) {
      return res.status(400).json({ reply: 'Mensaje no recibido.' });
    }

    const geminiRes = await fetch(
      'https://generativelanguage.googleapis.com/v1/models/chat-bison-001:generateMessage?key=' + process.env.GEMINI_API_KEY,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: {
            messages: [
              {
                author: "user",
                content: body.message
              }
            ]
          },
          temperature: 0.5
        })
      }
    );

    const data = await geminiRes.json();

    const reply = data?.candidates?.[0]?.content;

    if (!reply) {
      console.log("🪵 Gemini devolvió esto:", JSON.stringify(data, null, 2));
      return res.status(500).json({ reply: 'No se recibió respuesta de Gemini (modelo fallback).' });
    }

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("❌ Error al contactar con Gemini:", error);
    return res.status(500).json({ reply: 'Error al contactar con Gemini.' });
  }
}
