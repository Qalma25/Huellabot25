export default async function handler(req, res) {
  const HF_API_KEY = process.env.HF_API_KEY;

  if (!HF_API_KEY) {
    return res.status(500).json({ reply: 'API Key no configurada' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: 'Mensaje vacío' });
  }

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `<s>[INST] ${message} [/INST]`
      })
    });

    const data = await response.json();
    const texto = data?.[0]?.generated_text?.split('[/INST]')[1]?.trim();

    res.status(200).json({ reply: texto || 'No se pudo generar respuesta.' });
  } catch (error) {
    console.error('❌ Error HuggingFace:', error);
    res.status(500).json({ reply: 'Error al contactar con Hugging Face.' });
  }
}
