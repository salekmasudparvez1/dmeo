import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
  maxRetriesPerRequest: null,
});

export const recordingQueue = new Queue("recording", {
  connection,
});

export async function addRecordingJob(url) {
  const job = await recordingQueue.add("record", { url });
  return job.id;
}