import axios from "axios";

export const generateThankYouMessage = async ({ name, item, location }) => {
  try {
    const response = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: "Qwen/Qwen2.5-7B-Instruct",
        messages: [
          {
            role: "user",
            content: `
            Write a warm and friendly thank you message.

            Requirements:
            - Address the donor by name: ${name}
            - Mention the donated item: ${item || "items"} all in pural form
            - Mention the destination location: ${location || "Sri Lanka"}
            - Mention our platform name: Aidify
            - Explain how the donation helps people
            - Include WhatsApp contact: 0762548563
            - Keep it emotional and meaningful
            Make it sound natural and human.
            `
          }
        ],
        max_tokens: 500
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content;

  } catch (err) {
    console.error("AI ERROR:", err.response?.data || err.message);

    // fallback (IMPORTANT)
    return `Hi ${name}, thank you for donating ${item || "items"} ❤️  
Your kindness helps many people in ${location || "Sri Lanka"}.
Contact us via WhatsApp 0762548563. Thank you once again for being part of Aidify 💖`;
  }
};