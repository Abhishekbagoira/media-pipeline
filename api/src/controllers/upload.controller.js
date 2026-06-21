import { v4 as uuidv4 } from "uuid";
import { pool } from "../config/db.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import { runCaptioning } from "../pipeline/caption.js";
import { runLabelDetection } from "../pipeline/labels.js";
import { runSafeSearch } from "../pipeline/safety.js";

export async function uploadImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file provided. Use form field name "file".',
      });
    }

    const jobId = uuidv4();

    // Upload to Cloudinary
    const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
    if (!cloudinaryResponse) {
      return res.status(500).json({
        error: "Failed to upload image to Cloudinary",
      });
    }

    // Create job record
    await pool.query(
      `INSERT INTO jobs (id, user_id, file_path, original_filename, status)
       VALUES ($1, $2, $3, $4, 'pending')`,
      [
        jobId,
        req.user.id,
        cloudinaryResponse.secure_url,
        req.file.originalname,
      ],
    );

    // Process image immediately
    try {
      const caption = await runCaptioning(req.file.path);
      const labels = await runLabelDetection(req.file.path);
      const { flagged, flaggedCategories, details } = await runSafeSearch(
        req.file.path,
      );

      await pool.query(
        `UPDATE jobs 
         SET status = 'completed', 
             caption = $1, 
             labels = $2, 
             safety_result = $3, 
             flagged = $4, 
             flagged_categories = $5,
             updated_at = NOW()
         WHERE id = $6`,
        [
          caption,
          JSON.stringify(labels),
          JSON.stringify(details),
          flagged,
          JSON.stringify(flaggedCategories),
          jobId,
        ],
      );

      // Create notification if flagged
      if (flagged && flaggedCategories.length > 0) {
        const categories = flaggedCategories.join(", ");
        const message = `Your upload was flagged for: ${categories}. Please review the content policy.`;
        await pool.query(
          `INSERT INTO notifications (user_id, job_id, message, type)
           VALUES ($1, $2, $3, 'flagged_content')`,
          [req.user.id, jobId, message],
        );
      }

      return res.status(202).json({
        jobId,
        status: "completed",
        caption,
        labels,
        flagged,
      });
    } catch (err) {
      // If processing fails, update job as failed
      await pool.query(
        `UPDATE jobs 
         SET status = 'failed', 
             error_message = $1,
             updated_at = NOW()
         WHERE id = $2`,
        [err.message, jobId],
      );

      return res.status(500).json({
        error: "Image processing failed",
        jobId,
        message: err.message,
      });
    }
  } catch (err) {
    next(err);
  }
}
