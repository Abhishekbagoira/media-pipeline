import { annotateImage } from "./vision.js";

export const runCaptioning = async (localPath) => {
  const responseData = await annotateImage(localPath);
  const annotations = responseData.labelAnnotations ?? [];

  const labels = annotations
    .slice(0, 3)
    .map((item) => item.description?.toLowerCase())
    .filter(Boolean);

  const caption = labels.length
    ? `an image of ${labels.join(", ")}`
    : "unknown image";

  return caption;
};
