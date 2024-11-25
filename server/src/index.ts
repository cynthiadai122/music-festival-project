import express, { Request, Response } from "express";
import axios, { AxiosError } from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_URL: string = process.env.API_URL!;

if (!API_URL) {
  console.error("Error: API_URL is not defined in .env");
  process.exit(1);
}

interface Band {
  name: string;
  recordLabel: string;
}

interface Festival {
  name: string;
  bands: Band[];
}

app.get("/api/festivals", async (req: Request, res: Response) => {
  try {
    const response = await axios.get<Festival[]>(API_URL);
    const data = response.data;
    res.json(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data);
    } else {
      console.error("Unknown error:", error);
    }
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
