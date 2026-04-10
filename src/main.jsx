import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import App from './App.jsx'
import ServicePage from './pages/ServicePage.jsx'
import AreaPage from './pages/AreaPage.jsx'
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
      {!isHome && quizOpen && <QuizModal onClose={() => setQuizOpen(false)} />}
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
