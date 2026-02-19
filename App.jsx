import { useState } from 'react';
import {
  Home, MessageSquare, Leaf, Cloud, BarChart3, BookOpen,
  Globe, Sprout, ChevronRight, LogOut, User, Settings
} from 'lucide-react';
import './index.css';
import AuthPage from './components/AuthPage';
import HomePage from './components/HomePage';
import ChatInterface from './components/ChatInterface';
import ImageAnalyzer from './components/ImageAnalyzer';
import WeatherDashboard from './components/WeatherDashboard';
import MarketPrices from './components/MarketPrices';
import SchemesPage from './components/SchemesPage';

const NAV_ITEMS = [
  { id: 'home', labelEn: 'Home', labelHi: 'होम', labelTe: 'హోమ్', icon: <Home size={18} /> },
  { id: 'chat', labelEn: 'Krishi Helpline', labelHi: 'कृषि हेल्पलाइन', labelTe: 'వ్యవసాయ హెల్ప్‌లైన్', icon: <MessageSquare size={18} /> },
  { id: 'scan', labelEn: 'Crop Health Check', labelHi: 'फसल स्वास्थ्य जांच', labelTe: 'పంట ఆరోగ్య తనిఖీ', icon: <Leaf size={18} /> },
  { id: 'weather', labelEn: 'Weather', labelHi: 'मौसम', labelTe: 'వాతావరణం', icon: <Cloud size={18} /> },
  { id: 'market', labelEn: 'Mandi Prices', labelHi: 'मंडी भाव', labelTe: 'మండి ధరలు', icon: <BarChart3 size={18} /> },
  { id: 'schemes', labelEn: 'Govt Help', labelHi: 'सरकारी मदद', labelTe: 'ప్రభుత్వ సహాయం', icon: <BookOpen size={18} /> },
];

const PAGE_TITLES = {
  home: { en: 'Welcome', hi: 'स्वागत है', te: 'స్వాగతం' },
  chat: { en: 'Krishi Helpline', hi: 'कृषि हेल्पलाइन', te: 'వ్యవసాయ హెల్ప్‌లైన్' },
  scan: { en: 'Crop Health Check', hi: 'फसल स्वास्थ्य जांच', te: 'పంట ఆరోగ్య తనిఖీ' },
  weather: { en: 'Weather Forecast', hi: 'मौसम पूर्वानुमान', te: 'వాతావరణ అంచనా' },
  market: { en: 'Mandi Prices', hi: 'मंडी भाव', te: 'మండి ధరలు' },
  schemes: { en: 'Government Help', hi: 'सरकारी मदद', te: 'ప్రభుత్వ సహాయం' },
};

const LANG_OPTIONS = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'te', label: 'తెలుగు', flag: '🌿' },
];

function getLabel(item, lang) {
  if (lang === 'hi') return item.labelHi;
  if (lang === 'te') return item.labelTe;
  return item.labelEn;
}

