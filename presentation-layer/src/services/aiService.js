import axios from "axios";
import fs from "fs";

export async function classifyImage(imagePath) {
  if (!imagePath) return { label: "Unknown", confidence: 0 };

  const imageData = fs.readFileSync(imagePath);

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/Falconsai/nsfw_image_detection",
      imageData,
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/octet-stream",
        },
        timeout: 60000, // 60 seconds timeout
      }
    );

    // The response format depends on the model
    const result = response.data;
    // Example: convert result to { label, confidence }
    const label = result?.[0]?.label || "Unknown";
    const confidence = result?.[0]?.score || 0;

    return { label, confidence };
  } catch (err) {
    console.error("AI classification failed:", err.message);
    return { label: "Unknown", confidence: 0 };
  }
}
