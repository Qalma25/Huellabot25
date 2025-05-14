export default async function handler(req, res) {
  try {
    const body = req.body;

    if (!body || !body.message) {
      return res.status(400).json({ reply: 'Mensaje no recibido.' });
    }

    const geminiRes = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + process.env.GEMINI_API_KEY,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: body.message }]
          }]
        })
      }
    );

    const data = await geminiRes.json();

    if (!data || !data.candidates || !data.candidates.length) {
      console.error('Respuesta inesperada de Gemini:', data);
      return res.status(500).json({ reply: 'No se recibió respuesta de Gemini (estructura vacía).' });
    }

    const reply = data.candidates[0].content.parts[0].text;

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Error en Gemini API:', err);
    return res.status(500).json({ reply: 'Error al contactar con Gemini.' });
  }
}