function Sidebar({ activePage, onNavigate, language, onChangeLang, user, onLogout }) {
  const [showLangMenu, setShowLangMenu] = useState(false);

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding: '8px 8px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Sprout size={20} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#f0fdf4' }}>KrishiSahay</div>
            <div style={{ fontSize: '10px', color: '#4ade80', fontWeight: '500' }}>
              {language === 'hi' ? 'किसान का साथी' : language === 'te' ? 'రైతు సహాయకుడు' : 'Farmer\'s Companion'}
            </div>
          </div>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div style={{
          background: 'rgba(74,222,128,0.08)', borderRadius: '12px',
          padding: '12px', marginBottom: '12px',
          border: '1px solid rgba(74,222,128,0.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #16a34a, #f59e0b)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: '700', color: 'white', flexShrink: 0,
            }}>
              {user.name?.[0]?.toUpperCase() || '👤'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#f0fdf4', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name}
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>
                {user.isGuest ? (language === 'hi' ? 'अतिथि' : language === 'te' ? 'అతిథి' : 'Guest') : (user.state || 'Farmer')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nav Items */}
      <nav style={{ flex: 1 }}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`nav-link ${activePage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
            style={{ width: '100%', justifyContent: 'flex-start', marginBottom: '2px' }}
          >
            <span style={{ color: activePage === item.id ? '#4ade80' : '#6b7280' }}>{item.icon}</span>
            {getLabel(item, language)}
            {activePage === item.id && (
              <ChevronRight size={14} style={{ marginLeft: 'auto', color: '#4ade80' }} />
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Controls */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {/* Language Selector */}
        <div style={{ position: 'relative' }}>
          <button
            className="nav-link"
            onClick={() => setShowLangMenu(s => !s)}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <Globe size={18} />
            {LANG_OPTIONS.find(l => l.code === language)?.flag} {LANG_OPTIONS.find(l => l.code === language)?.label}
            <ChevronRight size={14} style={{ marginLeft: 'auto', transform: showLangMenu ? 'rotate(90deg)' : 'none', transition: '0.2s' }} />
          </button>
          {showLangMenu && (
            <div style={{
              position: 'absolute', bottom: '100%', left: 0, right: 0,
              background: '#0f1a0f', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px', overflow: 'hidden', marginBottom: '4px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}>
              {LANG_OPTIONS.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => { onChangeLang(lang.code); setShowLangMenu(false); }}
                  style={{
                    width: '100%', padding: '10px 14px', background: language === lang.code ? 'rgba(74,222,128,0.1)' : 'none',
                    border: 'none', color: language === lang.code ? '#4ade80' : '#9ca3af',
                    fontSize: '13px', cursor: 'pointer', textAlign: 'left', display: 'flex', gap: '8px', alignItems: 'center',
                  }}
                >
                  {lang.flag} {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Logout */}
        <button className="nav-link" onClick={onLogout} style={{ width: '100%', justifyContent: 'flex-start', color: '#f87171' }}>
          <LogOut size={18} color="#f87171" />
          {language === 'hi' ? 'लॉगआउट' : language === 'te' ? 'లాగ్అవుట్' : 'Logout'}
        </button>
      </div>
    </aside>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState('home');
  const [language, setLanguage] = useState('en');

  const handleLogin = (userData) => {
    setUser(userData);
    setActivePage('home');
  };

  const handleLogout = () => {
    setUser(null);
    setActivePage('home');
  };

  const renderPage = () => {
    const props = { language, user };
    switch (activePage) {
      case 'home': return <HomePage {...props} onNavigate={setActivePage} />;
      case 'chat': return <ChatInterface {...props} />;
      case 'scan': return <ImageAnalyzer {...props} />;
      case 'weather': return <WeatherDashboard {...props} />;
      case 'market': return <MarketPrices {...props} />;
      case 'schemes': return <SchemesPage {...props} />;
      default: return <HomePage {...props} onNavigate={setActivePage} />;
    }
  };

  // Show auth page if not logged in
  if (!user) {
    return (
      <>
        <div className="animated-bg" />
        <AuthPage onLogin={handleLogin} language={language} />
        {/* Language selector on auth page */}
        <div style={{ position: 'fixed', top: '16px', right: '16px', display: 'flex', gap: '6px', zIndex: 200 }}>
          {LANG_OPTIONS.map(lang => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              style={{
                background: language === lang.code ? 'rgba(74,222,128,0.2)' : 'rgba(0,0,0,0.5)',
                border: `1px solid ${language === lang.code ? '#4ade80' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '8px', padding: '6px 12px',
                color: language === lang.code ? '#4ade80' : '#9ca3af',
                fontSize: '12px', cursor: 'pointer', fontWeight: '600',
              }}
            >
              {lang.flag} {lang.label}
            </button>
          ))}
        </div>
      </>
    );
  }

  const title = PAGE_TITLES[activePage];

  return (
    <>
      <div className="animated-bg" />
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        language={language}
        onChangeLang={setLanguage}
        user={user}
        onLogout={handleLogout}
      />
      <main className="main-content">
        {/* Top bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '28px', flexWrap: 'wrap', gap: '12px',
        }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#f0fdf4' }}>
              {language === 'hi' ? title.hi : language === 'te' ? title.te : title.en}
            </h1>
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          {/* Greeting */}
          <div style={{
            background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)',
            borderRadius: '12px', padding: '8px 16px',
            fontSize: '13px', color: '#86efac',
          }}>
            🌾 {language === 'hi' ? `नमस्ते, ${user.name}` : language === 'te' ? `నమస్కారం, ${user.name}` : `Hello, ${user.name}`}
          </div>
        </div>

        <div className="fade-in-up" key={activePage}>
          {renderPage()}
        </div>
      </main>
    </>
  );
}
