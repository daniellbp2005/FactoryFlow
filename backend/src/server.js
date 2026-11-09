import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import app from "./app.js";

const port = Number(process.env.PORT || 8080);

app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});

