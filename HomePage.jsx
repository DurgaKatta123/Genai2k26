import { MessageSquare, Leaf, Cloud, BarChart3, BookOpen, Sprout, ArrowRight, Sun, Droplets, TrendingUp } from 'lucide-react';

const FEATURES = [
    {
        icon: <MessageSquare size={28} />,
        labelEn: 'Krishi Helpline', labelHi: 'कृषि हेल्पलाइन', labelTe: 'వ్యవసాయ హెల్ప్‌లైన్',
        descEn: 'Ask any farming question. Get expert advice instantly.',
        descHi: 'कोई भी खेती का सवाल पूछें। तुरंत विशेषज्ञ सलाह पाएं।',
        descTe: 'ఏదైనా వ్యవసాయ ప్రశ్న అడగండి. వెంటనే నిపుణుల సలహా పొందండి.',
        color: '#16a34a', gradient: 'linear-gradient(135deg, #16a34a, #15803d)', page: 'chat', emoji: '💬',
    },
    {
        icon: <Leaf size={28} />,
        labelEn: 'Crop Health Check', labelHi: 'फसल स्वास्थ्य जांच', labelTe: 'పంట ఆరోగ్య తనిఖీ',
        descEn: 'Upload a photo of your crop. Get instant disease diagnosis.',
        descHi: 'फसल की फोटो अपलोड करें। तुरंत रोग की पहचान पाएं।',
        descTe: 'మీ పంట ఫోటో అప్‌లోడ్ చేయండి. వెంటనే వ్యాధి నిర్ధారణ పొందండి.',
        color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', page: 'scan', emoji: '🔍',
    },
    {
        icon: <Cloud size={28} />,
        labelEn: 'Weather Forecast', labelHi: 'मौसम जानकारी', labelTe: 'వాతావరణ సమాచారం',
        descEn: 'Check today\'s weather and plan your farming activities.',
        descHi: 'आज का मौसम देखें और खेती की योजना बनाएं।',
        descTe: 'నేటి వాతావరణం చూసి మీ వ్యవసాయ కార్యకలాపాలు ప్లాన్ చేయండి.',
        color: '#60a5fa', gradient: 'linear-gradient(135deg, #60a5fa, #3b82f6)', page: 'weather', emoji: '🌤️',
    },
    {
        icon: <BarChart3 size={28} />,
        labelEn: 'Mandi Prices', labelHi: 'मंडी भाव', labelTe: 'మండి ధరలు',
        descEn: 'Check today\'s crop prices in your nearest mandi.',
        descHi: 'अपनी नजदीकी मंडी में आज के फसल के भाव देखें।',
        descTe: 'మీ సమీప మండిలో నేటి పంట ధరలు తనిఖీ చేయండి.',
        color: '#a78bfa', gradient: 'linear-gradient(135deg, #a78bfa, #7c3aed)', page: 'market', emoji: '📊',
    },
    {
        icon: <BookOpen size={28} />,
        labelEn: 'Government Help', labelHi: 'सरकारी मदद', labelTe: 'ప్రభుత్వ సహాయం',
        descEn: 'Find government schemes and subsidies for farmers.',
        descHi: 'किसानों के लिए सरकारी योजनाएं और सब्सिडी खोजें।',
        descTe: 'రైతులకు ప్రభుత్వ పథకాలు మరియు సబ్సిడీలు కనుగొనండి.',
        color: '#f87171', gradient: 'linear-gradient(135deg, #f87171, #ef4444)', page: 'schemes', emoji: '🏛️',
    },
];

const TIPS = {
    en: [
        { icon: '🌱', title: 'Sowing Season', tip: 'Kharif crops: June-July. Rabi crops: Oct-Nov. Plan ahead!' },
        { icon: '💧', title: 'Water Management', tip: 'Drip irrigation saves 40-60% water. Apply for PM Krishi Sinchai subsidy.' },
        { icon: '🐛', title: 'Pest Alert', tip: 'Early morning inspection helps detect pests before they spread.' },
        { icon: '💰', title: 'PM-KISAN', tip: 'Next installment due soon. Check your status at pmkisan.gov.in' },
    ],
    hi: [
        { icon: '🌱', title: 'बुवाई का मौसम', tip: 'खरीफ फसलें: जून-जुलाई। रबी फसलें: अक्टूबर-नवंबर। पहले से योजना बनाएं!' },
        { icon: '💧', title: 'जल प्रबंधन', tip: 'ड्रिप सिंचाई 40-60% पानी बचाती है। पीएम कृषि सिंचाई सब्सिडी के लिए आवेदन करें।' },
        { icon: '🐛', title: 'कीट चेतावनी', tip: 'सुबह जल्दी निरीक्षण से कीटों को फैलने से पहले पकड़ा जा सकता है।' },
        { icon: '💰', title: 'पीएम-किसान', tip: 'अगली किस्त जल्द आने वाली है। pmkisan.gov.in पर अपनी स्थिति जांचें।' },
    ],
    te: [
        { icon: '🌱', title: 'విత్తన కాలం', tip: 'ఖరీఫ్ పంటలు: జూన్-జులై. రబీ పంటలు: అక్టోబర్-నవంబర్. ముందుగా ప్లాన్ చేయండి!' },
        { icon: '💧', title: 'నీటి నిర్వహణ', tip: 'డ్రిప్ నీటిపారుదల 40-60% నీటిని ఆదా చేస్తుంది. పీఎం కృషి సించాయ్ సబ్సిడీకి దరఖాస్తు చేయండి.' },
        { icon: '🐛', title: 'తెగులు హెచ్చరిక', tip: 'తెల్లవారుజామున తనిఖీ చేయడం వల్ల తెగుళ్ళు వ్యాపించే ముందే గుర్తించవచ్చు.' },
        { icon: '💰', title: 'పీఎం-కిసాన్', tip: 'తదుపరి వాయిదా త్వరలో వస్తుంది. pmkisan.gov.in లో మీ స్థితి తనిఖీ చేయండి.' },
    ],
};

