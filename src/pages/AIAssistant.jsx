import { useState, useRef, useEffect, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

/* ─── Proactive question categories ─── */
const QUESTION_CATEGORIES = {
    english: [
        { icon: '🌱', label: 'Crop Planning', color: '#22c55e', bg: 'rgba(34,197,94,0.12)', questions: ['Which crop is best for black soil in Kharif?', 'What crops grow well with limited water?', 'Best crop for small budget under ₹10,000/acre?', 'Which vegetables give profit in 60 days?'] },
        { icon: '🌍', label: 'Soil & Fertilizer', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', questions: ['How much urea for rice per acre?', 'How to improve red soil fertility?', 'What is the best organic fertilizer?', 'When to apply DAP fertilizer?'] },
        { icon: '🐛', label: 'Pest & Disease', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', questions: ['How to control aphids organically?', 'Yellow leaves on my cotton — what to do?', 'Stem borer treatment for rice?', 'Natural pesticide recipe at home?'] },
        { icon: '🌦️', label: 'Weather & Irrigation', color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', questions: ['Should I irrigate before heavy rain?', 'Best time to irrigate in summer heat?', 'How much water does cotton need per week?', 'How to protect crops from hailstorm?'] },
        { icon: '💰', label: 'Market & Profit', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', questions: ['Which crop gives maximum profit this season?', 'Where to sell turmeric for best price?', 'How to reduce farming cost per acre?', 'Is cotton price expected to rise?'] },
        { icon: '🏛️', label: 'Govt Schemes', color: '#fb7185', bg: 'rgba(251,113,133,0.12)', questions: ['How to apply for PM-KISAN scheme?', 'Soil health card — how to get it free?', 'Crop insurance claim process?', 'Bank loan for farmers at low interest?'] },
    ],
    telugu: [
        { icon: '🌱', label: 'పంట ప్రణాళిక', color: '#22c55e', bg: 'rgba(34,197,94,0.12)', questions: ['ఖరీఫ్‌లో నల్ల నేలకు ఏ పంట మంచిది?', 'తక్కువ నీటితో ఏ పంటలు పండుతాయి?', '60 రోజుల్లో లాభం వచ్చే పంటలు?', 'తక్కువ బడ్జెట్‌లో ఏ పంట వేయాలి?'] },
        { icon: '🌍', label: 'నేల & ఎరువు', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', questions: ['వరికి ఒక్కో ఎకరానికి యూరియా ఎంత?', 'ఎర్ర నేల సారం ఎలా పెంచాలి?', 'మంచి సేంద్రియ ఎరువు ఏమిటి?', 'డిఎపి ఎప్పుడు వేయాలి?'] },
        { icon: '🐛', label: 'చీడ & తెగులు', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', questions: ['పత్తిలో పచ్చ దోమలను ఎలా నివారించాలి?', 'ఆకులు పసుపు రంగులో ఉన్నాయి — ఏమి చేయాలి?', 'వరి కాండం చీడ చికిత్స?', 'ఇంట్లో తయారు చేయగల పురుగు మందు?'] },
        { icon: '🌦️', label: 'వాతావరణం & సేద్యం', color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', questions: ['వర్షం ముందు నీరు పెట్టాలా?', 'వేసవిలో నీటి సేద్యానికి సరైన సమయం?', 'పత్తికి వారానికి ఎంత నీరు కావాలి?', 'వడగళ్ళ వర్షం నుండి పంటను ఎలా రక్షించాలి?'] },
        { icon: '💰', label: 'మార్కెట్ & లాభం', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', questions: ['ఈ సీజన్‌లో అత్యధిక లాభం వచ్చే పంట ఏది?', 'పసుపు అమ్మకానికి మంచి మండీ?', 'ఎకరానికి వ్యవసాయ ఖర్చు తగ్గించడం ఎలా?', 'పత్తి ధర పెరుగుతుందా?'] },
        { icon: '🏛️', label: 'ప్రభుత్వ పథకాలు', color: '#fb7185', bg: 'rgba(251,113,133,0.12)', questions: ['పీఎం కిసాన్‌కు ఎలా దరఖాస్తు చేయాలి?', 'ఉచిత నేల ఆరోగ్య కార్డు ఎలా పొందాలి?', 'పంట బీమా క్లెయిమ్ ప్రక్రియ?', 'రైతులకు తక్కువ వడ్డీకి రుణం?'] },
    ],
};

const QUICK_Q_EN = ['Best crop for black soil?', 'How to control pests organically?', 'PM-KISAN eligibility?', 'Cotton vs Chilli profit?'];
const QUICK_Q_TE = ['నల్ల నేలకు మంచి పంట?', 'పురుగులను సేంద్రియంగా నివారించడం?', 'పీఎం కిసాన్ అర్హత?', 'పత్తి vs మిర్చి లాభం?'];

export default function AIAssistant() {
    const { farmer } = useAuth();
    const defaultLang = farmer?.preferredLanguage === 'telugu' ? 'telugu' : 'english';
    const [language, setLanguage] = useState(defaultLang);
    const [messages, setMessages] = useState([{
        role: 'assistant',
        content: language === 'telugu'
            ? '👋 నమస్కారం! నేను అగ్రిబాట్ 🤖\n\nమీరు **వ్యవసాయ సంబంధిత** ఏ ప్రశ్నైనా అడగవచ్చు! నేను మీకు పంట, ఎరువు, చీడ, వాతావరణం, మార్కెట్ ధరలు గురించి సహాయపడతాను.\n\n👇 క్రింద ఉన్న కేటగిరీలు నొక్కండి లేదా మీ ప్రశ్న టైప్ చేయండి!'
            : '👋 Hello! I\'m AgriBot 🤖\n\nAsk me **any farming question**! I can help with crop selection, fertilizers, pest control, weather, market prices, government schemes, and much more.\n\n👇 Choose a category below or type/speak your question!',
        timestamp: new Date(),
        isBot: true
    }]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const [listening, setListening] = useState(false);
    const [speaking, setSpeaking] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);
    const [voiceSupported] = useState(() => 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
    const [ttsSupported] = useState(() => 'speechSynthesis' in window);
    const bottomRef = useRef();
    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    /* ─── Send message ─── */
    const sendMessage = useCallback(async (text) => {
        const msg = (text || input).trim();
        if (!msg) return;
        setInput('');
        setActiveCategory(null);
        const userMsg = { role: 'user', content: msg, timestamp: new Date() };
        setMessages(m => [...m, userMsg]);
        setTyping(true);

        try {
            const res = await api.post('/chat', { message: msg, language });
            const reply = res.data.response;
            const delay = 600 + Math.random() * 800;
            setTimeout(() => {
                const botMsg = { role: 'assistant', content: reply, timestamp: new Date(), isBot: true };
                setMessages(m => [...m, botMsg]);
                setTyping(false);
                // Auto-speak if TTS enabled
                if (ttsSupported) speakText(reply);
            }, delay);
        } catch {
            setTyping(false);
            setMessages(m => [...m, { role: 'assistant', content: '⚠️ Unable to connect to AI. Please check your connection.', timestamp: new Date(), isBot: true }]);
        }
    }, [input, language, ttsSupported]);

    /* ─── Voice Input (Speech-to-Text) ─── */
    const startVoice = useCallback(() => {
        if (!voiceSupported) return toast.error('Voice not supported in this browser. Try Chrome.');
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = language === 'telugu' ? 'te-IN' : 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => { setListening(true); toast('🎤 Listening... Speak now!', { icon: '🎙️', duration: 3000 }); };
        recognition.onresult = e => {
            const transcript = e.results[0][0].transcript;
            setInput(transcript);
            setListening(false);
            setTimeout(() => sendMessage(transcript), 300);
        };
        recognition.onerror = (e) => { setListening(false); toast.error(`Voice error: ${e.error}. Try again.`); };
        recognition.onend = () => setListening(false);

        recognitionRef.current = recognition;
        recognition.start();
    }, [language, sendMessage, voiceSupported]);

    const stopVoice = () => {
        recognitionRef.current?.stop();
        setListening(false);
    };

    /* ─── Text-to-Speech ─── */
    const speakText = (text) => {
        if (!ttsSupported) return;
        synthRef.current.cancel();
        // Strip markdown bold/bullet markers for cleaner speech
        const clean = text.replace(/\*\*/g, '').replace(/[•🌱🌿🐛🌦️💰🏛️🤖👋🔬]/g, '').replace(/\n/g, '. ').substring(0, 400);
        const utt = new SpeechSynthesisUtterance(clean);
        utt.lang = language === 'telugu' ? 'te-IN' : 'en-IN';
        utt.rate = 0.92;
        utt.pitch = 1.05;
        utt.onstart = () => setSpeaking(true);
        utt.onend = () => setSpeaking(false);
        utt.onerror = () => setSpeaking(false);
        synthRef.current.speak(utt);
    };

    const stopSpeaking = () => { synthRef.current?.cancel(); setSpeaking(false); };

    const handleKey = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };
    const formatTime = d => new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    /* ─── Format bot message (markdown-lite rendering) ─── */
    const formatMsg = (content) => {
        return content.split('\n').map((line, i) => {
            const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#4ade80">$1</strong>');
            const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
            return (
                <div key={i} style={{ lineHeight: 1.65, marginBottom: isBullet ? 4 : 2 }}
                    dangerouslySetInnerHTML={{ __html: bold || '&nbsp;' }} />
            );
        });
    };

    const cats = QUESTION_CATEGORIES[language];
    const quickQ = language === 'telugu' ? QUICK_Q_TE : QUICK_Q_EN;

    return (
        <div className="page-container" style={{ paddingBottom: 0, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>

            {/* ─── Header ─── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexShrink: 0, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h1 className="page-title" style={{ marginBottom: 4 }}>🤖 AI Farming Assistant</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Ask any farming question by text or voice — English & Telugu</p>
                </div>

                {/* Lang + Speaker controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {/* TTS toggle */}
                    {ttsSupported && speaking && (
                        <button onClick={stopSpeaking} style={{ padding: '8px 14px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 10, color: '#f87171', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ animation: 'pulse 0.5s ease-in-out infinite alternate' }}>🔊</span> Stop
                        </button>
                    )}
                    {/* Language toggle */}
                    <div className="lang-toggle">
                        <button className={language === 'english' ? 'active' : ''} onClick={() => setLanguage('english')}>🇬🇧 English</button>
                        <button className={language === 'telugu' ? 'active' : ''} onClick={() => setLanguage('telugu')}>🇮🇳 తెలుగు</button>
                    </div>
                </div>
            </div>

            {/* ─── Category Quick-Pick Cards ─── */}
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 12, flexShrink: 0 }}>
                {cats.map(cat => (
                    <button key={cat.label} onClick={() => setActiveCategory(activeCategory === cat.label ? null : cat.label)}
                        style={{
                            padding: '8px 14px', borderRadius: 20, flexShrink: 0,
                            background: activeCategory === cat.label ? cat.bg : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${activeCategory === cat.label ? cat.color : 'rgba(255,255,255,0.1)'}`,
                            color: activeCategory === cat.label ? cat.color : 'var(--text-secondary)',
                            cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, transition: 'all 0.2s',
                            whiteSpace: 'nowrap'
                        }}>
                        {cat.icon} {cat.label}
                    </button>
                ))}
            </div>

            {/* Active category questions */}
            {activeCategory && (
                <div style={{ marginBottom: 12, flexShrink: 0 }}>
                    {cats.filter(c => c.label === activeCategory).map(cat => (
                        <div key={cat.label} style={{ background: cat.bg, border: `1px solid ${cat.color}30`, borderRadius: 14, padding: '14px 16px' }}>
                            <p style={{ fontSize: '0.78rem', color: cat.color, fontWeight: 700, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                                {cat.icon} {cat.label} — Click to ask:
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {cat.questions.map((q, i) => (
                                    <button key={i} onClick={() => sendMessage(q)}
                                        style={{
                                            padding: '8px 14px', background: 'rgba(0,0,0,0.3)',
                                            border: `1px solid ${cat.color}40`, borderRadius: 20,
                                            color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.83rem',
                                            fontFamily: language === 'telugu' ? 'Noto Sans Telugu, sans-serif' : 'Outfit, sans-serif',
                                            textAlign: 'left', transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = cat.bg; e.currentTarget.style.color = cat.color; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.3)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                                    >
                                        ❓ {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ─── Chat Window ─── */}
            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', minHeight: 0 }}>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {messages.map((m, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, maxWidth: '82%', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
                                {/* Avatar */}
                                <div style={{ width: 34, height: 34, borderRadius: '50%', background: m.role === 'user' ? 'var(--grad-green)' : 'linear-gradient(135deg, rgba(167,139,250,0.3), rgba(59,130,246,0.4))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0, border: '2px solid rgba(255,255,255,0.1)' }}>
                                    {m.role === 'user' ? '👨‍🌾' : '🤖'}
                                </div>
                                {/* Bubble */}
                                <div style={{
                                    padding: '12px 16px', borderRadius: m.role === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                                    background: m.role === 'user' ? 'linear-gradient(135deg, #15803d, #16a34a)' : 'rgba(255,255,255,0.06)',
                                    border: m.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)',
                                    fontSize: '0.9rem', lineHeight: 1.65, color: '#f0fdf4',
                                    fontFamily: language === 'telugu' ? 'Noto Sans Telugu, sans-serif' : 'Outfit, sans-serif',
                                    boxShadow: m.role === 'user' ? '0 4px 15px rgba(22,163,74,0.25)' : 'none'
                                }}>
                                    {m.isBot || m.role === 'assistant' ? formatMsg(m.content) : m.content}
                                </div>

                                {/* Speak button for bot messages */}
                                {m.role === 'assistant' && ttsSupported && (
                                    <button onClick={() => speakText(m.content)} title="Listen to this response"
                                        style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)', color: '#7dd3fc', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 4 }}>
                                        🔊
                                    </button>
                                )}
                            </div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4, paddingLeft: m.role === 'assistant' ? 44 : 0, paddingRight: m.role === 'user' ? 44 : 0 }}>
                                {formatTime(m.timestamp)}
                            </span>
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {typing && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(167,139,250,0.3), rgba(59,130,246,0.4))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🤖</div>
                            <div style={{ padding: '14px 18px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px 18px 18px 18px', display: 'flex', gap: 5, alignItems: 'center' }}>
                                {[0, 1, 2].map(j => <span key={j} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green-500)', display: 'inline-block', animation: `bounce 1.2s ease-in-out ${j * 0.2}s infinite` }} />)}
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Quick questions strip */}
                <div style={{ padding: '8px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {quickQ.map((q, i) => (
                        <button key={i} onClick={() => sendMessage(q)}
                            style={{ padding: '5px 12px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 20, fontSize: '0.76rem', color: 'var(--green-400)', cursor: 'pointer', fontFamily: language === 'telugu' ? 'Noto Sans Telugu' : 'Outfit', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
                            {q}
                        </button>
                    ))}
                </div>

                {/* ─── Input Area ─── */}
                <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 10, alignItems: 'flex-end', background: 'rgba(0,0,0,0.2)' }}>

                    {/* Voice button */}
                    <button
                        onClick={listening ? stopVoice : startVoice}
                        title={listening ? 'Stop listening' : 'Click to speak your question'}
                        style={{
                            width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                            background: listening
                                ? 'linear-gradient(135deg, #dc2626, #ef4444)'
                                : voiceSupported ? 'linear-gradient(135deg, #1d4ed8, #2563eb)' : 'rgba(100,116,139,0.3)',
                            border: listening ? '2px solid rgba(239,68,68,0.6)' : '2px solid rgba(96,165,250,0.4)',
                            color: '#fff', cursor: voiceSupported ? 'pointer' : 'not-allowed',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.2rem', transition: 'all 0.3s',
                            boxShadow: listening ? '0 0 0 6px rgba(239,68,68,0.2), 0 4px 15px rgba(220,38,38,0.4)' : '0 4px 15px rgba(37,99,235,0.3)',
                            animation: listening ? 'micPulse 1s ease-in-out infinite' : 'none'
                        }}>
                        {listening ? '⏹️' : '🎤'}
                    </button>

                    {/* Text input */}
                    <div style={{ flex: 1, position: 'relative' }}>
                        <textarea
                            rows={1}
                            style={{
                                width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14,
                                color: '#f0fdf4', fontSize: '0.92rem',
                                fontFamily: language === 'telugu' ? 'Noto Sans Telugu, sans-serif' : 'Outfit, sans-serif',
                                outline: 'none', resize: 'none', boxSizing: 'border-box', lineHeight: 1.5,
                                transition: 'border-color 0.3s'
                            }}
                            placeholder={language === 'telugu' ? '✍️ మీ ప్రశ్న ఇక్కడ టైప్ చేయండి...' : '✍️ Ask about crops, fertilizers, market prices, schemes...'}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKey}
                            onFocus={e => { e.target.style.borderColor = '#22c55e'; e.target.style.background = 'rgba(34,197,94,0.06)'; }}
                            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.background = 'rgba(255,255,255,0.06)'; }}
                        />
                    </div>

                    {/* Send button */}
                    <button onClick={() => sendMessage()} disabled={!input.trim() && !typing}
                        style={{
                            width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                            background: input.trim() ? 'linear-gradient(135deg, #15803d, #16a34a)' : 'rgba(255,255,255,0.06)',
                            border: '2px solid rgba(34,197,94,0.3)',
                            color: input.trim() ? '#fff' : 'rgba(148,163,184,0.5)',
                            cursor: input.trim() ? 'pointer' : 'not-allowed',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.2rem', transition: 'all 0.3s',
                            boxShadow: input.trim() ? '0 4px 15px rgba(22,163,74,0.35)' : 'none'
                        }}>
                        ➤
                    </button>
                </div>

                {/* Voice status bar */}
                {listening && (
                    <div style={{ padding: '8px 20px', background: 'linear-gradient(135deg, rgba(220,38,38,0.15), rgba(239,68,68,0.08))', borderTop: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', animation: 'micPulse 0.6s ease-in-out infinite' }} />
                        <span style={{ fontSize: '0.85rem', color: '#fca5a5', fontWeight: 600 }}>
                            🎙️ {language === 'telugu' ? 'వినడం జరుగుతున్నది... మాట్లాడండి!' : 'Listening... Speak your question now!'}
                        </span>
                        <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'rgba(252,165,165,0.6)' }}>Press ⏹️ to stop</span>
                    </div>
                )}
            </div>

            {/* Animations */}
            <style>{`
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes micPulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.08);opacity:0.85} }
        @keyframes pulse { 0%{opacity:1} 100%{opacity:0.5} }
      `}</style>
        </div>
    );
}
