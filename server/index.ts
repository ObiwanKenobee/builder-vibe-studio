import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getBiblicalFoundationsOverview,
  getStewardshipMetrics,
  getReconciliationMetrics,
  getJusticeMetrics,
  getCreationVoiceMetrics,
  getTruthTransparencyMetrics
} from "./routes/biblical-foundations";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Biblical Foundations API routes
  app.get("/api/biblical-foundations/overview", getBiblicalFoundationsOverview);
  app.get("/api/biblical-foundations/stewardship", getStewardshipMetrics);
  app.get("/api/biblical-foundations/reconciliation", getReconciliationMetrics);
  app.get("/api/biblical-foundations/justice", getJusticeMetrics);
  app.get("/api/biblical-foundations/creation-voice", getCreationVoiceMetrics);
  app.get("/api/biblical-foundations/truth-transparency", getTruthTransparencyMetrics);

  return app;
}