export default function HomePage({ onNavigate, language, user }) {
    const tips = TIPS[language] || TIPS.en;

    const greet = () => {
        const hour = new Date().getHours();
        if (language === 'hi') {
            if (hour < 12) return 'सुप्रभात';
            if (hour < 17) return 'नमस्ते';
            return 'शुभ संध्या';
        }
        if (language === 'te') {
            if (hour < 12) return 'శుభోదయం';
            if (hour < 17) return 'నమస్కారం';
            return 'శుభ సాయంత్రం';
        }
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const openLabel = { en: 'Open', hi: 'खोलें', te: 'తెరవండి' };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Welcome Banner */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(22,163,74,0.2) 0%, rgba(245,158,11,0.1) 100%)',
                border: '1px solid rgba(74,222,128,0.2)',
                borderRadius: '20px', padding: '28px 32px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: '16px',
            }}>
                <div>
                    <div style={{ fontSize: '14px', color: '#4ade80', fontWeight: '600', marginBottom: '6px' }}>
                        🌾 {greet()}, {user?.name || 'Farmer'}!
                    </div>
                    <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#f0fdf4', marginBottom: '8px', lineHeight: '1.2' }}>
                        {language === 'hi' ? 'आपका KrishiSahay तैयार है' : language === 'te' ? 'మీ KrishiSahay సిద్ధంగా ఉంది' : 'Your KrishiSahay is Ready'}
                    </h2>
                    <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                        {language === 'hi' ? 'नीचे से कोई भी सुविधा चुनें और शुरू करें।' : language === 'te' ? 'క్రింద ఏదైనా సేవ ఎంచుకుని ప్రారంభించండి.' : 'Choose any service below and get started.'}
                    </p>
                </div>
                <div style={{ fontSize: '72px', lineHeight: 1 }}>🌾</div>
            </div>

            {/* Features Grid - All on right panel */}
            <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#9ca3af', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {language === 'hi' ? '🚀 सभी सेवाएं' : language === 'te' ? '🚀 అన్ని సేవలు' : '🚀 All Services'}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                    {FEATURES.map((f, i) => (
                        <div
                            key={i}
                            className="glass-card"
                            onClick={() => onNavigate(f.page)}
                            style={{
                                padding: '24px', cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                borderLeft: `3px solid ${f.color}`,
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = `0 20px 40px ${f.color}20`;
                                e.currentTarget.style.borderColor = f.color;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                <div style={{
                                    width: '56px', height: '56px', borderRadius: '16px',
                                    background: f.gradient,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white', flexShrink: 0,
                                    fontSize: '28px',
                                }}>
                                    {f.emoji}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f0fdf4', marginBottom: '6px' }}>
                                        {language === 'hi' ? f.labelHi : language === 'te' ? f.labelTe : f.labelEn}
                                    </h3>
                                    <p style={{ fontSize: '13px', color: '#9ca3af', lineHeight: '1.5', marginBottom: '12px' }}>
                                        {language === 'hi' ? f.descHi : language === 'te' ? f.descTe : f.descEn}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: f.color, fontSize: '13px', fontWeight: '600' }}>
                                        {openLabel[language] || openLabel.en} <ArrowRight size={14} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Farming Tips */}
            <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#9ca3af', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {language === 'hi' ? '💡 आज की कृषि सलाह' : language === 'te' ? '💡 నేటి వ్యవసాయ సలహాలు' : '💡 Today\'s Farming Tips'}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                    {tips.map((tip, i) => (
                        <div key={i} className="glass-card" style={{ padding: '16px' }}>
                            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{tip.icon}</div>
                            <div style={{ fontSize: '13px', fontWeight: '700', color: '#4ade80', marginBottom: '6px' }}>{tip.title}</div>
                            <p style={{ fontSize: '12px', color: '#9ca3af', lineHeight: '1.6' }}>{tip.tip}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Action CTA */}
            <div style={{
                background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(74,222,128,0.2)',
                borderRadius: '16px', padding: '20px 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
            }}>
                <div>
                    <p style={{ fontSize: '15px', fontWeight: '700', color: '#f0fdf4', marginBottom: '4px' }}>
                        {language === 'hi' ? '🤔 कोई समस्या है?' : language === 'te' ? '🤔 ఏదైనా సమస్య ఉందా?' : '🤔 Have a farming problem?'}
                    </p>
                    <p style={{ fontSize: '13px', color: '#9ca3af' }}>
                        {language === 'hi' ? 'कृषि हेल्पलाइन में तुरंत जवाब पाएं' : language === 'te' ? 'వ్యవసాయ హెల్ప్‌లైన్‌లో వెంటనే సమాధానం పొందండి' : 'Get instant answers in Krishi Helpline'}
                    </p>
                </div>
                <button className="btn-primary" onClick={() => onNavigate('chat')} style={{ padding: '12px 24px' }}>
                    <MessageSquare size={18} />
                    {language === 'hi' ? 'अभी पूछें' : language === 'te' ? 'ఇప్పుడు అడగండి' : 'Ask Now'}
                    <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}
