export default async function handler(req, res) {
  try {
    const body = req.body;

    if (!body || !body.message) {
      return res.status(400).json({ reply: 'Mensaje no recibido.' });
    }

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta2/models/chat-bison-001:generateMessage?key=' + process.env.GEMINI_API_KEY,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: {
            messages
