import { Worker } from "bullmq";
import IORedis from "ioredis";
import { startRecording } from "./ffmpeg/recorder.js";

const connection = new IORedis();

new Worker(
  "recording",
  async (job) => {
    const { url } = job.data;

    await startRecording(job.id, url);

    return true;
  },
  { connection }
);