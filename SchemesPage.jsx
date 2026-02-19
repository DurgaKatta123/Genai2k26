import { useState } from 'react';
import { ExternalLink, CheckCircle, Info, Search } from 'lucide-react';
import { STATIC_SCHEMES } from '../services/api';

const CATEGORIES = {
    en: ['All', 'Income Support', 'Crop Insurance', 'Credit', 'Irrigation', 'Organic Farming', 'Market Access', 'Soil Health', 'Development'],
    hi: ['सभी', 'आय सहायता', 'फसल बीमा', 'ऋण', 'सिंचाई', 'जैविक खेती', 'बाजार पहुंच', 'मिट्टी स्वास्थ्य', 'विकास'],
    te: ['అన్నీ', 'ఆదాయ మద్దతు', 'పంట బీమా', 'రుణం', 'నీటిపారుదల', 'సేంద్రీయ వ్యవసాయం', 'మార్కెట్ యాక్సెస్', 'నేల ఆరోగ్యం', 'అభివృద్ధి'],
};

const CAT_MAP = {
    'సభీ': 'All', 'సభ్యులు': 'All', 'అన్నీ': 'All',
    'ఆదాయ మద్దతు': 'Income Support', 'పంట బీమా': 'Crop Insurance',
    'రుణం': 'Credit', 'నీటిపారుదల': 'Irrigation',
    'సేంద్రీయ వ్యవసాయం': 'Organic Farming', 'మార్కెట్ యాక్సెస్': 'Market Access',
    'నేల ఆరోగ్యం': 'Soil Health', 'అభివృద్ధి': 'Development',
    'सभी': 'All', 'आय सहायता': 'Income Support', 'फसल बीमा': 'Crop Insurance',
    'ऋण': 'Credit', 'सिंचाई': 'Irrigation', 'जैविक खेती': 'Organic Farming',
    'बाजार पहुंच': 'Market Access', 'मिट्टी स्वास्थ्य': 'Soil Health', 'विकास': 'Development',
};

function getSchemeTitle(scheme, lang) {
    if (lang === 'hi') return scheme.nameHi;
    if (lang === 'te') return scheme.nameTe;
    return scheme.name;
}

function getSchemeDesc(scheme, lang) {
    if (lang === 'hi') return scheme.descHi;
    if (lang === 'te') return scheme.descTe;
    return scheme.desc;
}

