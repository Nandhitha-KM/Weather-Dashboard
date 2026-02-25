import { useState } from "react";
import api from "../services/api";

function WeatherDashboard() {
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city.trim() || !date) {
      setError("Please enter city and select date");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await api.get("/forecast", {
        params: {
          q: city + ",IN",
          appid: import.meta.env.VITE_OWM_API_KEY,
          units: "metric",
        },
      });

      // Find forecast matching selected date
      const selectedData = res.data.list.find(item =>
        item.dt_txt.startsWith(date)
      );

      if (!selectedData) {
        setError("No data available for selected date");
        setLoading(false);
        return;
      }

      setResult({
        temperature: selectedData.main.temp,
        humidity: selectedData.main.humidity,
        pressure: selectedData.main.pressure,
        description: selectedData.weather[0].description,
        cityName: res.data.city.name,
        date: selectedData.dt_txt,
      });

    } catch (err) {
      console.error(err);
      setError("City not found or API error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-card">
      <h2>📅 Weather Forecast</h2>

      <input
        type="text"
        className="weather-input"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter Indian city"
      />

      <input
        type="date"
        className="weather-input"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button className="weather-button" onClick={fetchWeather}>
        Get Weather
      </button>

      {loading && <p className="message">Loading...</p>}
      {error && <p className="message error">{error}</p>}

      {result && (
        <div className="weather-result">
          <h3>📍 {result.cityName}</h3>
          <p>📆 {result.date}</p>
          <p>🌡️ Temperature: {result.temperature} °C</p>
          <p>💧 Humidity: {result.humidity} %</p>
          <p>🌬️ Pressure: {result.pressure} hPa</p>
          <p style={{ textTransform: "capitalize" }}>
            ☁️ Condition: {result.description}
          </p>
        </div>
      )}
    </div>
  );
}

export default WeatherDashboard;