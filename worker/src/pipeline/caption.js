import logger from "../utils/logger.js";
import { annotateImage } from "./vision.js";

export const runCaptioning = async (localPath) => {
  logger.info("[caption] starting");

  const responseData = await annotateImage(localPath);
  const annotations = responseData.labelAnnotations ?? [];

  const labels = annotations
    .slice(0, 3)
    .map((item) => item.description?.toLowerCase())
    .filter(Boolean);

  const caption = labels.length
    ? `an image of ${labels.join(", ")}`
    : "unknown image";

  logger.info(`[caption] result: "${caption}"`);
  return caption;
};
