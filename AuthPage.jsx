import { useState } from 'react';
import { User, Lock, Phone, MapPin, Eye, EyeOff, Sprout, ArrowRight, CheckCircle } from 'lucide-react';

const STATES_LIST = ['Andhra Pradesh', 'Telangana', 'Karnataka', 'Maharashtra', 'Madhya Pradesh', 'Uttar Pradesh', 'Punjab', 'Haryana', 'Rajasthan', 'Gujarat', 'Bihar', 'West Bengal', 'Tamil Nadu', 'Kerala', 'Odisha', 'Jharkhand', 'Chhattisgarh', 'Assam'];

export default function AuthPage({ onLogin, language }) {
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [form, setForm] = useState({
        name: '', phone: '', state: '', village: '',
        password: '', confirmPassword: '',
    });

    const t = {
        en: {
            welcome: 'Welcome to KrishiSahay',
            subtitle: 'Your trusted farming companion',
            login: 'Login',
            register: 'Register',
            name: 'Full Name',
            phone: 'Mobile Number',
            state: 'Select State',
            village: 'Village / District',
            password: 'Password',
            confirmPassword: 'Confirm Password',
            loginBtn: 'Login to KrishiSahay',
            registerBtn: 'Create Account',
            noAccount: "Don't have an account?",
            hasAccount: 'Already have an account?',
            namePlaceholder: 'Enter your name',
            phonePlaceholder: '10-digit mobile number',
            villagePlaceholder: 'Your village or district',
            passwordPlaceholder: 'Enter password',
            confirmPlaceholder: 'Confirm your password',
            guestLogin: 'Continue as Guest',
            features: ['Free crop disease detection', 'Live market prices', 'Govt scheme guidance', 'Weather forecasts'],
        },
        hi: {
            welcome: 'KrishiSahay में आपका स्वागत है',
            subtitle: 'आपका विश्वसनीय कृषि साथी',
            login: 'लॉगिन',
            register: 'पंजीकरण',
            name: 'पूरा नाम',
            phone: 'मोबाइल नंबर',
            state: 'राज्य चुनें',
            village: 'गांव / जिला',
            password: 'पासवर्ड',
            confirmPassword: 'पासवर्ड की पुष्टि करें',
            loginBtn: 'KrishiSahay में लॉगिन करें',
            registerBtn: 'खाता बनाएं',
            noAccount: 'खाता नहीं है?',
            hasAccount: 'पहले से खाता है?',
            namePlaceholder: 'अपना नाम दर्ज करें',
            phonePlaceholder: '10 अंकों का मोबाइल नंबर',
            villagePlaceholder: 'आपका गांव या जिला',
            passwordPlaceholder: 'पासवर्ड दर्ज करें',
            confirmPlaceholder: 'पासवर्ड की पुष्टि करें',
            guestLogin: 'अतिथि के रूप में जारी रखें',
            features: ['मुफ्त फसल रोग पहचान', 'लाइव बाजार भाव', 'सरकारी योजना मार्गदर्शन', 'मौसम पूर्वानुमान'],
        },
        te: {
            welcome: 'KrishiSahay కి స్వాగతం',
            subtitle: 'మీ నమ్మకమైన వ్యవసాయ సహాయకుడు',
            login: 'లాగిన్',
            register: 'నమోదు',
            name: 'పూర్తి పేరు',
            phone: 'మొబైల్ నంబర్',
            state: 'రాష్ట్రం ఎంచుకోండి',
            village: 'గ్రామం / జిల్లా',
            password: 'పాస్‌వర్డ్',
            confirmPassword: 'పాస్‌వర్డ్ నిర్ధారించండి',
            loginBtn: 'KrishiSahay లో లాగిన్ చేయండి',
            registerBtn: 'ఖాతా సృష్టించండి',
            noAccount: 'ఖాతా లేదా?',
            hasAccount: 'ఇప్పటికే ఖాతా ఉందా?',
            namePlaceholder: 'మీ పేరు నమోదు చేయండి',
            phonePlaceholder: '10 అంకెల మొబైల్ నంబర్',
            villagePlaceholder: 'మీ గ్రామం లేదా జిల్లా',
            passwordPlaceholder: 'పాస్‌వర్డ్ నమోదు చేయండి',
            confirmPlaceholder: 'పాస్‌వర్డ్ నిర్ధారించండి',
            guestLogin: 'అతిథిగా కొనసాగండి',
            features: ['ఉచిత పంట వ్యాధి గుర్తింపు', 'లైవ్ మార్కెట్ ధరలు', 'ప్రభుత్వ పథకాల మార్గదర్శకత్వం', 'వాతావరణ అంచనాలు'],
        },
    };

    const tx = t[language] || t.en;

    const update = (field, val) => setForm(f => ({ ...f, [field]: val }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (mode === 'register') {
            if (!form.name || !form.phone || !form.state || !form.password) {
                setError('Please fill all required fields');
                setLoading(false);
                return;
            }
            if (form.phone.length !== 10 || !/^\d+$/.test(form.phone)) {
                setError('Please enter a valid 10-digit mobile number');
                setLoading(false);
                return;
            }
            if (form.password !== form.confirmPassword) {
                setError('Passwords do not match');
                setLoading(false);
                return;
            }
            if (form.password.length < 6) {
                setError('Password must be at least 6 characters');
                setLoading(false);
                return;
            }
            // Save to localStorage
            const users = JSON.parse(localStorage.getItem('ks_users') || '[]');
            if (users.find(u => u.phone === form.phone)) {
                setError('This mobile number is already registered');
                setLoading(false);
                return;
            }
            users.push({ name: form.name, phone: form.phone, state: form.state, village: form.village, password: form.password });
            localStorage.setItem('ks_users', JSON.stringify(users));
            setSuccess('Account created! Logging you in...');
            setTimeout(() => {
                onLogin({ name: form.name, phone: form.phone, state: form.state, village: form.village });
            }, 1200);
        } else {
            if (!form.phone || !form.password) {
                setError('Please enter mobile number and password');
                setLoading(false);
                return;
            }
            const users = JSON.parse(localStorage.getItem('ks_users') || '[]');
            const user = users.find(u => u.phone === form.phone && u.password === form.password);
            if (!user) {
                setError('Invalid mobile number or password');
                setLoading(false);
                return;
            }
            onLogin(user);
        }
        setLoading(false);
    };

    const guestLogin = () => {
        onLogin({ name: 'Guest Farmer', phone: '', state: '', village: '', isGuest: true });
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px', position: 'relative',
        }}>
            <div className="animated-bg" />

            <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                maxWidth: '900px', width: '100%', gap: '0',
                borderRadius: '24px', overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
            }}>
                {/* Left Panel - Branding */}
                <div style={{
                    background: 'linear-gradient(135deg, #0d2818 0%, #1a4a2e 50%, #0d2818 100%)',
                    padding: '48px 40px',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    position: 'relative', overflow: 'hidden',
                }}>
                    <div style={{
                        position: 'absolute', top: '-60px', right: '-60px',
                        width: '200px', height: '200px',
                        background: 'radial-gradient(circle, rgba(74,222,128,0.15) 0%, transparent 70%)',
                    }} />
                    <div style={{
                        position: 'absolute', bottom: '-40px', left: '-40px',
                        width: '160px', height: '160px',
                        background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)',
                    }} />

                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '14px',
                                background: 'linear-gradient(135deg, #16a34a, #15803d)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Sprout size={24} color="white" />
                            </div>
                            <div>
                                <div style={{ fontSize: '20px', fontWeight: '800', color: '#f0fdf4' }}>KrishiSahay</div>
                                <div style={{ fontSize: '11px', color: '#4ade80' }}>कृषि सहाय • వ్యవసాయ సహాయం</div>
                            </div>
                        </div>

                        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#f0fdf4', lineHeight: '1.3', marginBottom: '12px' }}>
                            {tx.welcome}
                        </h2>
                        <p style={{ color: '#86efac', fontSize: '15px', marginBottom: '32px' }}>{tx.subtitle}</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {tx.features.map((f, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <CheckCircle size={16} color="#4ade80" />
                                    <span style={{ color: '#d1fae5', fontSize: '14px' }}>{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: '32px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '8px' }}>🌾</div>
                        <p style={{ color: '#6b7280', fontSize: '12px', fontStyle: 'italic' }}>
                            "Empowering every farmer with knowledge"
                        </p>
                    </div>
                </div>

                {/* Right Panel - Form */}
                <div style={{ background: '#0f1a0f', padding: '48px 40px' }}>
                    {/* Tabs */}
                    <div style={{
                        display: 'flex', background: 'rgba(255,255,255,0.05)',
                        borderRadius: '12px', padding: '4px', marginBottom: '28px',
                    }}>
                        {['login', 'register'].map(m => (
                            <button
                                key={m}
                                onClick={() => { setMode(m); setError(''); setSuccess(''); }}
                                style={{
                                    flex: 1, padding: '10px',
                                    background: mode === m ? 'linear-gradient(135deg, #16a34a, #15803d)' : 'transparent',
                                    border: 'none', borderRadius: '10px',
                                    color: mode === m ? 'white' : '#9ca3af',
                                    fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                                    transition: 'all 0.3s',
                                }}
                            >
                                {m === 'login' ? tx.login : tx.register}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {mode === 'register' && (
                            <>
                                <div>
                                    <label style={{ fontSize: '13px', color: '#86efac', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                                        {tx.name} *
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                                        <input className="input-field" value={form.name} onChange={e => update('name', e.target.value)}
                                            placeholder={tx.namePlaceholder} style={{ paddingLeft: '36px' }} />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <label style={{ fontSize: '13px', color: '#86efac', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                                            {tx.state} *
                                        </label>
                                        <select className="input-field" value={form.state} onChange={e => update('state', e.target.value)}
                                            style={{ cursor: 'pointer' }}>
                                            <option value="">{tx.state}</option>
                                            {STATES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '13px', color: '#86efac', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                                            {tx.village}
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                                            <input className="input-field" value={form.village} onChange={e => update('village', e.target.value)}
                                                placeholder={tx.villagePlaceholder} style={{ paddingLeft: '36px' }} />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        <div>
                            <label style={{ fontSize: '13px', color: '#86efac', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                                {tx.phone} *
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                                <span style={{ position: 'absolute', left: '36px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontSize: '14px' }}>+91</span>
                                <input className="input-field" value={form.phone} onChange={e => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    placeholder={tx.phonePlaceholder} style={{ paddingLeft: '68px' }} type="tel" />
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: '13px', color: '#86efac', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                                {tx.password} *
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                                <input className="input-field" value={form.password} onChange={e => update('password', e.target.value)}
                                    placeholder={tx.passwordPlaceholder} type={showPass ? 'text' : 'password'} style={{ paddingLeft: '36px', paddingRight: '40px' }} />
                                <button type="button" onClick={() => setShowPass(s => !s)} style={{
                                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer',
                                }}>
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {mode === 'register' && (
                            <div>
                                <label style={{ fontSize: '13px', color: '#86efac', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                                    {tx.confirmPassword} *
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                                    <input className="input-field" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)}
                                        placeholder={tx.confirmPlaceholder} type="password" style={{ paddingLeft: '36px' }} />
                                </div>
                            </div>
                        )}

                        {error && (
                            <div style={{
                                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                                borderRadius: '10px', padding: '10px 14px', color: '#f87171', fontSize: '13px',
                            }}>
                                ⚠️ {error}
                            </div>
                        )}
                        {success && (
                            <div style={{
                                background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)',
                                borderRadius: '10px', padding: '10px 14px', color: '#4ade80', fontSize: '13px',
                            }}>
                                ✅ {success}
                            </div>
                        )}

                        <button className="btn-primary" type="submit" disabled={loading}
                            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px', marginTop: '4px' }}>
                            {loading ? '...' : (mode === 'login' ? tx.loginBtn : tx.registerBtn)}
                            <ArrowRight size={18} />
                        </button>

                        <div style={{ textAlign: 'center', fontSize: '13px', color: '#6b7280' }}>
                            {mode === 'login' ? tx.noAccount : tx.hasAccount}{' '}
                            <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                                style={{ background: 'none', border: 'none', color: '#4ade80', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                                {mode === 'login' ? tx.register : tx.login}
                            </button>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                            <span style={{ color: '#6b7280', fontSize: '12px' }}>OR</span>
                            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                        </div>

                        <button type="button" className="btn-secondary" onClick={guestLogin}
                            style={{ width: '100%', justifyContent: 'center' }}>
                            {tx.guestLogin}
                        </button>
                    </form>
                </div>
            </div>

            <style>{`
        @media (max-width: 640px) {
          .auth-grid { grid-template-columns: 1fr !important; }
          .auth-left { display: none !important; }
        }
      `}</style>
        </div>
    );
}
