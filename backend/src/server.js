import express from "express";
import http from "http";
import cors from "cors";
import { initSocket } from "./socket.js";
import { addRecordingJob } from "./queue.js";
import { stopRecording } from "./ffmpeg/recorder.js";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// init socket
const io = initSocket(server);

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

server.listen(4000, () => {
  console.log("Backend running on 4000");
});