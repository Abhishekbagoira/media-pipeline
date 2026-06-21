import fs from "fs";

const GOOGLE_VISION_API_KEY = process.env.GOOGLE_VISION_API_KEY;
const VISION_URL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`;

if (!GOOGLE_VISION_API_KEY) {
  throw new Error("GOOGLE_VISION_API_KEY is required in worker env");
}

export async function annotateImage(localPath) {
  const imageBytes = fs.readFileSync(localPath);
  const payload = {
    requests: [
      {
        image: {
          content: imageBytes.toString("base64"),
        },
        features: [
          { type: "LABEL_DETECTION", maxResults: 8 },
          { type: "SAFE_SEARCH_DETECTION" },
        ],
      },
    ],
  };

  const response = await fetch(VISION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google Vision API error ${response.status}: ${text}`);
  }

  const data = await response.json();
  return data.responses?.[0] ?? {};
}
