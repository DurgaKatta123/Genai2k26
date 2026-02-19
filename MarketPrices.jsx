import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Search, Filter, BarChart3 } from 'lucide-react';
import { getMarketPrices, MOCK_MARKET_DATA } from '../services/api';

const STATES = ['All States', 'Maharashtra', 'Madhya Pradesh', 'Uttar Pradesh', 'Rajasthan', 'Haryana', 'Punjab', 'Karnataka', 'Andhra Pradesh', 'Gujarat'];
const COMMODITIES = ['All', 'Wheat', 'Rice', 'Tomato', 'Onion', 'Potato', 'Soybean', 'Cotton', 'Maize', 'Mustard', 'Chilli'];

export default function MarketPrices({ language }) {
    const [data, setData] = useState(MOCK_MARKET_DATA);
    const [loading, setLoading] = useState(false);
    const [selectedState, setSelectedState] = useState('All States');
    const [selectedCommodity, setSelectedCommodity] = useState('All');
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('modal_price');
    const [sortDir, setSortDir] = useState('desc');
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const fetchData = async () => {
        setLoading(true);
        try {
            const state = selectedState === 'All States' ? 'Maharashtra' : selectedState;
            const commodity = selectedCommodity === 'All' ? '' : selectedCommodity;
            const records = await getMarketPrices(state, commodity);
            if (records.length > 0) {
                setData(records);
            } else {
                setData(MOCK_MARKET_DATA);
            }
            setLastUpdated(new Date());
        } catch {
            setData(MOCK_MARKET_DATA);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [selectedState, selectedCommodity]);

    const filtered = data.filter(item => {
        const matchSearch = !search ||
            item.commodity?.toLowerCase().includes(search.toLowerCase()) ||
            item.market?.toLowerCase().includes(search.toLowerCase()) ||
            item.variety?.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
    }).sort((a, b) => {
        const aVal = parseFloat(a[sortBy]) || 0;
        const bVal = parseFloat(b[sortBy]) || 0;
        return sortDir === 'desc' ? bVal - aVal : aVal - bVal;
    });

    const toggleSort = (col) => {
        if (sortBy === col) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
        else { setSortBy(col); setSortDir('desc'); }
    };

    const getPriceChange = (min, max) => {
        const spread = ((parseFloat(max) - parseFloat(min)) / parseFloat(min) * 100).toFixed(1);
        return spread;
    };

    // Stats
    const avgPrice = data.length ? (data.reduce((s, d) => s + parseFloat(d.modal_price || 0), 0) / data.length).toFixed(0) : 0;
    const maxPrice = data.length ? Math.max(...data.map(d => parseFloat(d.modal_price || 0))) : 0;
    const minPrice = data.length ? Math.min(...data.map(d => parseFloat(d.modal_price || 0))) : 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <BarChart3 size={22} color="white" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f0fdf4' }}>
                            {language === 'hi' ? 'मंडी भाव' : language === 'te' ? 'మండి ధరలు' : 'Mandi Prices'}
                        </h2>
                        <span style={{ fontSize: '12px', color: '#f59e0b' }}>
                            {language === 'hi' ? 'अंतिम अपडेट: ' : language === 'te' ? 'చివరి అప్డేట్: ' : 'Last updated: '}
                            {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>
                <button className="btn-secondary" onClick={fetchData} disabled={loading} style={{ padding: '8px 16px', fontSize: '13px' }}>
                    <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                    {language === 'hi' ? 'अपडेट करें' : language === 'te' ? 'రిఫ్రెష్' : 'Refresh'}
                </button>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {[
                    { label: language === 'hi' ? 'औसत भाव' : language === 'te' ? 'సగటు ధర' : 'Avg Price', value: `₹${avgPrice}`, color: '#4ade80', icon: '📊' },
                    { label: language === 'hi' ? 'अधिकतम भाव' : language === 'te' ? 'గరిష్ఠ ధర' : 'Max Price', value: `₹${maxPrice}`, color: '#f59e0b', icon: '📈' },
                    { label: language === 'hi' ? 'न्यूनतम भाव' : language === 'te' ? 'కనిష్ట ధర' : 'Min Price', value: `₹${minPrice}`, color: '#60a5fa', icon: '📉' },
                ].map((stat, i) => (
                    <div key={i} className="stat-card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', marginBottom: '4px' }}>{stat.icon}</div>
                        <div style={{ fontSize: '20px', fontWeight: '800', color: stat.color }}>{stat.value}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{stat.label}/quintal</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="glass-card" style={{ padding: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: '1', minWidth: '160px' }}>
                    <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                    <input
                        className="input-field"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder={language === 'hi' ? 'खोजें...' : language === 'te' ? 'వెతకండి...' : 'Search commodity, market...'}
                        style={{ paddingLeft: '32px' }}
                    />
                </div>
                <select
                    className="input-field"
                    value={selectedState}
                    onChange={e => setSelectedState(e.target.value)}
                    style={{ width: 'auto', cursor: 'pointer' }}
                >
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select
                    className="input-field"
                    value={selectedCommodity}
                    onChange={e => setSelectedCommodity(e.target.value)}
                    style={{ width: 'auto', cursor: 'pointer' }}
                >
                    {COMMODITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {/* Table */}
            <div className="glass-card" style={{ overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table className="market-table">
                        <thead>
                            <tr>
                                {[
                                    { key: 'commodity', label: language === 'hi' ? 'फसल' : language === 'te' ? 'పంట' : 'Commodity' },
                                    { key: 'variety', label: language === 'hi' ? 'किस्म' : language === 'te' ? 'రకం' : 'Variety' },
                                    { key: 'market', label: language === 'hi' ? 'मंडी' : language === 'te' ? 'మండి' : 'Market' },
                                    { key: 'state', label: language === 'hi' ? 'राज्य' : language === 'te' ? 'రాష్ట్రం' : 'State' },
                                    { key: 'min_price', label: language === 'hi' ? 'न्यूनतम' : language === 'te' ? 'కనిష్టం' : 'Min (₹)' },
                                    { key: 'max_price', label: language === 'hi' ? 'अधिकतम' : language === 'te' ? 'గరిష్టం' : 'Max (₹)' },
                                    { key: 'modal_price', label: language === 'hi' ? 'मोडल' : language === 'te' ? 'మోడల్' : 'Modal (₹)' },
                                    { key: 'arrival_date', label: language === 'hi' ? 'तारीख' : language === 'te' ? 'తేది' : 'Date' },
                                ].map(col => (
                                    <th
                                        key={col.key}
                                        onClick={() => toggleSort(col.key)}
                                        style={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                                    >
                                        {col.label} {sortBy === col.key ? (sortDir === 'desc' ? '↓' : '↑') : ''}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
                                        No data found. Try different filters.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((row, i) => {
                                    const spread = getPriceChange(row.min_price, row.max_price);
                                    const isHigh = parseFloat(row.modal_price) > parseFloat(avgPrice);
                                    return (
                                        <tr key={i}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ fontSize: '18px' }}>
                                                        {row.commodity === 'Wheat' ? '🌾' : row.commodity === 'Rice' ? '🍚' :
                                                            row.commodity === 'Tomato' ? '🍅' : row.commodity === 'Onion' ? '🧅' :
                                                                row.commodity === 'Potato' ? '🥔' : row.commodity === 'Cotton' ? '🌿' :
                                                                    row.commodity === 'Chilli' ? '🌶️' : '🌱'}
                                                    </span>
                                                    <strong style={{ color: '#f0fdf4' }}>{row.commodity}</strong>
                                                </div>
                                            </td>
                                            <td style={{ color: '#9ca3af' }}>{row.variety || '-'}</td>
                                            <td>{row.market || row.district || '-'}</td>
                                            <td style={{ color: '#9ca3af' }}>{row.state}</td>
                                            <td style={{ color: '#60a5fa' }}>₹{parseInt(row.min_price).toLocaleString('en-IN')}</td>
                                            <td style={{ color: '#f87171' }}>₹{parseInt(row.max_price).toLocaleString('en-IN')}</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    {isHigh
                                                        ? <TrendingUp size={14} color="#4ade80" />
                                                        : <TrendingDown size={14} color="#f87171" />}
                                                    <strong style={{ color: isHigh ? '#4ade80' : '#f87171' }}>
                                                        ₹{parseInt(row.modal_price).toLocaleString('en-IN')}
                                                    </strong>
                                                </div>
                                            </td>
                                            <td style={{ color: '#6b7280', fontSize: '12px' }}>{row.arrival_date}</td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '12px', color: '#6b7280' }}>
                    Showing {filtered.length} of {data.length} records • Data from data.gov.in
                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
