import { annotateImage } from "./vision.js";

export const runLabelDetection = async (localPath) => {
  const responseData = await annotateImage(localPath);
  const annotations = responseData.labelAnnotations ?? [];

  const labels = annotations.map((item) => ({
    name: item.description?.toLowerCase() ?? "",
    confidence: Math.round((item.score ?? 0) * 100) / 100,
  }));

  return labels;
};
