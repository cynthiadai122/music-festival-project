import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Band = {
  bandName: string;
  festivals: string[];
};

type RecordLabel = {
  recordLabel: string;
  bands: Band[];
};

const App: React.FC = () => {
  const [data, setData] = useState<RecordLabel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<RecordLabel[]>('http://localhost:5000/api/festivals');
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {data.map((recordLabel) => (
        <div key={recordLabel.recordLabel}>
          <h2>{recordLabel.recordLabel}</h2>
          {recordLabel.bands.map((band) => (
            <div key={band.bandName}>
              <h3>{band.bandName}</h3>
              <ul>
                {band.festivals.map((festival) => (
                  <li key={festival}>{festival}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default App;
