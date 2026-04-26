import express from "express";
import http from "http";
import cors from "cors";
import { initSocket } from "./socket.js";
import { addRecordingJob } from "./queue.js";
import { stopRecording } from "./ffmpeg/recorder.js";
import "./worker.js";

const app = express();

const isProduction = process.env.NODE_ENV === "production";
const allowedOrigin = process.env.CORS_ORIGIN || (isProduction ? false : "*");
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

const server = http.createServer(app);

// init socket
const io = initSocket(server, allowedOrigin);

// API
app.post("/start", async (req, res) => {
  const { url } = req.body;

  const jobId = await addRecordingJob(url);

  res.json({ jobId });
});

app.post("/stop", (req, res) => {
  const { jobId } = req.body;

  stopRecording(jobId);

  res.json({ status: "stopped" });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Backend running on ${PORT}`);
});