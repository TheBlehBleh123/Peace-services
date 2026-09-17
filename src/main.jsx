import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import App from './App.jsx'
import ServicePage from './pages/ServicePage.jsx'
import AreaPage from './pages/AreaPage.jsx'
import GiveawayPage from './pages/GiveawayPage.jsx'
import { SiteNavbar, SiteFooter } from './components/Layout.jsx'
import QuizModal from './components/QuizModal.jsx'

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Root() {
  const [quizOpen, setQuizOpen] = useState(false);
  const location = useLocation();
  // Pages that render with their OWN built-in layout (no shared site navbar/footer):
  // the homepage and the giveaway landing page.
  const bareLayout =
    location.pathname === "/" || location.pathname === "/holiday-giveaway";

  return (
    <>
      <ScrollToTop />
      {/* Homepage + landing page use their own built-in layout; other pages use the shared navbar */}
      {!bareLayout && <SiteNavbar onQuizOpen={() => setQuizOpen(true)} />}
      <Routes>
        <Route path="/" element={<App externalQuizOpen={quizOpen} onExternalQuizClose={() => setQuizOpen(false)} />} />
        <Route path="/holiday-giveaway" element={<GiveawayPage />} />
        <Route path="/services/:slug" element={<ServicePage onQuizOpen={() => setQuizOpen(true)} />} />
        <Route path="/areas/:slug" element={<AreaPage onQuizOpen={() => setQuizOpen(true)} />} />
        {/* Service+city combo redirects */}
        <Route path="/solar-cleaning/california/*" element={<Navigate to="/services/solar-panel-cleaning" replace />} />
        <Route path="/window-cleaning/california/*" element={<Navigate to="/services/window-cleaning" replace />} />
        <Route path="/bird-proofing/california/*" element={<Navigate to="/services/bird-proofing" replace />} />
        <Route path="/holiday-lighting/california/*" element={<Navigate to="/services/holiday-lighting" replace />} />
        {/* Catch-all: redirect unknown routes to homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!bareLayout && <SiteFooter />}
      {/* Quiz modal for non-homepage routes */}
      {!bareLayout && quizOpen && <QuizModal onClose={() => setQuizOpen(false)} />}
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