export default function SchemesPage({ language }) {
    const [selectedCat, setSelectedCat] = useState('All');
    const [search, setSearch] = useState('');

    const cats = CATEGORIES[language] || CATEGORIES.en;

    const filtered = STATIC_SCHEMES.filter(s => {
        const catMatch = selectedCat === 'All' || CAT_MAP[selectedCat] === s.category || selectedCat === s.category;
        const searchMatch = !search ||
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            (s.nameHi && s.nameHi.includes(search)) ||
            (s.nameTe && s.nameTe.includes(search)) ||
            s.category.toLowerCase().includes(search.toLowerCase());
        return catMatch && searchMatch;
    });

    const headerText = {
        en: 'Government Help & Schemes',
        hi: 'सरकारी मदद और योजनाएं',
        te: 'ప్రభుత్వ సహాయం మరియు పథకాలు',
    };

    const subText = {
        en: `${STATIC_SCHEMES.length} schemes available for farmers`,
        hi: `किसानों के लिए ${STATIC_SCHEMES.length} योजनाएं उपलब्ध`,
        te: `రైతులకు ${STATIC_SCHEMES.length} పథకాలు అందుబాటులో ఉన్నాయి`,
    };

    const searchPlaceholder = {
        en: 'Search schemes...',
        hi: 'योजना खोजें...',
        te: 'పథకాలు వెతకండి...',
    };

    const eligibilityLabel = {
        en: 'Who can apply?',
        hi: 'कौन आवेदन कर सकता है?',
        te: 'ఎవరు దరఖాస్తు చేయవచ్చు?',
    };

    const visitLabel = {
        en: 'Visit Official Website',
        hi: 'आधिकारिक वेबसाइट देखें',
        te: 'అధికారిక వెబ్‌సైట్ సందర్శించండి',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #f87171, #ef4444)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
                }}>🏛️</div>
                <div>
                    <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f0fdf4' }}>
                        {headerText[language] || headerText.en}
                    </h2>
                    <span style={{ fontSize: '12px', color: '#f87171' }}>
                        {subText[language] || subText.en}
                    </span>
                </div>
            </div>

            {/* Info Alert */}
            <div style={{
                background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
                borderRadius: '12px', padding: '12px 16px',
                display: 'flex', alignItems: 'flex-start', gap: '10px',
            }}>
                <Info size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '13px', color: '#fde68a', lineHeight: '1.5' }}>
                    {language === 'hi'
                        ? 'किसी भी योजना के बारे में विस्तृत जानकारी के लिए "कृषि हेल्पलाइन" में पूछें।'
                        : language === 'te'
                            ? 'ఏదైనా పథకం గురించి వివరణాత్మక సమాచారం కోసం "వ్యవసాయ హెల్ప్‌లైన్"లో అడగండి.'
                            : 'For detailed information about any scheme, ask in "Krishi Helpline" chat.'}
                </p>
            </div>

            {/* Search */}
            <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                <input
                    className="input-field"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder={searchPlaceholder[language] || searchPlaceholder.en}
                    style={{ paddingLeft: '40px' }}
                />
            </div>

            {/* Category Tabs */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {cats.map((cat, i) => {
                    const isActive = selectedCat === cat || (cat === 'All' && selectedCat === 'All') ||
                        (cat === 'सभी' && selectedCat === 'All') || (cat === 'అన్నీ' && selectedCat === 'All');
                    return (
                        <button
                            key={i}
                            onClick={() => setSelectedCat(cat === 'All' || cat === 'सभी' || cat === 'అన్నీ' ? 'All' : cat)}
                            style={{
                                background: isActive ? 'rgba(248,113,113,0.2)' : 'rgba(255,255,255,0.05)',
                                border: `1px solid ${isActive ? '#f87171' : 'rgba(255,255,255,0.1)'}`,
                                borderRadius: '20px', padding: '6px 14px',
                                fontSize: '12px', color: isActive ? '#f87171' : '#9ca3af',
                                cursor: 'pointer', transition: 'all 0.2s',
                            }}
                        >
                            {cat}
                        </button>
                    );
                })}
            </div>

            {/* Schemes Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {filtered.map((scheme, i) => (
                    <div key={i} className="glass-card glass-card-hover" style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                    width: '44px', height: '44px', borderRadius: '12px',
                                    background: `${scheme.color}20`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '22px', flexShrink: 0,
                                }}>
                                    {scheme.icon}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#f0fdf4', lineHeight: '1.3' }}>
                                        {getSchemeTitle(scheme, language)}
                                    </h3>
                                    <span style={{
                                        display: 'inline-block', background: `${scheme.color}20`, color: scheme.color,
                                        borderRadius: '20px', padding: '2px 8px', fontSize: '11px', fontWeight: '600', marginTop: '4px',
                                    }}>
                                        {scheme.category}
                                    </span>
                                </div>
                            </div>
                            <div style={{
                                background: 'rgba(74,222,128,0.1)', color: '#4ade80',
                                borderRadius: '8px', padding: '4px 10px', fontSize: '12px',
                                fontWeight: '700', whiteSpace: 'nowrap', flexShrink: 0,
                            }}>
                                {scheme.amount}
                            </div>
                        </div>

                        <p style={{ fontSize: '13px', color: '#9ca3af', lineHeight: '1.6', marginBottom: '12px' }}>
                            {getSchemeDesc(scheme, language)}
                        </p>

                        <div style={{
                            background: 'rgba(74,222,128,0.05)', borderRadius: '8px',
                            padding: '10px 12px', marginBottom: '12px',
                        }}>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                                <CheckCircle size={14} color="#4ade80" style={{ flexShrink: 0, marginTop: '2px' }} />
                                <div>
                                    <span style={{ fontSize: '11px', color: '#4ade80', fontWeight: '600', display: 'block', marginBottom: '2px' }}>
                                        {eligibilityLabel[language] || eligibilityLabel.en}
                                    </span>
                                    <span style={{ fontSize: '12px', color: '#d1fae5' }}>{scheme.eligibility}</span>
                                </div>
                            </div>
                        </div>

                        <a
                            href={scheme.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                color: scheme.color, fontSize: '13px', fontWeight: '600',
                                textDecoration: 'none',
                            }}
                        >
                            <ExternalLink size={14} />
                            {visitLabel[language] || visitLabel.en}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
