import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis();

export const recordingQueue = new Queue("recording", {
  connection,
});

export async function addRecordingJob(url) {
  const job = await recordingQueue.add("record", { url });
  return job.id;
}