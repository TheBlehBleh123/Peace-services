import { useState } from "react";
import {
  Check, X, ArrowRight, Sun, Wind, Snowflake,
  ShieldCheck, ChevronLeft, Zap, Calendar, Info, XIcon,
} from "lucide-react";
import { C, fontSerif, fontSans, fontDisplay, GHL_WEBHOOK_URL } from "../data/siteData";

/* ═══ QUIZ MODAL STYLES ═══ */
export const QuizStyles = () => (
  <style>{`
    /* Quiz Modal */
    @keyframes modalIn{from{opacity:0;transform:scale(.96) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}
    @keyframes overlayIn{from{opacity:0}to{opacity:1}}
    .quiz-overlay{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;animation:overlayIn .3s ease}
    .quiz-modal{width:100%;max-width:720px;max-height:90vh;overflow-y:auto;border-radius:28px;background:${C.white};box-shadow:0 30px 80px rgba(0,0,0,.2);animation:modalIn .4s cubic-bezier(.22,1,.36,1)}
    .quiz-progress{padding:24px 32px 0;padding-right:60px}
    .quiz-bar-track{width:100%;height:6px;border-radius:99px;background:${C.offwhite};overflow:hidden}
    .quiz-bar-fill{height:100%;border-radius:99px;background:${C.sage};transition:width .8s cubic-bezier(.22,1,.36,1)}
    .quiz-body{padding:40px 32px 36px}
    .quiz-title{font-family:${fontSerif};font-size:clamp(24px,5vw,34px);font-weight:600;letter-spacing:-.02em;margin-bottom:8px;color:${C.navy}}
    .quiz-sub{font-size:15px;font-weight:500;color:rgba(61,75,101,.55);margin-bottom:28px}
    .quiz-card-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-bottom:28px}
    .quiz-timeline-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:28px}
    .qcard{position:relative;border:3px solid ${C.offwhite};border-radius:18px;padding:28px 16px;text-align:center;cursor:pointer;transition:all .25s cubic-bezier(.22,1,.36,1);background:${C.white};user-select:none}
    .qcard:hover{border-color:${C.sage};transform:translateY(-3px);box-shadow:0 8px 24px rgba(138,157,137,.15)}
    .qcard.sel{border-color:${C.navy};background:rgba(61,75,101,.04);box-shadow:0 4px 16px rgba(61,75,101,.12)}
    .qcard-icon{width:52px;height:52px;margin:0 auto 12px;border-radius:50%;background:rgba(138,157,137,.12);display:flex;align-items:center;justify-content:center;transition:background .25s}
    .qcard.sel .qcard-icon{background:${C.sage}}
    .qcard.sel .qcard-icon svg{color:${C.white}!important}
    .qcard-check{position:absolute;top:10px;right:10px;width:22px;height:22px;border-radius:50%;background:${C.navy};display:none;align-items:center;justify-content:center}
    .qcard.sel .qcard-check{display:flex}
    .qcard-label{font-family:${fontDisplay};font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${C.navy}}
    .qcard-desc{font-size:12px;font-weight:500;color:rgba(61,75,101,.5);margin-top:4px}
    .quiz-form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    .quiz-input{width:100%;padding:15px 18px;border:2px solid ${C.offwhite};border-radius:14px;font-family:${fontSans};font-size:16px;font-weight:500;color:${C.navy};background:${C.white};outline:none;transition:border-color .2s,box-shadow .2s}
    .quiz-input::placeholder{color:rgba(61,75,101,.3)}
    .quiz-input:focus{border-color:${C.sage};box-shadow:0 0 0 4px rgba(138,157,137,.12)}
    .quiz-label{display:block;font-family:${fontDisplay};font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(61,75,101,.45);margin-bottom:7px}
    .quiz-next{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:18px 32px;border-radius:999px;border:none;font-family:${fontDisplay};font-size:15px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;transition:all .3s cubic-bezier(.22,1,.36,1)}
    .quiz-next.primary{background:${C.sage};color:${C.navy};box-shadow:0 12px 32px rgba(138,157,137,.3)}
    .quiz-next.primary:hover{background:${C.navy};color:${C.cream};transform:translateY(-2px)}
    .quiz-next.primary:disabled{opacity:.35;cursor:not-allowed;transform:none;box-shadow:none}
    .quiz-next.submit{background:${C.navy};color:${C.cream};box-shadow:0 12px 32px rgba(61,75,101,.25)}
    .quiz-next.submit:hover{background:${C.sage};color:${C.navy};transform:translateY(-2px)}
    .quiz-next.submit:disabled{opacity:.35;cursor:not-allowed;transform:none}
    .quiz-back{display:inline-flex;align-items:center;gap:4px;font-family:${fontDisplay};font-size:13px;font-weight:500;color:${C.sage};background:none;border:none;cursor:pointer;margin-bottom:20px;transition:color .2s}
    .quiz-back:hover{color:${C.navy}}
    .quiz-close{position:absolute;top:18px;right:18px;width:36px;height:36px;border-radius:50%;background:rgba(61,75,101,.08);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s;z-index:2}
    .quiz-close:hover{background:rgba(61,75,101,.15)}
    @media(max-width:768px){
      .quiz-card-grid{grid-template-columns:1fr!important}
      .quiz-timeline-grid{grid-template-columns:1fr!important}
      .quiz-form-row{grid-template-columns:1fr!important}
      .quiz-body{padding:32px 20px 28px!important}
    }
  `}</style>
);

