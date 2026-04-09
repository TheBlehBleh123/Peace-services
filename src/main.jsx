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

/* Lightweight quiz modal for sub-pages - reuses the GHL webhook */
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
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const formatPhone = (raw) => {
    const digits = raw.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0,3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
  };
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
  const svcItems = [
    { val: 'window_cleaning', label: 'Window Cleaning' },
    { val: 'solar_cleaning', label: 'Solar Cleaning' },
    { val: 'bird_proofing', label: 'Bird Proofing' },
    { val: 'holiday_lighting', label: 'Holiday Lighting' },
  ];

  return (
    <div className="quiz-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position:"fixed",inset:0,zIndex:100,background:"rgba(0,0,0,.55)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
      <div style={{ width:"100%",maxWidth:720,maxHeight:"90vh",overflowY:"auto",borderRadius:28,background:C.white,boxShadow:"0 30px 80px rgba(0,0,0,.2)",position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute",top:18,right:18,width:36,height:36,borderRadius:"50%",background:"rgba(61,75,101,.08)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2 }}>✕</button>

        {/* Progress */}
        <div style={{ padding:"24px 32px 0",paddingRight:60 }}>
          <div style={{ width:"100%",height:6,borderRadius:99,background:C.offwhite,overflow:"hidden" }}>
            <div style={{ height:"100%",borderRadius:99,background:C.sage,transition:"width .8s cubic-bezier(.22,1,.36,1)",width:`${stepProgress[step]||0}%` }} />
          </div>
        </div>

        <div style={{ padding:"40px 32px 36px" }}>
          {step === 1 && (
            <>
              <h2 style={{ fontFamily:fontSerif,fontSize:"clamp(24px,5vw,34px)",fontWeight:600,marginBottom:8,color:C.navy }}>What service are you interested in?</h2>
              <p style={{ fontSize:15,fontWeight:500,color:"rgba(61,75,101,.55)",marginBottom:28 }}>Select all that apply</p>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14,marginBottom:28 }}>
                {svcItems.map(s => (
                  <div key={s.val} onClick={() => toggleSvc(s.val)} style={{
                    border:`3px solid ${services.includes(s.val)?C.navy:C.offwhite}`,borderRadius:18,padding:"28px 16px",textAlign:"center",cursor:"pointer",
                    background:services.includes(s.val)?`rgba(61,75,101,.04)`:C.white,transition:"all .25s",
                  }}>
                    <div style={{ fontFamily:fontDisplay,fontSize:13,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",color:C.navy }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <button disabled={!services.length} onClick={() => setStep(nextAfterServices())} style={{
                width:"100%",padding:"18px 32px",borderRadius:999,border:"none",fontFamily:fontDisplay,fontSize:15,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",
                cursor:services.length?"pointer":"not-allowed",background:C.sage,color:C.navy,opacity:services.length?1:.35,
              }}>Next →</button>
            </>
          )}
          {step === '1b' && (
            <>
              <button onClick={() => setStep(1)} style={{ background:"none",border:"none",cursor:"pointer",color:C.sage,fontFamily:fontDisplay,fontSize:13,marginBottom:20 }}>← Back</button>
              <h2 style={{ fontFamily:fontSerif,fontSize:"clamp(24px,5vw,34px)",fontWeight:600,marginBottom:8,color:C.navy }}>What type of window cleaning?</h2>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14,marginBottom:28,marginTop:20 }}>
                {[{val:'outsides_only',label:'Outsides Only'},{val:'insides_and_outsides',label:'Insides & Outsides'}].map(o => (
                  <div key={o.val} onClick={() => setWindowType(o.val)} style={{
                    border:`3px solid ${windowType===o.val?C.navy:C.offwhite}`,borderRadius:18,padding:"28px 16px",textAlign:"center",cursor:"pointer",
                    background:windowType===o.val?`rgba(61,75,101,.04)`:C.white,
                  }}>
                    <div style={{ fontFamily:fontDisplay,fontSize:13,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",color:C.navy }}>{o.label}</div>
                  </div>
                ))}
              </div>
              <button disabled={!windowType} onClick={() => setStep(2)} style={{
                width:"100%",padding:"18px 32px",borderRadius:999,border:"none",fontFamily:fontDisplay,fontSize:15,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",
                cursor:windowType?"pointer":"not-allowed",background:C.sage,color:C.navy,opacity:windowType?1:.35,
              }}>Next →</button>
            </>
          )}
          {step === 2 && (
            <>
              <button onClick={() => setStep(prevBeforeTimeline())} style={{ background:"none",border:"none",cursor:"pointer",color:C.sage,fontFamily:fontDisplay,fontSize:13,marginBottom:20 }}>← Back</button>
              <h2 style={{ fontFamily:fontSerif,fontSize:"clamp(24px,5vw,34px)",fontWeight:600,marginBottom:8,color:C.navy }}>How soon do you need this done?</h2>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:28,marginTop:20 }}>
                {[{val:'asap',label:'ASAP'},{val:'1_2_weeks',label:'1–2 Weeks'},{val:'just_info',label:'Just Info'}].map(o => (
                  <div key={o.val} onClick={() => setTimeline(o.val)} style={{
                    border:`3px solid ${timeline===o.val?C.navy:C.offwhite}`,borderRadius:18,padding:"28px 16px",textAlign:"center",cursor:"pointer",
                    background:timeline===o.val?`rgba(61,75,101,.04)`:C.white,
                  }}>
                    <div style={{ fontFamily:fontDisplay,fontSize:13,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",color:C.navy }}>{o.label}</div>
                  </div>
                ))}
              </div>
              <button disabled={!timeline} onClick={() => setStep(3)} style={{
                width:"100%",padding:"18px 32px",borderRadius:999,border:"none",fontFamily:fontDisplay,fontSize:15,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",
                cursor:timeline?"pointer":"not-allowed",background:C.sage,color:C.navy,opacity:timeline?1:.35,
              }}>Next →</button>
            </>
          )}
          {step === 3 && (
            <>
              <button onClick={() => setStep(2)} style={{ background:"none",border:"none",cursor:"pointer",color:C.sage,fontFamily:fontDisplay,fontSize:13,marginBottom:20 }}>← Back</button>
              <h2 style={{ fontFamily:fontSerif,fontSize:"clamp(24px,5vw,34px)",fontWeight:600,marginBottom:8,color:C.navy }}>Let's get to know you!</h2>
              <p style={{ fontSize:15,fontWeight:500,color:"rgba(61,75,101,.55)",marginBottom:28 }}>We'll reach out with your personalized quote</p>
              <div style={{ display:"flex",flexDirection:"column",gap:16,marginBottom:28 }}>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
                  <div>
                    <label style={{ display:"block",fontFamily:fontDisplay,fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"rgba(61,75,101,.45)",marginBottom:7 }}>First Name</label>
                    <input placeholder="Jack" value={form.first} onChange={e => setForm({...form,first:e.target.value})}
                      style={{ width:"100%",padding:"15px 18px",border:`2px solid ${C.offwhite}`,borderRadius:14,fontFamily:fontSans,fontSize:16,fontWeight:500,color:C.navy,outline:"none" }} />
                  </div>
                  <div>
                    <label style={{ display:"block",fontFamily:fontDisplay,fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"rgba(61,75,101,.45)",marginBottom:7 }}>Last Name</label>
                    <input placeholder="Smith" value={form.last} onChange={e => setForm({...form,last:e.target.value})}
                      style={{ width:"100%",padding:"15px 18px",border:`2px solid ${C.offwhite}`,borderRadius:14,fontFamily:fontSans,fontSize:16,fontWeight:500,color:C.navy,outline:"none" }} />
                  </div>
                </div>
                <div>
                  <label style={{ display:"block",fontFamily:fontDisplay,fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"rgba(61,75,101,.45)",marginBottom:7 }}>Email</label>
                  <input type="email" placeholder="jack@email.com" value={form.email} onChange={e => setForm({...form,email:e.target.value})}
                    style={{ width:"100%",padding:"15px 18px",border:`2px solid ${form.email&&!isValidEmail(form.email)?'#c97070':C.offwhite}`,borderRadius:14,fontFamily:fontSans,fontSize:16,fontWeight:500,color:C.navy,outline:"none" }} />
                </div>
                <div>
                  <label style={{ display:"block",fontFamily:fontDisplay,fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"rgba(61,75,101,.45)",marginBottom:7 }}>Phone Number</label>
                  <input type="tel" placeholder="(760) 555-1234" value={form.phone} onChange={e => setForm({...form,phone:formatPhone(e.target.value)})} maxLength={14}
                    style={{ width:"100%",padding:"15px 18px",border:`2px solid ${C.offwhite}`,borderRadius:14,fontFamily:fontSans,fontSize:16,fontWeight:500,color:C.navy,outline:"none" }} />
                </div>
              </div>
              <button disabled={!formValid} onClick={handleSubmit} style={{
                width:"100%",padding:"18px 32px",borderRadius:999,border:"none",fontFamily:fontDisplay,fontSize:15,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",
                cursor:formValid?"pointer":"not-allowed",background:C.navy,color:C.cream,opacity:formValid?1:.35,
              }}>Get My Quote →</button>
            </>
          )}
          {step === 'done' && (
            <div style={{ textAlign:"center",padding:"40px 0" }}>
              <div style={{ width:72,height:72,borderRadius:"50%",background:`${C.sage}20`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",fontSize:36 }}>✓</div>
              <h2 style={{ fontFamily:fontSerif,fontSize:"clamp(24px,5vw,34px)",fontWeight:600,color:C.navy,marginBottom:8 }}>You're all set!</h2>
              <p style={{ fontSize:15,fontWeight:500,color:"rgba(61,75,101,.55)" }}>We'll be in touch shortly with your personalized quote. Welcome to the Peace family.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </StrictMode>,
)
