import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, Eye, Thermometer, MapPin, Search, RefreshCw } from 'lucide-react';
import { getWeather, getWeatherForecast } from '../services/api';

const WEATHER_ICONS = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Fog: '🌫️',
    Haze: '🌫️',
};

const FARMING_ADVICE = {
    Clear: 'Good day for field work, spraying, and harvesting. Ensure adequate irrigation.',
    Clouds: 'Suitable for transplanting seedlings. Moderate evaporation.',
    Rain: 'Avoid spraying pesticides. Check drainage. Good for sowing dry land crops.',
    Drizzle: 'Light rain - monitor for fungal diseases. Avoid field operations.',
    Thunderstorm: 'Stay indoors. Secure farm equipment. Check for crop lodging after storm.',
    Snow: 'Protect crops from frost. Cover sensitive plants.',
    Mist: 'High humidity - watch for fungal diseases. Delay spraying.',
    Fog: 'Delay field operations. Risk of fungal diseases.',
    Haze: 'Moderate conditions. Normal farming activities can continue.',
};

const POPULAR_CITIES = ['Delhi', 'Mumbai', 'Pune', 'Jaipur', 'Lucknow', 'Bhopal', 'Hyderabad', 'Bengaluru', 'Chennai', 'Kolkata', 'Nagpur', 'Chandigarh'];

