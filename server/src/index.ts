import express, { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_URL: string = process.env.API_URL!;

if (!API_URL) {
  console.error('Error: API_URL is not defined in .env');
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

interface RecordLabelData {
  recordLabel: string;
  bands: {
    bandName: string;
    festivals: string[];
  }[];
}

const sortByKey = <T>(obj: Record<string, T>): Record<string, T> => {
  return Object.fromEntries(
    Object.entries(obj).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
  );
};

const formatFestivalData = (data: Festival[]): RecordLabelData[] => {
  const recordLabels: Record<string, Record<string, Set<string>>> = {};

  data.forEach(festival => {
    const festivalName: string = festival.name || 'Unknown Festival';
    const bands: Band[] = festival.bands || [];

    bands.forEach(band => {
      const label: string = band.recordLabel || 'Unknown';
      const bandName: string = band.name;

      if (!recordLabels[label]) {
        recordLabels[label] = {};
      }
      if (!recordLabels[label][bandName]) {
        recordLabels[label][bandName] = new Set();
      }
      recordLabels[label][bandName].add(festivalName);
    });
  });

  return Object.entries(sortByKey(recordLabels)).map(([label, bands]) => ({
    recordLabel: label,
    bands: Object.entries(sortByKey(bands)).map(([bandName, festivals]) => ({
      bandName,
      festivals: Array.from(festivals).sort()
    }))
  }));
};

app.get('/api/festivals', async (req: Request, res: Response) => {
  try {
    const response = await axios.get<Festival[]>(API_URL);
    const data = formatFestivalData(response.data);
    res.json(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data);
      res
        .status(500)
        .json({ error: 'Failed to fetch data from the external API' });
    } else {
      console.error('Unknown error:', error);
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
