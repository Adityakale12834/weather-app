import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WeatherChart = (city) => {
    const [chartData, setChartData] = useState(null);

    const fetchWeatherForecast = async (city) => {
        try {
            console.log(city);
            const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city.data}&units=metric&appid=f48818daebfd6448d6f8c20b7cae5d4e`);
            const data = await response.json();
            console.log(data);
            // Extract required data: Temperature & Time
            const labels = data.list.map(entry =>
                new Date(entry.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            );
            const temperatures = data.list.map(entry => entry.main.temp);

            setChartData({
                labels,
                datasets: [
                    {
                        label: "Temperature (°C)",
                        data: temperatures,
                        borderColor: "rgba(75,192,192,1)",
                        backgroundColor: "rgba(75,192,192,0.2)",
                        borderWidth: 2,
                        pointRadius: 3,
                    },
                ],
            });
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    };

    useEffect(() => {
        if (city) {
            console.log("Fetching weather for:", city);
            fetchWeatherForecast(city);
        }
    }, [city]);

    return (
        <div className="h-full">
            {chartData ? (
                <Line
                    data={chartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: true } },
                        scales: { y: { beginAtZero: false } },
                    }}
                />
            ) : (
                <p>Loading chart...</p>
            )}
        </div>
    );
};

export default WeatherChart;
