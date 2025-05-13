export default async function handler(req, res) {
  const body = await req.json?.() || req.body;

  const systemPrompt = `
    Eres HuellaBot, asistente de HuellaNet by Qalma.
    Solo puedes responder preguntas relacionadas con sostenibilidad, cálculo de huella de carbono y el uso de HuellaNet.
    No respondas nada más. Si la pregunta no encaja, responde:
    "Solo puedo ayudarte con temas relacionados con HuellaNet. Para otras dudas, contacta con el equipo de Qalma 😊"
  `;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: body.message }
      ],
      max_tokens: 300,
      temperature: 0.5
    })
  });

  const data = await response.json();
  res.status(200).json({ reply: data.choices[0].message.content });
}
