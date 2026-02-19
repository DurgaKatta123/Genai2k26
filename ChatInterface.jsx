import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Download } from 'lucide-react';
import { askGroq } from '../services/api';

function MarkdownText({ text }) {
    const formatted = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^\* (.*$)/gm, '<li>$1</li>')
        .replace(/^- (.*$)/gm, '<li>$1</li>')
        .replace(/\n/g, '<br/>');
    return <div className="markdown-content" dangerouslySetInnerHTML={{ __html: formatted }} />;
}

const QUICK_QUESTIONS = {
    en: [
        'Best fertilizer for wheat?',
        'How to treat tomato blight?',
        'PM-KISAN scheme details',
        'Drip irrigation benefits',
        'Organic pest control',
        'Soil testing procedure',
    ],
    hi: [
        'गेहूं के लिए सबसे अच्छा उर्वरक?',
        'टमाटर का झुलसा रोग कैसे ठीक करें?',
        'पीएम-किसान योजना की जानकारी',
        'ड्रिप सिंचाई के फायदे',
        'जैविक कीट नियंत्रण',
        'मिट्टी परीक्षण की प्रक्रिया',
    ],
    te: [
        'గోధుమకు ఉత్తమ ఎరువు?',
        'టమాటో తెగులు ఎలా నయం చేయాలి?',
        'పీఎం-కిసాన్ పథకం వివరాలు',
        'డ్రిప్ నీటిపారుదల ప్రయోజనాలు',
        'సేంద్రీయ తెగులు నియంత్రణ',
        'నేల పరీక్ష విధానం',
    ],
};

const WELCOME_MSG = {
    en: 'Namaste! I am KrishiSahay, your farming helper. Ask me anything about crops, diseases, fertilizers, or government schemes! 🌾',
    hi: 'नमस्ते! मैं KrishiSahay हूं, आपका कृषि सहायक। फसलों, बीमारियों, उर्वरकों या सरकारी योजनाओं के बारे में कुछ भी पूछें! 🌾',
    te: 'నమస్కారం! నేను KrishiSahay, మీ వ్యవసాయ సహాయకుడు. పంటలు, వ్యాధులు, ఎరువులు లేదా ప్రభుత్వ పథకాల గురించి ఏదైనా అడగండి! 🌾',
};

const PLACEHOLDER = {
    en: 'Ask about crops, diseases, schemes... (Enter to send)',
    hi: 'फसलों, बीमारियों, योजनाओं के बारे में पूछें... (Enter दबाएं)',
    te: 'పంటలు, వ్యాధులు, పథకాల గురించి అడగండి... (Enter నొక్కండి)',
};

