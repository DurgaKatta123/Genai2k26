import { useState, useRef } from 'react';
import { Upload, X, Leaf, AlertTriangle, CheckCircle, Camera } from 'lucide-react';
import { analyzeImageWithGemini, fileToBase64 } from '../services/api';

function MarkdownText({ text }) {
    const formatted = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/^### (.*$)/gm, '<h3 style="color:#4ade80;font-size:14px;margin:12px 0 6px">$1</h3>')
        .replace(/^## (.*$)/gm, '<h2 style="color:#f0fdf4;font-size:16px;margin:14px 0 8px">$1</h2>')
        .replace(/^# (.*$)/gm, '<h1 style="color:#f0fdf4;font-size:18px;margin:16px 0 10px">$1</h1>')
        .replace(/^\* (.*$)/gm, '<li style="margin:4px 0;color:#d1fae5">$1</li>')
        .replace(/^- (.*$)/gm, '<li style="margin:4px 0;color:#d1fae5">$1</li>')
        .replace(/\n/g, '<br/>');
    return <div className="markdown-content" dangerouslySetInnerHTML={{ __html: formatted }} />;
}

const LABELS = {
    en: {
        title: 'Crop Health Check',
        subtitle: 'Upload a photo of your crop to detect diseases',
        dragText: 'Drag & drop your crop photo here',
        orText: 'or',
        browseText: 'Browse Photo',
        tips: 'Tips for best results:',
        tipsList: ['Take photo in daylight', 'Focus on affected area', 'Include leaves and stems', 'Avoid blurry images'],
        analyzeBtn: 'Check My Crop',
        analyzing: 'Analyzing your crop...',
        analysisResult: 'Diagnosis Result',
        reset: 'Check Another Crop',
        errorLabel: 'Analysis failed',
    },
    hi: {
        title: 'फसल स्वास्थ्य जांच',
        subtitle: 'रोग पहचानने के लिए फसल की फोटो अपलोड करें',
        dragText: 'यहां फसल की फोटो खींचें और छोड़ें',
        orText: 'या',
        browseText: 'फोटो चुनें',
        tips: 'बेहतर परिणाम के लिए:',
        tipsList: ['दिन की रोशनी में फोटो लें', 'प्रभावित हिस्से पर फोकस करें', 'पत्तियां और तना शामिल करें', 'धुंधली फोटो से बचें'],
        analyzeBtn: 'मेरी फसल जांचें',
        analyzing: 'फसल का विश्लेषण हो रहा है...',
        analysisResult: 'जांच परिणाम',
        reset: 'दूसरी फसल जांचें',
        errorLabel: 'विश्लेषण विफल',
    },
    te: {
        title: 'పంట ఆరోగ్య తనిఖీ',
        subtitle: 'వ్యాధులు గుర్తించడానికి మీ పంట ఫోటో అప్‌లోడ్ చేయండి',
        dragText: 'ఇక్కడ మీ పంట ఫోటో లాగి వదలండి',
        orText: 'లేదా',
        browseText: 'ఫోటో ఎంచుకోండి',
        tips: 'మంచి ఫలితాల కోసం:',
        tipsList: ['పగటి వెలుతురులో ఫోటో తీయండి', 'ప్రభావిత ప్రాంతంపై దృష్టి పెట్టండి', 'ఆకులు మరియు కాండాలు చేర్చండి', 'మసకబారిన చిత్రాలు నివారించండి'],
        analyzeBtn: 'నా పంట తనిఖీ చేయండి',
        analyzing: 'మీ పంటను విశ్లేషిస్తున్నాం...',
        analysisResult: 'నిర్ధారణ ఫలితం',
        reset: 'మరొక పంట తనిఖీ చేయండి',
        errorLabel: 'విశ్లేషణ విఫలమైంది',
    },
};

export default function ImageAnalyzer({ language }) {
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dragging, setDragging] = useState(false);
    const fileRef = useRef();

    const L = LABELS[language] || LABELS.en;

    const handleFile = (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        setImageFile(file);
        setResult(null);
        setError(null);
        const reader = new FileReader();
        reader.onload = e => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
    };

    const analyzeImage = async () => {
        if (!imageFile) return;
        setLoading(true);
        setError(null);
        try {
            const base64 = await fileToBase64(imageFile);
            const analysis = await analyzeImageWithGemini(base64, imageFile.type);
            setResult(analysis);
        } catch (err) {
            setError(`${L.errorLabel}: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setImageFile(null);
        setImagePreview(null);
        setResult(null);
        setError(null);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <Leaf size={22} color="white" />
                </div>
                <div>
                    <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f0fdf4' }}>{L.title}</h2>
                    <p style={{ fontSize: '12px', color: '#f59e0b' }}>{L.subtitle}</p>
                </div>
            </div>

            {!result ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {/* Upload Area */}
                    <div>
                        {!imagePreview ? (
                            <div
                                className="glass-card"
                                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
                                onClick={() => fileRef.current?.click()}
                                style={{
                                    padding: '48px 24px', textAlign: 'center', cursor: 'pointer',
                                    border: `2px dashed ${dragging ? '#f59e0b' : 'rgba(245,158,11,0.3)'}`,
                                    background: dragging ? 'rgba(245,158,11,0.05)' : 'rgba(255,255,255,0.02)',
                                    transition: 'all 0.3s',
                                    minHeight: '280px', display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center', gap: '16px',
                                }}
                            >
                                <div style={{
                                    width: '72px', height: '72px', borderRadius: '20px',
                                    background: 'rgba(245,158,11,0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Upload size={32} color="#f59e0b" />
                                </div>
                                <div>
                                    <p style={{ color: '#f0fdf4', fontWeight: '600', marginBottom: '6px' }}>{L.dragText}</p>
                                    <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '16px' }}>{L.orText}</p>
                                    <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                                        <Camera size={16} /> {L.browseText}
                                    </button>
                                </div>
                                <p style={{ color: '#6b7280', fontSize: '11px' }}>JPG, PNG, WEBP</p>
                                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                                    onChange={e => handleFile(e.target.files[0])} />
                            </div>
                        ) : (
                            <div className="glass-card" style={{ padding: '16px' }}>
                                <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
                                    <img src={imagePreview} alt="Crop" style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }} />
                                    <button onClick={reset} style={{
                                        position: 'absolute', top: '8px', right: '8px',
                                        background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%',
                                        width: '32px', height: '32px', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <X size={16} color="white" />
                                    </button>
                                    <div style={{
                                        position: 'absolute', bottom: '8px', left: '8px',
                                        background: 'rgba(0,0,0,0.7)', borderRadius: '8px', padding: '4px 10px',
                                        fontSize: '11px', color: 'white',
                                    }}>
                                        📷 {imageFile?.name}
                                    </div>
                                </div>

                                {error && (
                                    <div style={{
                                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                                        borderRadius: '10px', padding: '12px', marginBottom: '12px',
                                        display: 'flex', gap: '8px', alignItems: 'flex-start',
                                    }}>
                                        <AlertTriangle size={16} color="#f87171" style={{ flexShrink: 0 }} />
                                        <p style={{ color: '#f87171', fontSize: '13px' }}>{error}</p>
                                    </div>
                                )}

                                <button
                                    className="btn-primary"
                                    onClick={analyzeImage}
                                    disabled={loading}
                                    style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                                >
                                    {loading ? (
                                        <>
                                            <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                            {L.analyzing}
                                        </>
                                    ) : (
                                        <><Leaf size={18} /> {L.analyzeBtn}</>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Tips Panel */}
                    <div className="glass-card" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f0fdf4', marginBottom: '16px' }}>
                            📸 {L.tips}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                            {L.tipsList.map((tip, i) => (
                                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                    <CheckCircle size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                                    <span style={{ fontSize: '13px', color: '#d1fae5' }}>{tip}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                            <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.6' }}>
                                {language === 'hi'
                                    ? '🌿 हमारा AI विशेषज्ञ 50+ फसल रोगों की पहचान कर सकता है और उपचार की सलाह दे सकता है।'
                                    : language === 'te'
                                        ? '🌿 మా AI నిపుణుడు 50+ పంట వ్యాధులను గుర్తించి చికిత్స సలహా ఇవ్వగలడు.'
                                        : '🌿 Our expert can identify 50+ crop diseases and provide treatment recommendations.'}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                /* Results */
                <div className="glass-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <CheckCircle size={20} color="#4ade80" />
                            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f0fdf4' }}>{L.analysisResult}</h3>
                        </div>
                        <button className="btn-secondary" onClick={reset} style={{ padding: '8px 16px', fontSize: '13px' }}>
                            {L.reset}
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '20px' }}>
                        {imagePreview && (
                            <img src={imagePreview} alt="Analyzed crop" style={{
                                width: '100%', height: '160px', objectFit: 'cover',
                                borderRadius: '12px', flexShrink: 0,
                            }} />
                        )}
                        <div style={{ overflowY: 'auto', maxHeight: '400px' }}>
                            <MarkdownText text={result} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
