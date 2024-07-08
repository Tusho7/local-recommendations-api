import express from "express";
import os from 'os'

const router = express.Router();

router.get("/metrics", (req, res) => {
  const uptime = os.uptime(); 
  const freemem = os.freemem(); 
  const totalmem = os.totalmem(); 
  const loadavg = os.loadavg(); 

  const uptimeFormatted = formatUptime(uptime);

  res.json({
    uptime: uptimeFormatted,
    freeMemory: freemem,
    totalMemory: totalmem,
    loadAverage: loadavg,
  });
});

function formatUptime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days} დღე, ${hours} საათი, ${minutes} წუთი`;
}

export default router;
