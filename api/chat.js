export default async function handler(req, res) {
  const body = req.body;

  const systemPrompt = `
    Eres HuellaBot, el asistente de HuellaNet by Qalma.
    Solo puedes responder preguntas relacionadas con sostenibilidad, huella de carbono y el uso de HuellaNet.
    Si te preguntan algo fuera de ese contexto, responde: "Lo siento, solo puedo ayudarte con temas relacionados con HuellaNet."
  `;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: body.message }
        ],
        max_tokens: 300,
        temperature: 0.5
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ reply: "No se pudo generar una respuesta. Verifica la clave de API o el modelo." });
    }

    return res.status(200).json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error("Error en HuellaBot:", error);
    return res.status(500).json({ reply: "Error interno al contactar con la IA." });
  }
}
