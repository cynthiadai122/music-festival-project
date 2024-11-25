import express, { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_URL = process.env.API_URL;

if (!API_URL) {
  console.error('Error: API_URL is not defined in .env');
  process.exit(1);
}

type Band = {
  name: string;
  recordLabel?: string;
};

type Festival = {
  name: string;
  bands: Band[];
};

type RecordLabelData = {
  recordLabel: string;
  bands: { bandName: string; festivals: string[] }[];
};

const transformData = (data: Festival[]): RecordLabelData[] => {
  const recordLabels: Record<string, Record<string, Set<string>>> = {};

  data.forEach((festival) => {
    (festival.bands || []).forEach((band) => {
      const label = band.recordLabel || 'Unknown';
      const bandName = band.name;

      if (!recordLabels[label]) recordLabels[label] = {};
      if (!recordLabels[label][bandName]) recordLabels[label][bandName] = new Set();

      if (festival.name) recordLabels[label][bandName].add(festival.name);
    });
  });

  return Object.entries(recordLabels)
    .sort()
    .map(([label, bands]) => ({
      recordLabel: label,
      bands: Object.entries(bands)
        .sort()
        .map(([bandName, festivals]) => ({
          bandName,
          festivals: Array.from(festivals).sort(),
        })),
    }));
};

app.get('/api/festivals', async (req: Request, res: Response) => {
  try {
    const response = await axios.get<Festival[]>(API_URL);
    const formattedData = transformData(response.data);
    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching festival data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
