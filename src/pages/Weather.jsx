import { useEffect, useState } from "react";

function Weather() {

  const [weather, setWeather] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/weather`)
      .then(res => res.json())
      .then(data => setWeather(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h2>Weather Information</h2>
      {weather ? (
        <pre>{JSON.stringify(weather, null, 2)}</pre>
      ) : (
        <p>Loading weather...</p>
      )}
    </div>
  );
}

export default Weather;