export default function QuizModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [windowType, setWindowType] = useState('');
  const [timeline, setTimeline] = useState('');
  const [form, setForm] = useState({ first: '', last: '', email: '', phone: '' });

  const toggleSvc = (val) => {
    setServices(prev => prev.includes(val) ? prev.filter(s => s !== val) : [...prev, val]);
  };

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
  const handlePhoneChange = (e) => {
    setForm({ ...form, phone: formatPhone(e.target.value) });
  };
  const phoneDigits = form.phone.replace(/\D/g, '');

  const formValid = form.first && form.last && isValidEmail(form.email) && phoneDigits.length === 10;

  const handleSubmit = () => {
    const data = {
      first_name: form.first,
      last_name: form.last,
      email: form.email,
      phone: form.phone.replace(/\D/g, ''),
      services: services.join(', '),
      window_type: windowType || 'N/A',
      timeline: timeline,
      source: window.location.pathname,
    };
    console.log('Quiz submitted:', data);

    if (GHL_WEBHOOK_URL && GHL_WEBHOOK_URL !== "PASTE_YOUR_WEBHOOK_URL_HERE") {
      fetch(GHL_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).catch(err => console.error('Webhook error:', err));
    }

    setStep('done');
  };

  const stepProgress = { 1: 10, '1b': 50, 2: 50, 3: 90, done: 100 };
  const progressPct = stepProgress[step] ?? 0;

  const svcItems = [
    { val: 'window_cleaning', label: 'Window Cleaning', icon: <Wind size={24} color={C.sage} /> },
    { val: 'solar_cleaning', label: 'Solar Cleaning', icon: <Sun size={24} color={C.sage} /> },
    { val: 'bird_proofing', label: 'Bird Proofing', icon: <ShieldCheck size={24} color={C.sage} /> },
    { val: 'holiday_lighting', label: 'Holiday Lighting', icon: <Snowflake size={24} color={C.sage} /> },
  ];

  return (
    <>
      <QuizStyles />
      <div className="quiz-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="quiz-modal" style={{ position: 'relative' }}>
          <button className="quiz-close" onClick={onClose}><XIcon size={18} color={C.navy} /></button>

          {/* Progress */}
          <div className="quiz-progress">
            <div className="quiz-bar-track">
              <div className="quiz-bar-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          {/* Step 1: Services */}
          {step === 1 && (
            <div className="quiz-body" key="s1">
              <h2 className="quiz-title">What service are you interested in?</h2>
              <p className="quiz-sub">Select all that apply</p>
              <div className="quiz-card-grid">
                {svcItems.map(s => (
                  <div key={s.val} className={`qcard ${services.includes(s.val) ? 'sel' : ''}`} onClick={() => toggleSvc(s.val)}>
                    <div className="qcard-check"><Check size={13} color="#fff" /></div>
                    <div className="qcard-icon">{s.icon}</div>
                    <div className="qcard-label">{s.label}</div>
                  </div>
                ))}
              </div>
              <button className="quiz-next primary" disabled={services.length === 0} onClick={() => goTo(nextAfterServices())}>
                Next <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* Step 1b: Window type */}
          {step === '1b' && (
            <div className="quiz-body" key="s1b">
              <button className="quiz-back" onClick={() => goTo(1)}><ChevronLeft size={16} /> Back</button>
              <h2 className="quiz-title">What type of window cleaning?</h2>
              <p className="quiz-sub">Choose one</p>
              <div className="quiz-card-grid">
                {[
                  { val: 'outsides_only', label: 'Outsides Only', desc: 'Exterior windows & frames' },
                  { val: 'insides_and_outsides', label: 'Insides & Outsides', desc: 'Full interior + exterior clean' },
                ].map(o => (
                  <div key={o.val} className={`qcard ${windowType === o.val ? 'sel' : ''}`} onClick={() => setWindowType(o.val)}>
                    <div className="qcard-icon"><Wind size={24} color={C.sage} /></div>
                    <div className="qcard-label">{o.label}</div>
                    <div className="qcard-desc">{o.desc}</div>
                  </div>
                ))}
              </div>
              <button className="quiz-next primary" disabled={!windowType} onClick={() => goTo(2)}>
                Next <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* Step 2: Timeline */}
          {step === 2 && (
            <div className="quiz-body" key="s2">
              <button className="quiz-back" onClick={() => goTo(prevBeforeTimeline())}><ChevronLeft size={16} /> Back</button>
              <h2 className="quiz-title">How soon do you need this done?</h2>
              <p className="quiz-sub">Choose one</p>
              <div className="quiz-timeline-grid">
                {[
                  { val: 'asap', label: 'ASAP', desc: 'As soon as possible', icon: <Zap size={24} color={C.sage} /> },
                  { val: '1_2_weeks', label: '1–2 Weeks', desc: 'Schedule me in', icon: <Calendar size={24} color={C.sage} /> },
                  { val: 'just_info', label: 'Just Info', desc: 'Getting info for now', icon: <Info size={24} color={C.sage} /> },
                ].map(o => (
                  <div key={o.val} className={`qcard ${timeline === o.val ? 'sel' : ''}`} onClick={() => setTimeline(o.val)}>
                    <div className="qcard-icon">{o.icon}</div>
                    <div className="qcard-label">{o.label}</div>
                    <div className="qcard-desc">{o.desc}</div>
                  </div>
                ))}
              </div>
              <button className="quiz-next primary" disabled={!timeline} onClick={() => goTo(3)}>
                Next <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* Step 3: Contact */}
          {step === 3 && (
            <div className="quiz-body" key="s3">
              <button className="quiz-back" onClick={() => goTo(2)}><ChevronLeft size={16} /> Back</button>
              <h2 className="quiz-title">Let's get to know you!</h2>
              <p className="quiz-sub">We'll reach out with your personalized quote</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
                <div className="quiz-form-row">
                  <div>
                    <label className="quiz-label">First Name</label>
                    <input className="quiz-input" placeholder="Jack" value={form.first} onChange={e => setForm({ ...form, first: e.target.value })} />
                  </div>
                  <div>
                    <label className="quiz-label">Last Name</label>
                    <input className="quiz-input" placeholder="Smith" value={form.last} onChange={e => setForm({ ...form, last: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="quiz-label">Email</label>
                  <input className="quiz-input" type="email" placeholder="jack@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    style={form.email && !isValidEmail(form.email) ? {borderColor:'#c97070'} : {}} />
                  {form.email && !isValidEmail(form.email) && <span style={{fontSize:12,color:'#c97070',marginTop:4,display:'block'}}>Please enter a valid email</span>}
                </div>
                <div>
                  <label className="quiz-label">Phone Number</label>
                  <input className="quiz-input" type="tel" placeholder="(760) 555-1234" value={form.phone} onChange={handlePhoneChange} maxLength={14} />
                  {form.phone && phoneDigits.length < 10 && phoneDigits.length > 0 && <span style={{fontSize:12,color:`${C.navy}66`,marginTop:4,display:'block'}}>{10 - phoneDigits.length} digits remaining</span>}
                </div>
              </div>
              <button className="quiz-next submit" disabled={!formValid} onClick={handleSubmit}>
                Get My Quote <ArrowRight size={18} />
              </button>
              <p style={{ fontSize: 11, color: `${C.navy}55`, textAlign: 'center', marginTop: 16, lineHeight: 1.5 }}>
                By submitting, you agree to receive communications from Peace Solar & Window Cleaning.
              </p>
            </div>
          )}

          {/* Done */}
          {step === 'done' && (
            <div className="quiz-body" key="sdone" style={{ textAlign: 'center', padding: '60px 32px' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: `${C.sage}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Check size={36} color={C.sage} />
              </div>
              <h2 className="quiz-title">You're all set!</h2>
              <p className="quiz-sub" style={{ marginBottom: 0 }}>We'll be in touch shortly with your personalized quote. Welcome to the Peace family.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
