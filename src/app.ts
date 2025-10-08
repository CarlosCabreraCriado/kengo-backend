import dotenv from "dotenv";
dotenv.config();

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

import apiKengo from "./routes/apiKengo";

const app = express();
const PORT = 3000;

app.use(cors({ origin: true }));
app.use(express.json());

app.use("/", apiKengo);

app.use(
  cors({
    origin: "*", // o '*' para todos los orígenes
  }),
);

app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
