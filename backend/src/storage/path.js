import fs from "fs";
import path from "path";

export function getRecordingPath(jobId) {
  const dir = path.join(process.cwd(), "recordings");

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  return path.join(dir, `${jobId}.mp4`);
}