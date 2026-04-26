import { Worker } from "bullmq";
import IORedis from "ioredis";
import { startRecording } from "./ffmpeg/recorder.js";

const connection = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
  maxRetriesPerRequest: null,
});

new Worker(
  "recording",
  async (job) => {
    const { url } = job.data;

    await startRecording(job.id, url);

    return true;
  },
  { connection }
);