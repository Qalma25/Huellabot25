export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ reply: 'Solo se permiten peticiones POST.' });
    }

    const body = req.body;

    if (!body || !body.message) {
      return res.status(400).json({ reply: 'Mensaje vacío o no enviado correctamente.' });
    }

    const systemPrompt = `
      Eres HuellaBot, el asistente de HuellaNet by Qalma.
      Solo puedes responder preguntas relacionadas con sostenibilidad, huella de carbono y el uso de HuellaNet.
      Si te preguntan algo fuera de ese contexto, responde: "Lo siento, solo puedo ayudarte con temas relacionados con HuellaNet."
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: body.message },
        ],
        temperature: 0.5,
        max_tokens: 300,
      }),
    });

    const data = await response.json();

    if (!data.choices || !data.choices.length) {
      return res.status(500).json({ reply: 'No se recibió respuesta del modelo. Revisa la clave o el modelo.' });
    }

    return res.status(200).json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error('Error interno:', error);
    return res.status(500).json({ reply: 'Error interno del servidor.' });
  }
}
