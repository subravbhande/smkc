import { useState, useRef, useEffect } from 'react';
import { useCasesStore, useAuthStore } from '../../store/store';
import { genCaseId } from '../../utils/helpers';
import { Send, Image, MapPin, Phone, MoreVertical, ArrowLeft, CheckCheck, Wifi } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const BOT_DELAY = 1000;
const NAGAR_NETRA_NUMBER = '+91 7083270345';
const WA_NUMBER = 'SMKC Nagar-Netra';

// WhatsApp Bot state machine
const BOT_STATES = {
  IDLE: 'idle',
  AWAITING_PHOTO: 'awaiting_photo',
  AWAITING_LOCATION: 'awaiting_location',
  AWAITING_DESCRIPTION: 'awaiting_description',
  COMPLETE: 'complete',
};

const AI_MOCK = {
  confidence: 94,
  decision: 'Potential Violation',
  category: 'Unauthorized Advertisement Hoarding',
};

function WaMessage({ msg }) {
  const isBot = msg.from === 'bot';
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-2`}>
      {isBot && (
        <div className="w-7 h-7 rounded-full flex items-center justify-center mr-1.5 flex-shrink-0 mt-auto"
          style={{ background: 'linear-gradient(135deg,#075e54,#128c7e)', fontSize: 12 }}>
          🏛️
        </div>
      )}
      <div
        className="max-w-xs rounded-2xl px-3 py-2 text-sm relative"
        style={{
          background: isBot ? '#202c33' : '#005c4b',
          color: 'white',
          borderRadius: isBot ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
        }}>

        {msg.type === 'text' && <p className="leading-relaxed">{msg.content}</p>}

        {msg.type === 'image' && (
          <div>
            <div className="w-48 h-32 rounded-xl mb-1 overflow-hidden flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="text-center">
                <div className="text-3xl mb-1">📸</div>
                <div className="text-xs text-slate-400">Photo evidence</div>
              </div>
            </div>
            {msg.content && <p className="text-xs text-slate-300">{msg.content}</p>}
          </div>
        )}

        {msg.type === 'location' && (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.08)' }}>
              <MapPin size={18} className="text-teal-400" />
            </div>
            <div>
              <div className="text-sm font-semibold">Location Shared</div>
              <div className="text-xs text-slate-400">{msg.content}</div>
            </div>
          </div>
        )}

        {msg.type === 'case-card' && (
          <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <div className="px-3 pt-3 pb-2 flex items-center gap-2"
              style={{ background: '#075e54' }}>
              <span className="text-base">✅</span>
              <span className="font-bold text-sm">Report Registered!</span>
            </div>
            <div className="p-3 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Case ID:</span>
                <span className="font-bold font-mono text-teal-400">{msg.caseId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-amber-400 font-semibold">Under Review</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Source:</span>
                <span className="font-semibold">WhatsApp 📱</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">AI Analysis:</span>
                <span className="text-purple-400 font-semibold">🤖 {AI_MOCK.confidence}% confidence</span>
              </div>
            </div>
            <div className="px-3 py-2 text-center text-xs text-teal-400 font-medium"
              style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              Track on NAGAR-NETRA platform
            </div>
          </div>
        )}

        {msg.type === 'status-card' && (
          <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <div className="px-3 pt-3 pb-2" style={{ background: '#1a3a5c' }}>
              <span className="text-xs font-bold text-blue-300">Case Status Update</span>
            </div>
            <div className="p-3 space-y-1 text-xs">
              {msg.statusData && Object.entries(msg.statusData).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-slate-400">{k}:</span>
                  <span className="font-semibold">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-1 mt-0.5">
          <span className="text-[10px] text-slate-500">{msg.time}</span>
          {!isBot && <CheckCheck size={11} className="text-teal-400" />}
        </div>
      </div>
    </div>
  );
}

export default function WhatsAppSimulatorPage() {
  const { addCase } = useCasesStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [botState, setBotState] = useState(BOT_STATES.IDLE);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [reportData, setReportData] = useState({ photo: null, location: null, description: null, type: 'Illegal Hoarding' });
  const [createdCaseId, setCreatedCaseId] = useState(null);
  const endRef = useRef(null);

  const now = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const addBotMessage = (content, type = 'text', extra = {}) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now(), from: 'bot', content, type, time: now(), ...extra }]);
    }, BOT_DELAY);
  };

  const addUserMessage = (content, type = 'text', extra = {}) => {
    setMessages(prev => [...prev, { id: Date.now(), from: 'user', content, type, time: now(), ...extra }]);
  };

  const handleStart = () => {
    addUserMessage('Hello');
    setTimeout(() => {
      addBotMessage('🏛️ *Namaste! Welcome to NAGAR-NETRA.*\n\nI can help you report civic violations in SMKC jurisdiction.\n\nReply:\n• *REPORT* — Report a new violation\n• *STATUS [Case ID]* — Check case status\n• *HELP* — Show all commands');
    }, 400);
  };

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;
    setInputText('');

    const upper = text.toUpperCase();

    // Handle STATUS query
    if (upper.startsWith('STATUS ')) {
      const caseId = text.split(' ')[1];
      addUserMessage(text);
      setTimeout(() => {
        if (caseId === createdCaseId) {
          addBotMessage('Here is your case status:', 'status-card', {
            statusData: {
              'Case': caseId,
              'Issue': reportData.type,
              'Location': reportData.location || 'Sangli-Miraj Road',
              'Status': '🟡 Under Review',
              'Updated': new Date().toLocaleDateString('en-IN'),
            }
          });
        } else {
          addBotMessage(`Case *${caseId}* not found in demo system. Try: STATUS ${createdCaseId || 'NNT-2026-004271'}`);
        }
      }, 400);
      return;
    }

    // REPORT flow
    if (upper === 'REPORT' || upper === 'REPORT ILLEGAL HOARDING' || upper === 'ILLEGAL HOARDING' || upper === 'ENCROACHMENT') {
      addUserMessage(text);
      if (upper.includes('ENCROACHMENT')) setReportData(d => ({ ...d, type: 'Encroachment' }));
      setBotState(BOT_STATES.AWAITING_PHOTO);
      setTimeout(() => addBotMessage('📸 *Step 1/3 — Evidence Photo*\n\nPlease send a *clear photo* of the suspected violation.\n\nFor hoardings: Include the full hoarding structure\nFor encroachments: Show the obstruction clearly'), 400);
      return;
    }

    if (upper === 'HELP') {
      addUserMessage(text);
      setTimeout(() => addBotMessage('*NAGAR-NETRA Commands:*\n\n• REPORT — Report a new violation\n• STATUS NNT-2026-XXXXXX — Check case status\n• HELP — Show this menu\n• CANCEL — Cancel current report'), 400);
      return;
    }

    if (upper === 'CANCEL') {
      addUserMessage(text);
      setBotState(BOT_STATES.IDLE);
      setReportData({ photo: null, location: null, description: null, type: 'Illegal Hoarding' });
      addBotMessage('Report cancelled. Send *REPORT* to start again.');
      return;
    }

    // Handle flow states
    if (botState === BOT_STATES.AWAITING_DESCRIPTION) {
      addUserMessage(text);
      setReportData(d => ({ ...d, description: text }));
      createCase(text);
      return;
    }

    // Default
    addUserMessage(text);
    if (botState === BOT_STATES.IDLE) {
      addBotMessage('Send *REPORT* to report a new violation, or *STATUS [Case ID]* to track a case.');
    }
  };

  const handleSendPhoto = () => {
    addUserMessage('[Photo: suspected_violation.jpg]', 'image', { content: 'violation_photo.jpg' });
    setReportData(d => ({ ...d, photo: 'demo_photo.jpg' }));
    setBotState(BOT_STATES.AWAITING_LOCATION);
    setTimeout(() => addBotMessage('📍 *Step 2/3 — Location*\n\nPlease share your *current location* so we can map this case accurately.\n\nTap the 📎 attachment button → *Location*'), BOT_DELAY);
  };

  const handleSendLocation = () => {
    const locationStr = 'Sangli-Miraj Road, Near Railway Overbridge (16.8524°N, 74.5815°E)';
    addUserMessage(locationStr, 'location', { content: locationStr });
    setReportData(d => ({ ...d, location: locationStr }));
    setBotState(BOT_STATES.AWAITING_DESCRIPTION);
    setTimeout(() => addBotMessage('✍️ *Step 3/3 — Description*\n\nBriefly describe the violation:\n• What did you see?\n• Since when?\n• Any visible contact details?\n\nType your description below.'), BOT_DELAY);
  };

  const createCase = (description) => {
    setBotState(BOT_STATES.COMPLETE);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addBotMessage('🤖 *Analyzing evidence...*\n\nRunning AI detection on uploaded photo...');
    }, 600);

    setTimeout(() => {
      const id = genCaseId();
      setCreatedCaseId(id);
      const newCase = {
        id,
        type: reportData.type,
        title: `${reportData.type} reported via WhatsApp`,
        description: description,
        location: 'Sangli-Miraj Road, Near Railway Overbridge',
        address: 'Sangli-Miraj Road, Sangli',
        lat: 16.8524, lng: 74.5815,
        ward: 'Sangli',
        reportedBy: 'whatsapp_citizen@smkc.demo',
        reporterName: 'WhatsApp Citizen Reporter',
        reporterMobile: '+91 70832 70345',
        reportedAt: new Date().toISOString(),
        status: 'Under Review',
        priority: 'High',
        source: 'WhatsApp',
        assignedOfficer: null,
        assignedOfficerName: null,
        aiConfidence: AI_MOCK.confidence,
        aiDecision: AI_MOCK.decision,
        aiCategory: AI_MOCK.category,
        ocrText: 'ABC DEVELOPERS\nCONTACT: 98XXXXXXXX',
        advertiserName: 'ABC Developers',
        permitNumber: null,
        permitStatus: 'Unknown',
        noticeNumber: null,
        evidenceImages: ['whatsapp_photo.jpg'],
        timeline: [
          {
            date: new Date().toISOString(),
            event: `Report submitted via WhatsApp`,
            user: 'WhatsApp Reporter',
            role: 'Citizen',
            icon: 'report',
          },
          {
            date: new Date(Date.now() + 10000).toISOString(),
            event: `AI analysis completed — Potential Violation detected (${AI_MOCK.confidence}% confidence)`,
            user: 'AI System',
            role: 'System',
            icon: 'ai',
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addCase(newCase);

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(), from: 'bot', type: 'case-card', caseId: id, time: now(),
        }]);
        setTimeout(() => {
          addBotMessage(`✅ *Report registered successfully!*\n\nYour case *${id}* has entered the NAGAR-NETRA enforcement system.\n\n• Track: Reply STATUS ${id}\n• AI detected a *Potential Violation* with ${AI_MOCK.confidence}% confidence\n• A field officer will be assigned shortly\n\nThank you for reporting! 🙏`);
        }, 800);
      }, 800);
    }, 3500);
  };

  return (
    <div className="p-3.5 sm:p-6 animate-fade-in space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#25d366' }}>
              <span className="text-white text-lg">💬</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">WhatsApp Simulator</h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm ml-0 sm:ml-11">Demo of WhatsApp-to-NAGAR-NETRA integration — same case pipeline</p>
        </div>
        {createdCaseId && (
          <button
            onClick={() => navigate(`/cases/${createdCaseId}`)}
            className="btn btn-primary btn-sm self-start sm:self-auto">
            View Created Case →
          </button>
        )}
      </div>

      {/* Info banner */}
      <div className="px-4 py-3 rounded-xl flex items-start gap-3"
        style={{ background: 'linear-gradient(135deg,#dcfce7,#bbf7d0)', border: '1px solid #86efac' }}>
        <Wifi size={16} className="text-green-700 flex-shrink-0 mt-0.5" />
        <div>
          <div className="text-green-900 font-semibold text-sm">WhatsApp Integration — Demo Mode</div>
          <div className="text-green-700 text-xs mt-0.5">
            Reports created here enter the <strong>same NAGAR-NETRA case pipeline</strong> as web reports. Source is tagged as "WhatsApp".
            Cases appear in the Admin dashboard with the WhatsApp filter.
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* WhatsApp Phone mockup */}
        <div className="lg:col-span-3">
          <div className="rounded-3xl overflow-hidden shadow-2xl mx-auto w-full max-w-[380px]" style={{ background: '#111b21' }}>
            {/* WA Header */}
            <div className="flex items-center gap-3 px-4 py-3" style={{ background: '#1f2c34' }}>
              <button onClick={() => {}} className="text-slate-400 mr-1"><ArrowLeft size={18} /></button>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#075e54,#128c7e)' }}>🏛️</div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-semibold truncate">{WA_NUMBER}</div>
                <div className="text-xs flex items-center gap-1" style={{ color: '#00a884' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  Online · Demo Mode
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <Phone size={18} />
                <MoreVertical size={18} />
              </div>
            </div>

            {/* WA Number display */}
            <div className="text-center py-2 text-xs" style={{ color: '#8696a0', background: '#0d1117' }}>
              {NAGAR_NETRA_NUMBER} · Official SMKC Channel
            </div>

            {/* Messages */}
            <div
              className="p-4 overflow-y-auto space-y-1"
              style={{
                minHeight: 380,
                maxHeight: 420,
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23111b21' width='100' height='100'/%3E%3C/svg%3E\")",
              }}>

              {/* Date tag */}
              <div className="text-center mb-3">
                <span className="text-xs px-3 py-1 rounded-full" style={{ background: '#1f2c34', color: '#8696a0' }}>TODAY</span>
              </div>

              {/* System info bubble */}
              <div className="flex justify-center mb-3">
                <div className="px-3 py-2 rounded-xl text-xs text-center max-w-xs" style={{ background: '#1f2c34', color: '#8696a0' }}>
                  🔒 Messages to SMKC Nagar-Netra are end-to-end encrypted. <strong className="text-green-400">DEMO MODE ACTIVE</strong>
                </div>
              </div>

              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">💬</div>
                  <div className="text-sm" style={{ color: '#8696a0' }}>
                    Click "Start Demo" to begin the WhatsApp flow
                  </div>
                </div>
              )}

              {messages.map(msg => <WaMessage key={msg.id} msg={msg} />)}

              {isTyping && (
                <div className="flex items-end gap-1.5 mb-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#075e54,#128c7e)', fontSize: 12 }}>🏛️</div>
                  <div className="px-4 py-3 rounded-2xl" style={{ background: '#202c33', borderRadius: '4px 18px 18px 18px' }}>
                    <div className="flex gap-1">
                      {[0,1,2].map(i => (
                        <div key={i} className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={endRef} />
            </div>

            {/* Quick action buttons (WhatsApp-style attachment icons) */}
            {botState !== BOT_STATES.IDLE && botState !== BOT_STATES.COMPLETE && (
              <div className="px-4 py-2 flex gap-2" style={{ background: '#111b21', borderTop: '1px solid #1f2c34' }}>
                {botState === BOT_STATES.AWAITING_PHOTO && (
                  <button
                    onClick={handleSendPhoto}
                    className="flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                    style={{ background: '#25d366', color: 'white' }}>
                    <Image size={14} /> Send Photo
                  </button>
                )}
                {botState === BOT_STATES.AWAITING_LOCATION && (
                  <button
                    onClick={handleSendLocation}
                    className="flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                    style={{ background: '#25d366', color: 'white' }}>
                    <MapPin size={14} /> Share Location
                  </button>
                )}
              </div>
            )}

            {/* Input bar */}
            <div className="flex items-center gap-2 px-3 py-2" style={{ background: '#1f2c34' }}>
              <input
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="flex-1 rounded-full px-4 py-2 text-sm outline-none text-white"
                style={{ background: '#2a3942', border: 'none' }}
                placeholder="Type a message..."
              />
              <button
                onClick={handleSend}
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: inputText.trim() ? '#25d366' : '#2a3942' }}>
                <Send size={15} color={inputText.trim() ? 'white' : '#8696a0'} />
              </button>
            </div>
          </div>
        </div>

        {/* Instructions panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <h3 className="font-bold text-slate-800 text-sm font-display mb-4">Demo Instructions</h3>
            <div className="space-y-3">
              {[
                { step: 1, action: 'Click "Start Demo" button', tip: 'Starts the WhatsApp conversation' },
                { step: 2, action: 'Reply REPORT in the chat', tip: 'Initiates the reporting flow' },
                { step: 3, action: 'Click "Send Photo"', tip: 'Simulates photo upload' },
                { step: 4, action: 'Click "Share Location"', tip: 'Simulates GPS location sharing' },
                { step: 5, action: 'Type a description, press Enter', tip: 'AI analyzes and creates real case' },
                { step: 6, action: 'Click "View Created Case"', tip: 'See the case in the dashboard' },
              ].map(item => (
                <div key={item.step} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{ background: '#25d366', color: 'white' }}>
                    {item.step}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{item.action}</div>
                    <div className="text-xs text-slate-400">{item.tip}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleStart}
              disabled={messages.length > 0}
              className="w-full mt-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              style={{
                background: messages.length > 0 ? '#f1f5f9' : '#25d366',
                color: messages.length > 0 ? '#94a3b8' : 'white',
              }}>
              💬 {messages.length > 0 ? 'Demo Running...' : 'Start Demo'}
            </button>

            {messages.length > 0 && (
              <button
                onClick={() => {
                  setMessages([]);
                  setBotState(BOT_STATES.IDLE);
                  setReportData({ photo: null, location: null, description: null, type: 'Illegal Hoarding' });
                  setCreatedCaseId(null);
                }}
                className="w-full mt-2 py-2 rounded-xl text-sm text-slate-500 hover:text-slate-800 transition-colors">
                Reset Demo
              </button>
            )}
          </div>

          {/* Quick commands */}
          <div className="card p-5">
            <h3 className="font-bold text-slate-800 text-sm font-display mb-3">Supported Commands</h3>
            <div className="space-y-2">
              {[
                { cmd: 'REPORT', desc: 'Start reporting a violation' },
                { cmd: 'STATUS NNT-2026-XXXXXX', desc: 'Check case status' },
                { cmd: 'HELP', desc: 'Show command list' },
                { cmd: 'CANCEL', desc: 'Cancel current report' },
              ].map(c => (
                <div key={c.cmd} className="flex items-start gap-2">
                  <code className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded font-mono flex-shrink-0">{c.cmd}</code>
                  <span className="text-xs text-slate-500">{c.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {createdCaseId && (
            <div className="card p-4" style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', border: '1px solid #86efac' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-600 text-lg">✅</span>
                <span className="font-bold text-green-800 text-sm">Case Created Successfully!</span>
              </div>
              <div className="text-xs text-green-700 mb-2">
                Case <span className="font-mono font-bold">{createdCaseId}</span> is now in the system with source = WhatsApp
              </div>
              <button
                onClick={() => navigate(`/cases/${createdCaseId}`)}
                className="btn btn-sm w-full justify-center"
                style={{ background: '#16a34a', color: 'white' }}>
                Open Case Details →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
