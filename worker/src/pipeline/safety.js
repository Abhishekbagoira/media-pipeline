import logger from "../utils/logger.js";
import { annotateImage } from "./vision.js";

const UNSAFE_LIKELIHOODS = ["POSSIBLE", "LIKELY", "VERY_LIKELY"];

export const runSafeSearch = async (localPath) => {
  logger.info("[safety] starting");

  const responseData = await annotateImage(localPath);
  const safe = responseData.safeSearchAnnotation ?? {};

  const details = {
    adult: safe.adult ?? "UNKNOWN",
    violence: safe.violence ?? "UNKNOWN",
    racy: safe.racy ?? "UNKNOWN",
  };

  const flaggedCategories = Object.entries(details)
    .filter(([, likelihood]) => UNSAFE_LIKELIHOODS.includes(likelihood))
    .map(([category]) => category);

  const flagged = flaggedCategories.length > 0;

  logger.info(
    `[safety] flagged=${flagged} categories=${flaggedCategories.join(", ") || "none"}`,
  );

  return { flagged, flaggedCategories, details };
};
