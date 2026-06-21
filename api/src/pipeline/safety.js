import { annotateImage } from "./vision.js";

const UNSAFE_LIKELIHOODS = ["POSSIBLE", "LIKELY", "VERY_LIKELY"];

export const runSafeSearch = async (localPath) => {
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

  return { flagged, flaggedCategories, details };
};
