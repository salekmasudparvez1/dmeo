import { spawn } from "child_process";
import ffmpegPath from "ffmpeg-static";
import { addJob, removeJob } from "../jobs/activeJobs.js";
import { getRecordingPath } from "../storage/path.js";
import { getIO } from "../socket.js";

export function startRecording(jobId, url) {
  const output = getRecordingPath(jobId);

  const ffmpeg = spawn(ffmpegPath, [
    "-i", url,
    "-c", "copy",
    "-bsf:a", "aac_adtstoasc",
    output
  ]);

  addJob(jobId, ffmpeg);

  const io = getIO();

  io.emit("record-status", {
    jobId,
    status: "started"
  });

  ffmpeg.stderr.on("data", (data) => {
    io.emit("record-log", {
      jobId,
      log: data.toString()
    });
  });

  ffmpeg.on("close", (code) => {
    removeJob(jobId);

    io.emit("record-status", {
      jobId,
      status: code === 0 ? "finished" : "failed"
    });
  });

  return ffmpeg;
}

export function stopRecording(jobId) {
  const job = require("../jobs/activeJobs.js").getJob(jobId);

  if (job) {
    job.kill("SIGINT");
    removeJob(jobId);
  }
}