import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Play, Square, Activity, Copy } from "lucide-react";
import { motion } from "framer-motion";


const socket = io("http://localhost:4000");

export default function App() {
  const [url, setUrl] = useState("");
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState("idle");
  const [logs, setLogs] = useState([]);

  const logBoxRef = useRef(null);

  useEffect(() => {
    socket.on("record-status", (data) => {
      if (data.jobId === jobId) {
        setStatus(data.status);
      }
    });

    socket.on("record-log", (data) => {
      if (data.jobId === jobId) {
        setLogs((prev) => [...prev, data.log]);
      }
    });

    return () => {
      socket.off("record-status");
      socket.off("record-log");
    };
  }, [jobId]);

  useEffect(() => {
    if (logBoxRef.current) {
      logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
    }
  }, [logs]);

  const start = async () => {
    const res = await fetch("http://localhost:4000/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();
    setJobId(data.jobId);
    setStatus("starting");
    setLogs([]);
  };

  const stop = async () => {
    if (!jobId) return;

    await fetch("http://localhost:4000/stop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId }),
    });

    setStatus("stopping");
  };

  const copyJobId = () => {
    if (jobId) navigator.clipboard.writeText(jobId);
  };

  return (
    <div className="app">
      
      {/* Sidebar */}
      <div className="sidebar">
        <h2>🎥 Recorder Pro</h2>

        <div className="status-box">
          <Activity />
          <div>
            <p>Status</p>
            <h3 className={`status ${status}`}>{status}</h3>
          </div>
        </div>

        <div className="job-box">
          <p>Job ID</p>
          <div className="job-id">
            <span>{jobId || "None"}</span>
            <Copy size={14} onClick={copyJobId} />
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="main">
        
        {/* Input Panel */}
        <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3>Start Recording</h3>

          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste .m3u8 URL"
          />

          <div className="row">
            <button className="start" onClick={start}>
              <Play size={16} /> Start
            </button>

            <button className="stop" onClick={stop}>
              <Square size={16} /> Stop
            </button>
          </div>
        </motion.div>

        {/* Logs */}
        <div className="log-card">
          <h3>Live Logs</h3>

          <div className="logs" ref={logBoxRef}>
            {logs.length === 0 ? (
              <p className="empty">No logs yet...</p>
            ) : (
              logs.map((l, i) => (
                <pre key={i}>{l}</pre>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}