export default function ChatInterface({ language }) {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: WELCOME_MSG[language] || WELCOME_MSG.en, timestamp: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Update welcome message when language changes
    useEffect(() => {
        setMessages([{ role: 'assistant', content: WELCOME_MSG[language] || WELCOME_MSG.en, timestamp: new Date() }]);
    }, [language]);

    const sendMessage = async (text) => {
        const userText = text || input.trim();
        if (!userText || loading) return;

        const userMsg = { role: 'user', content: userText, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const history = [...messages, userMsg].map(m => ({
                role: m.role === 'assistant' ? 'assistant' : 'user',
                content: m.content,
            }));
            const reply = await askGroq(history, language);
            setMessages(prev => [...prev, { role: 'assistant', content: reply, timestamp: new Date() }]);
        } catch (err) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: language === 'hi'
                    ? `⚠️ त्रुटि: ${err.message}. कृपया पुनः प्रयास करें।`
                    : language === 'te'
                        ? `⚠️ లోపం: ${err.message}. దయచేసి మళ్ళీ ప్రయత్నించండి.`
                        : `⚠️ Error: ${err.message}. Please try again.`,
                timestamp: new Date(),
            }]);
        } finally {
            setLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([{ role: 'assistant', content: WELCOME_MSG[language] || WELCOME_MSG.en, timestamp: new Date() }]);
    };

    const exportChat = () => {
        const text = messages.map(m => `[${m.role.toUpperCase()}] ${m.content}`).join('\n\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'krishisahay-chat.txt';
        a.click();
    };

    const quickQs = QUICK_QUESTIONS[language] || QUICK_QUESTIONS.en;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, #16a34a, #15803d)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Bot size={22} color="white" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f0fdf4' }}>
                            {language === 'hi' ? 'कृषि हेल्पलाइन' : language === 'te' ? 'వ్యవసాయ హెల్ప్‌లైన్' : 'Krishi Helpline'}
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div className="pulse-green" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80' }} />
                            <span style={{ fontSize: '12px', color: '#4ade80' }}>
                                {language === 'hi' ? 'सहायक उपलब्ध है' : language === 'te' ? 'సహాయకుడు అందుబాటులో ఉన్నాడు' : 'Assistant is available'}
                            </span>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-secondary" onClick={exportChat} style={{ padding: '8px 12px', fontSize: '12px' }}>
                        <Download size={14} />
                        {language === 'hi' ? 'सेव करें' : language === 'te' ? 'సేవ్ చేయండి' : 'Save'}
                    </button>
                    <button className="btn-secondary" onClick={clearChat} style={{ padding: '8px 12px', fontSize: '12px' }}>
                        <Trash2 size={14} />
                        {language === 'hi' ? 'साफ करें' : language === 'te' ? 'క్లియర్' : 'Clear'}
                    </button>
                </div>
            </div>

            {/* Quick Questions */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {quickQs.map((q, i) => (
                    <button
                        key={i}
                        onClick={() => sendMessage(q)}
                        style={{
                            background: 'rgba(74, 222, 128, 0.08)',
                            border: '1px solid rgba(74, 222, 128, 0.2)',
                            borderRadius: '20px', padding: '6px 14px',
                            fontSize: '12px', color: '#86efac', cursor: 'pointer',
                            transition: 'all 0.2s', whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={e => { e.target.style.background = 'rgba(74,222,128,0.15)'; e.target.style.borderColor = '#4ade80'; }}
                        onMouseLeave={e => { e.target.style.background = 'rgba(74,222,128,0.08)'; e.target.style.borderColor = 'rgba(74,222,128,0.2)'; }}
                    >
                        {q}
                    </button>
                ))}
            </div>

            {/* Messages */}
            <div className="glass-card" style={{
                flex: 1, overflowY: 'auto', padding: '20px',
                display: 'flex', flexDirection: 'column', gap: '16px',
                minHeight: '400px', maxHeight: '500px',
            }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{
                        display: 'flex', flexDirection: 'column',
                        alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        gap: '4px', animation: 'fadeInUp 0.3s ease-out',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            {msg.role === 'assistant' && (
                                <div style={{
                                    width: '24px', height: '24px', borderRadius: '6px',
                                    background: 'linear-gradient(135deg, #16a34a, #15803d)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Bot size={12} color="white" />
                                </div>
                            )}
                            <span style={{ fontSize: '11px', color: '#6b7280' }}>
                                {msg.role === 'assistant'
                                    ? (language === 'hi' ? 'कृषि सहायक' : language === 'te' ? 'వ్యవసాయ సహాయకుడు' : 'Farming Helper')
                                    : (language === 'hi' ? 'आप' : language === 'te' ? 'మీరు' : 'You')}{' '}
                                • {msg.timestamp?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {msg.role === 'user' && (
                                <div style={{
                                    width: '24px', height: '24px', borderRadius: '6px',
                                    background: 'rgba(74,222,128,0.2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <User size={12} color="#4ade80" />
                                </div>
                            )}
                        </div>
                        <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                            {msg.role === 'assistant' ? <MarkdownText text={msg.content} /> : msg.content}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <div style={{
                            width: '24px', height: '24px', borderRadius: '6px',
                            background: 'linear-gradient(135deg, #16a34a, #15803d)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Bot size={12} color="white" />
                        </div>
                        <div className="chat-bubble-ai" style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '16px' }}>
                            <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                    <textarea
                        className="input-field"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                        placeholder={PLACEHOLDER[language] || PLACEHOLDER.en}
                        rows={2}
                        style={{ resize: 'none' }}
                    />
                </div>
                <button className="btn-primary" onClick={() => sendMessage()} disabled={!input.trim() || loading}
                    style={{ height: '52px', padding: '0 20px' }}>
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
}
