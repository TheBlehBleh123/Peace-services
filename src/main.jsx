import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import App from './App.jsx'
import ServicePage from './pages/ServicePage.jsx'
import AreaPage from './pages/AreaPage.jsx'
import { SiteNavbar, SiteFooter } from './components/Layout.jsx'

/* Import QuizModal from App.jsx won't work since it's not exported.
   We'll use a shared state approach via props. */

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Root() {
  const [quizOpen, setQuizOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      <ScrollToTop />
      {/* Homepage uses its own built-in navbar; other pages use shared navbar */}
      {!isHome && <SiteNavbar onQuizOpen={() => setQuizOpen(true)} />}
      <Routes>
        <Route path="/" element={<App externalQuizOpen={quizOpen} onExternalQuizClose={() => setQuizOpen(false)} />} />
        <Route path="/services/:slug" element={<ServicePage onQuizOpen={() => setQuizOpen(true)} />} />
        <Route path="/areas/:slug" element={<AreaPage onQuizOpen={() => setQuizOpen(true)} />} />
      </Routes>
      {!isHome && <SiteFooter />}
      {/* Quiz modal for non-homepage routes */}
      {!isHome && quizOpen && <QuizModalWrapper onClose={() => setQuizOpen(false)} />}
    </>
  );
}

/* Quiz modal for sub-pages — matches homepage styling exactly */
function QuizModalWrapper({ onClose }) {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [windowType, setWindowType] = useState('');
  const [timeline, setTimeline] = useState('');
  const [form, setForm] = useState({ first: '', last: '', email: '', phone: '' });

  const C = { navy:"#3d4b65", sage:"#8a9d89", cream:"#f4f1ea", offwhite:"#e6e6e6", white:"#ffffff" };
  const fontDisplay = `"Space Grotesk",sans-serif`;
  const fontSerif = `"Fraunces","Playfair Display",Georgia,serif`;
  const fontSans = `"Inter",system-ui,-apple-system,sans-serif`;

  const GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/EmqV3yHGqNtAgSD5vZXQ/webhook-trigger/2f29cb6a-7ba0-4132-88e4-53c79c2fd356";

  const toggleSvc = (val) => setServices(prev => prev.includes(val) ? prev.filter(s => s !== val) : [...prev, val]);
  const nextAfterServices = () => services.includes('window_cleaning') ? '1b' : 2;
  const prevBeforeTimeline = () => services.includes('window_cleaning') ? '1b' : 1;
  const goTo = (s) => setStep(s);
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const formatPhone = (raw) => {
    const digits = raw.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0,3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
  };
  const handlePhoneChange = (e) => setForm({ ...form, phone: formatPhone(e.target.value) });
  const phoneDigits = form.phone.replace(/\D/g, '');
  const formValid = form.first && form.last && isValidEmail(form.email) && phoneDigits.length === 10;

  const handleSubmit = () => {
    fetch(GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: form.first, last_name: form.last, email: form.email,
        phone: form.phone.replace(/\D/g, ''), services: services.join(', '),
        window_type: windowType || 'N/A', timeline,
        source: window.location.pathname,
      }),
    }).catch(err => console.error('Webhook error:', err));
    setStep('done');
  };

  const stepProgress = { 1: 10, '1b': 50, 2: 50, 3: 90, done: 100 };
  const progressPct = stepProgress[step] ?? 0;

  const svcItems = [
    { val: 'window_cleaning', label: 'Window Cleaning' },
    { val: 'solar_cleaning', label: 'Solar Cleaning' },
    { val: 'bird_proofing', label: 'Bird Proofing' },
    { val: 'holiday_lighting', label: 'Holiday Lighting' },
  ];

  return (
    <>
      <style>{`
        @keyframes qmModalIn{from{opacity:0;transform:scale(.96) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes qmOverlayIn{from{opacity:0}to{opacity:1}}
        .qm-overlay{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;animation:qmOverlayIn .3s ease}
        .qm-modal{width:100%;max-width:720px;max-height:90vh;overflow-y:auto;border-radius:28px;background:${C.white};box-shadow:0 30px 80px rgba(0,0,0,.2);animation:qmModalIn .4s cubic-bezier(.22,1,.36,1)}
        .qm-progress{padding:24px 32px 0;padding-right:60px}
        .qm-bar-track{width:100%;height:6px;border-radius:99px;background:${C.offwhite};overflow:hidden}
        .qm-bar-fill{height:100%;border-radius:99px;background:${C.sage};transition:width .8s cubic-bezier(.22,1,.36,1)}
        .qm-body{padding:40px 32px 36px}
        .qm-title{font-family:${fontSerif};font-size:clamp(24px,5vw,34px);font-weight:600;letter-spacing:-.02em;margin-bottom:8px;color:${C.navy}}
        .qm-sub{font-size:15px;font-weight:500;color:rgba(61,75,101,.55);margin-bottom:28px}
        .qm-card-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-bottom:28px}
        .qm-timeline-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:28px}
        .qm-card{position:relative;border:3px solid ${C.offwhite};border-radius:18px;padding:28px 16px;text-align:center;cursor:pointer;transition:all .25s cubic-bezier(.22,1,.36,1);background:${C.white};user-select:none}
        .qm-card:hover{border-color:${C.sage};transform:translateY(-3px);box-shadow:0 8px 24px rgba(138,157,137,.15)}
        .qm-card.sel{border-color:${C.navy};background:rgba(61,75,101,.04);box-shadow:0 4px 16px rgba(61,75,101,.12)}
        .qm-card-label{font-family:${fontDisplay};font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${C.navy}}
        .qm-card-desc{font-size:12px;font-weight:500;color:rgba(61,75,101,.5);margin-top:4px}
        .qm-form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .qm-input{width:100%;padding:15px 18px;border:2px solid ${C.offwhite};border-radius:14px;font-family:${fontSans};font-size:16px;font-weight:500;color:${C.navy};background:${C.white};outline:none;transition:border-color .2s,box-shadow .2s}
        .qm-input::placeholder{color:rgba(61,75,101,.3)}
        .qm-input:focus{border-color:${C.sage};box-shadow:0 0 0 4px rgba(138,157,137,.12)}
        .qm-label{display:block;font-family:${fontDisplay};font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(61,75,101,.45);margin-bottom:7px}
        .qm-next{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:18px 32px;border-radius:999px;border:none;font-family:${fontDisplay};font-size:15px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;transition:all .3s cubic-bezier(.22,1,.36,1)}
        .qm-next.primary{background:${C.sage};color:${C.navy};box-shadow:0 12px 32px rgba(138,157,137,.3)}
        .qm-next.primary:hover{background:${C.navy};color:${C.cream};transform:translateY(-2px)}
        .qm-next.primary:disabled{opacity:.35;cursor:not-allowed;transform:none;box-shadow:none}
        .qm-next.submit{background:${C.navy};color:${C.cream};box-shadow:0 12px 32px rgba(61,75,101,.25)}
        .qm-next.submit:hover{background:${C.sage};color:${C.navy};transform:translateY(-2px)}
        .qm-next.submit:disabled{opacity:.35;cursor:not-allowed;transform:none}
        .qm-back{display:inline-flex;align-items:center;gap:4px;font-family:${fontDisplay};font-size:13px;font-weight:500;color:${C.sage};background:none;border:none;cursor:pointer;margin-bottom:20px;transition:color .2s}
        .qm-back:hover{color:${C.navy}}
        .qm-close{position:absolute;top:18px;right:18px;width:36px;height:36px;border-radius:50%;background:rgba(61,75,101,.08);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s;z-index:2}
        .qm-close:hover{background:rgba(61,75,101,.15)}
        @media(max-width:768px){
          .qm-card-grid{grid-template-columns:1fr!important}
          .qm-timeline-grid{grid-template-columns:1fr!important}
          .qm-form-row{grid-template-columns:1fr!important}
          .qm-body{padding:32px 20px 28px!important}
        }
      `}</style>
      <div className="qm-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="qm-modal" style={{ position: 'relative' }}>
          <button className="qm-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          {/* Progress */}
          <div className="qm-progress">
            <div className="qm-bar-track">
              <div className="qm-bar-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          {/* Step 1: Services */}
          {step === 1 && (
            <div className="qm-body" key="s1">
              <h2 className="qm-title">What service are you interested in?</h2>
              <p className="qm-sub">Select all that apply</p>
              <div className="qm-card-grid">
                {svcItems.map(s => (
                  <div key={s.val} className={`qm-card ${services.includes(s.val) ? 'sel' : ''}`} onClick={() => toggleSvc(s.val)}>
                    <div className="qm-card-label">{s.label}</div>
                  </div>
                ))}
              </div>
              <button className="qm-next primary" disabled={services.length === 0} onClick={() => goTo(nextAfterServices())}>
                Next <span style={{fontSize:18}}>→</span>
              </button>
            </div>
          )}

          {/* Step 1b: Window type */}
          {step === '1b' && (
            <div className="qm-body" key="s1b">
              <button className="qm-back" onClick={() => goTo(1)}>← Back</button>
              <h2 className="qm-title">What type of window cleaning?</h2>
              <p className="qm-sub">Choose one</p>
              <div className="qm-card-grid">
                {[
                  { val: 'outsides_only', label: 'Outsides Only', desc: 'Exterior windows & frames' },
                  { val: 'insides_and_outsides', label: 'Insides & Outsides', desc: 'Full interior + exterior clean' },
                ].map(o => (
                  <div key={o.val} className={`qm-card ${windowType === o.val ? 'sel' : ''}`} onClick={() => setWindowType(o.val)}>
                    <div className="qm-card-label">{o.label}</div>
                    <div className="qm-card-desc">{o.desc}</div>
                  </div>
                ))}
              </div>
              <button className="qm-next primary" disabled={!windowType} onClick={() => goTo(2)}>
                Next <span style={{fontSize:18}}>→</span>
              </button>
            </div>
          )}

          {/* Step 2: Timeline */}
          {step === 2 && (
            <div className="qm-body" key="s2">
              <button className="qm-back" onClick={() => goTo(prevBeforeTimeline())}>← Back</button>
              <h2 className="qm-title">How soon do you need this done?</h2>
              <p className="qm-sub">Choose one</p>
              <div className="qm-timeline-grid">
                {[
                  { val: 'asap', label: 'ASAP', desc: 'As soon as possible' },
                  { val: '1_2_weeks', label: '1–2 Weeks', desc: 'Schedule me in' },
                  { val: 'just_info', label: 'Just Info', desc: 'Getting info for now' },
                ].map(o => (
                  <div key={o.val} className={`qm-card ${timeline === o.val ? 'sel' : ''}`} onClick={() => setTimeline(o.val)}>
                    <div className="qm-card-label">{o.label}</div>
                    <div className="qm-card-desc">{o.desc}</div>
                  </div>
                ))}
              </div>
              <button className="qm-next primary" disabled={!timeline} onClick={() => goTo(3)}>
                Next <span style={{fontSize:18}}>→</span>
              </button>
            </div>
          )}

          {/* Step 3: Contact */}
          {step === 3 && (
            <div className="qm-body" key="s3">
              <button className="qm-back" onClick={() => goTo(2)}>← Back</button>
              <h2 className="qm-title">Let's get to know you!</h2>
              <p className="qm-sub">We'll reach out with your personalized quote</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
                <div className="qm-form-row">
                  <div>
                    <label className="qm-label">First Name</label>
                    <input className="qm-input" placeholder="Jack" value={form.first} onChange={e => setForm({...form, first: e.target.value})} />
                  </div>
                  <div>
                    <label className="qm-label">Last Name</label>
                    <input className="qm-input" placeholder="Smith" value={form.last} onChange={e => setForm({...form, last: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="qm-label">Email</label>
                  <input className="qm-input" type="email" placeholder="jack@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    style={form.email && !isValidEmail(form.email) ? {borderColor:'#c97070'} : {}} />
                  {form.email && !isValidEmail(form.email) && <span style={{fontSize:12,color:'#c97070',marginTop:4,display:'block'}}>Please enter a valid email</span>}
                </div>
                <div>
                  <label className="qm-label">Phone Number</label>
                  <input className="qm-input" type="tel" placeholder="(760) 555-1234" value={form.phone} onChange={handlePhoneChange} maxLength={14} />
                  {form.phone && phoneDigits.length < 10 && phoneDigits.length > 0 && <span style={{fontSize:12,color:`${C.navy}66`,marginTop:4,display:'block'}}>{10 - phoneDigits.length} digits remaining</span>}
                </div>
              </div>
              <button className="qm-next submit" disabled={!formValid} onClick={handleSubmit}>
                Get My Quote <span style={{fontSize:18}}>→</span>
              </button>
              <p style={{ fontSize: 11, color: `${C.navy}55`, textAlign: 'center', marginTop: 16, lineHeight: 1.5 }}>
                By submitting, you agree to receive communications from Peace Solar & Window Cleaning.
              </p>
            </div>
          )}

          {/* Done */}
          {step === 'done' && (
            <div className="qm-body" key="sdone" style={{ textAlign: 'center', padding: '60px 32px' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: `${C.sage}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={C.sage} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2 className="qm-title">You're all set!</h2>
              <p className="qm-sub" style={{ marginBottom: 0 }}>We'll be in touch shortly with your personalized quote. Welcome to the Peace family.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </StrictMode>,
)
