import axios from "axios";
import fs from "fs";

export const classifyImage = async (imagePath) => {
  const imageBuffer = fs.readFileSync(imagePath);

  const response = await axios.post(
    "https://router.huggingface.co/hf-inference/models/google/vit-base-patch16-224",
    imageBuffer,
    {
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/octet-stream",
      },
      timeout: 10000,
    }
  );

  // HuggingFace returns array of predictions
  const bestResult = response.data[0];

  return {
    label: bestResult.label,
    confidence: bestResult.score,
  };
};