export default function WeatherDashboard({ language }) {
    const [city, setCity] = useState('Delhi');
    const [searchInput, setSearchInput] = useState('Delhi');
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchWeather = async (cityName) => {
        setLoading(true);
        setError(null);
        try {
            const [w, f] = await Promise.all([
                getWeather(cityName),
                getWeatherForecast(cityName),
            ]);
            setWeather(w);
            setForecast(f);
            setCity(cityName);
        } catch (err) {
            setError('Could not fetch weather. Check city name or API key.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchWeather('Delhi'); }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) fetchWeather(searchInput.trim());
    };

    const weatherMain = weather?.weather?.[0]?.main || 'Clear';
    const icon = WEATHER_ICONS[weatherMain] || '🌤️';
    const advice = FARMING_ADVICE[weatherMain] || 'Normal farming conditions.';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Cloud size={22} color="white" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f0fdf4' }}>
                            {language === 'hi' ? 'मौसम जानकारी' : language === 'te' ? 'వాతావరణ సమాచారం' : 'Weather Forecast'}
                        </h2>
                        <span style={{ fontSize: '12px', color: '#60a5fa' }}>
                            {language === 'hi' ? 'आपके खेत के लिए मौसम' : language === 'te' ? 'మీ పొలానికి వాతావరణం' : 'Weather for your farm'}
                        </span>
                    </div>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ position: 'relative' }}>
                        <MapPin size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                        <input
                            className="input-field"
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                            placeholder="Enter city..."
                            style={{ paddingLeft: '32px', width: '180px' }}
                        />
                    </div>
                    <button className="btn-primary" type="submit" style={{ padding: '10px 16px' }}>
                        <Search size={16} />
                    </button>
                    <button className="btn-secondary" type="button" onClick={() => fetchWeather(city)} style={{ padding: '10px 12px' }}>
                        <RefreshCw size={16} />
                    </button>
                </form>
            </div>

            {/* City Quick Select */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {POPULAR_CITIES.map(c => (
                    <button
                        key={c}
                        onClick={() => { setSearchInput(c); fetchWeather(c); }}
                        style={{
                            background: city === c ? 'rgba(96, 165, 250, 0.2)' : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${city === c ? '#60a5fa' : 'rgba(255,255,255,0.1)'}`,
                            borderRadius: '20px', padding: '4px 12px',
                            fontSize: '12px', color: city === c ? '#60a5fa' : '#9ca3af',
                            cursor: 'pointer', transition: 'all 0.2s',
                        }}
                    >
                        {c}
                    </button>
                ))}
            </div>

            {error && (
                <div style={{
                    background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '12px', padding: '12px 16px', color: '#f87171', fontSize: '14px',
                }}>
                    ⚠️ {error}
                </div>
            )}

            {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                    <div style={{
                        width: '48px', height: '48px', borderRadius: '50%',
                        border: '3px solid rgba(96, 165, 250, 0.2)',
                        borderTop: '3px solid #60a5fa',
                        animation: 'spin 1s linear infinite',
                    }} />
                </div>
            )}

            {weather && !loading && (
                <>
                    {/* Main Weather Card */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="glass-card" style={{ padding: '28px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{
                                position: 'absolute', top: '-20px', right: '-20px',
                                fontSize: '120px', opacity: 0.1, lineHeight: 1,
                            }}>
                                {icon}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                <div style={{ fontSize: '64px', lineHeight: 1 }}>{icon}</div>
                                <div>
                                    <div style={{ fontSize: '52px', fontWeight: '800', color: '#f0fdf4', lineHeight: 1 }}>
                                        {Math.round(weather.main.temp)}°C
                                    </div>
                                    <div style={{ fontSize: '16px', color: '#86efac', marginTop: '4px', textTransform: 'capitalize' }}>
                                        {weather.weather[0].description}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', color: '#9ca3af', fontSize: '14px' }}>
                                        <MapPin size={14} /> {weather.name}, {weather.sys.country}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
                                {[
                                    { icon: <Thermometer size={16} />, label: 'Feels Like', value: `${Math.round(weather.main.feels_like)}°C` },
                                    { icon: <Droplets size={16} />, label: 'Humidity', value: `${weather.main.humidity}%` },
                                    { icon: <Wind size={16} />, label: 'Wind', value: `${Math.round(weather.wind.speed * 3.6)} km/h` },
                                    { icon: <Eye size={16} />, label: 'Visibility', value: `${(weather.visibility / 1000).toFixed(1)} km` },
                                ].map((stat, i) => (
                                    <div key={i} style={{
                                        background: 'rgba(255,255,255,0.05)', borderRadius: '10px',
                                        padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px',
                                    }}>
                                        <span style={{ color: '#60a5fa' }}>{stat.icon}</span>
                                        <div>
                                            <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase' }}>{stat.label}</div>
                                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#f0fdf4' }}>{stat.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Farming Advice */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div className="glass-card" style={{ padding: '20px', borderColor: 'rgba(74, 222, 128, 0.2)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '20px' }}>🌾</span>
                                    <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#4ade80' }}>
                                        {language === 'hi' ? 'कृषि सलाह' : language === 'te' ? 'వ్యవసాయ సలహా' : 'Farming Advice'}
                                    </h3>
                                </div>
                                <p style={{ fontSize: '13px', color: '#d1fae5', lineHeight: '1.6' }}>{advice}</p>
                            </div>

                            <div className="glass-card" style={{ padding: '20px' }}>
                                <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#f59e0b', marginBottom: '12px' }}>
                                    📊 {language === 'hi' ? 'वायुमंडलीय डेटा' : language === 'te' ? 'వాతావరణ డేటా' : 'Atmospheric Data'}
                                </h3>
                                {[
                                    { label: 'Min Temp', value: `${Math.round(weather.main.temp_min)}°C` },
                                    { label: 'Max Temp', value: `${Math.round(weather.main.temp_max)}°C` },
                                    { label: 'Pressure', value: `${weather.main.pressure} hPa` },
                                    { label: 'Cloudiness', value: `${weather.clouds.all}%` },
                                ].map((item, i) => (
                                    <div key={i} style={{
                                        display: 'flex', justifyContent: 'space-between',
                                        padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
                                        fontSize: '13px',
                                    }}>
                                        <span style={{ color: '#9ca3af' }}>{item.label}</span>
                                        <span style={{ color: '#f0fdf4', fontWeight: '600' }}>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Forecast */}
                    {forecast && (
                        <div className="glass-card" style={{ padding: '20px' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#f0fdf4', marginBottom: '16px' }}>
                                📅 {language === 'hi' ? '5 दिन का पूर्वानुमान' : language === 'te' ? '5 రోజుల అంచనా' : '5-Day Forecast'}
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                                {forecast.list.slice(0, 5).map((item, i) => {
                                    const date = new Date(item.dt * 1000);
                                    const dayIcon = WEATHER_ICONS[item.weather[0].main] || '🌤️';
                                    return (
                                        <div key={i} style={{
                                            background: 'rgba(255,255,255,0.04)', borderRadius: '12px',
                                            padding: '14px', textAlign: 'center',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                        }}>
                                            <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '8px' }}>
                                                {date.toLocaleDateString('en-IN', { weekday: 'short' })}
                                            </div>
                                            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{dayIcon}</div>
                                            <div style={{ fontSize: '15px', fontWeight: '700', color: '#f0fdf4' }}>
                                                {Math.round(item.main.temp)}°C
                                            </div>
                                            <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '4px', textTransform: 'capitalize' }}>
                                                {item.weather[0].description}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
