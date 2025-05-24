import React, { useState, useEffect } from "react";

export default function WeatherPage() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [city, setCity] = useState("Taipei");
    const [searchInput, setSearchInput] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [recLoading, setRecLoading] = useState(false);
    const [recError, setRecError] = useState(null);

    const fetchWeather = (cityName) => {
        setLoading(true);
        setError(null);
        fetch(`/api/weather/current/?city=${encodeURIComponent(cityName)}`)
            .then((res) => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then((data) => {
                setWeather({
                    icon: data.weather && data.weather[0] && data.weather[0].icon,
                    city: data.name,
                    temperature: (data.main.temp - 273.15).toFixed(1),
                    description: data.weather && data.weather[0] && data.weather[0].description,
                });
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchWeather(city);
    }, [city]);

    useEffect(() => {
        if (weather && weather.description) {
            setRecLoading(true);
            setRecError(null);
            fetch(`/api/products/weather-recommendation/?city=${encodeURIComponent(weather.city)}&temp=${encodeURIComponent(weather.temperature)}&desc=${encodeURIComponent(weather.description)}`)
                .then((res) => {
                    if (!res.ok) throw new Error("推薦失敗");
                    return res.json();
                })
                .then((data) => {
                    setRecommendations(data.results || []);
                })
                .catch((err) => {
                    setRecError(err.message);
                })
                .finally(() => setRecLoading(false));
        }
    }, [weather]);

    return (
        <div className="container mt-3">
            <div className="row">
                <div className="col-auto">
                    <div style={{ minWidth: 270, maxWidth: 320 }}>
                        <div className="card shadow-sm mb-3">
                            <div className="card-body p-3">
                                <h5 className="card-title text-center mb-2">天氣資訊</h5>
                                {loading ? (
                                    <div className="text-center">Loading...</div>
                                ) : error ? (
                                    <div className="alert alert-danger text-center">{error}</div>
                                ) : weather ? (
                                    <div className="d-flex flex-column align-items-center">
                                        <img src={`http://openweathermap.org/img/w/${weather.icon}.png`} alt="Weather icon" style={{ width: 40, height: 40 }} />
                                        <span className="h6 mt-2 mb-1">{weather.city}</span>
                                        <span className="fw-bold text-primary mb-1">{weather.temperature} °C</span>
                                        <span className="text-muted small">{weather.description}</span>
                                    </div>
                                ) : (
                                    <div className="text-center">No weather data.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card shadow-sm mb-3">
                        <div className="card-body">
                            <h5 className="card-title text-center mb-3">天氣推薦商品</h5>
                            {recLoading ? (
                                <div className="text-center">推薦載入中...</div>
                            ) : recError ? (
                                <div className="alert alert-danger text-center">{recError}</div>
                            ) : recommendations.length > 0 ? (
                                <ul className="list-group">
                                    {recommendations.map((item) => (
                                        <li className="list-group-item" key={item.id}>
                                            <a href={`/product/${item.id}`} className="text-decoration-none">
                                                {item.name}
                                            </a>
                                            <div className="text-muted small">{item.category}</div>
                                            <div>{item.description}</div>
                                            <div className="fw-bold">${item.price}</div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center text-muted">無推薦商品</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}