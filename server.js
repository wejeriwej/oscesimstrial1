import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(express.json());
app.use(cors()); // Allow requests from your web page





app.post("/api/oscetrial", async (req, res) => {
  const { input, previousquestion, response_question } = req.body;


  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", //gpt-4o-mini
        messages: [
          { role: "system", content: "you're Marc, a 31 year old male. with constant severe heavy chest pain since this morning. You're in a consultation room & the Dr is asking you questions. Answer as Marc" },
          { role: "user", content: `Previous Dr question: ${previousquestion || "N/A"}
                                    Your previous response: ${response_question || "N/A"}
                                    New Dr question: ${input}
                                    Marc's answer:` },
        ],
        temperature: 0.1,
        max_tokens: 50,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      }),
    });

    const data = await response.json();
    res.json({ content: data.choices[0].message.content.trim() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to connect to OpenAI" });
  }
});







app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));
