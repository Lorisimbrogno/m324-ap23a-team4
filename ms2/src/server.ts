import "dotenv/config";
import express from "express";

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;
/** Basis-URL von MS1 – wird für die Ortschafts-Validierung (US3) benötigt. */
export const MS1_URL = process.env.MS1_URL || "http://localhost:3001";

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "ms2" });
});

app.listen(PORT, () => {
  console.log(`ms2 läuft auf Port ${PORT} (MS1_URL=${MS1_URL})`);
});
