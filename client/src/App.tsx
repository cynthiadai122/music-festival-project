import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Paper,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText
} from "@mui/material";

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
        const response = await axios.get<RecordLabel[]>(
          "http://localhost:5000/api/festivals"
        );
        setData(response.data);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <CircularProgress />;
  if (error)
    return (
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    );

  return (
    <Container>
      {data.map(recordLabel => (
        <Paper
          key={recordLabel.recordLabel}
          sx={{ padding: 2, marginBottom: 3 }}
        >
          <Typography variant="h5" gutterBottom>
            {recordLabel.recordLabel}
          </Typography>
          {recordLabel.bands.map(band => (
            <div key={band.bandName}>
              <Typography variant="h6">{band.bandName}</Typography>
              <List>
                {band.festivals.map(festival => (
                  <ListItem key={festival}>
                    <ListItemText primary={festival} />
                  </ListItem>
                ))}
              </List>
            </div>
          ))}
        </Paper>
      ))}
    </Container>
  );
};

export default App;
