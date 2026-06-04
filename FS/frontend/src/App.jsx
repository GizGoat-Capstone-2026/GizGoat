import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import PublicLayout from './components/layout/PublicLayout';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import WelcomePage from './pages/WelcomePage';
import BMIPage from './pages/BMIPage';
import SleepShowcasePage from './pages/SleepShowcasePage';
import AIShowcasePage from './pages/AIShowcasePage';
import DashboardPage from './pages/DashboardPage';
import CaloriePage from './pages/CaloriePage';
import SleepPage from './pages/SleepPage';
import RecommendationsPage from './pages/RecommendationsPage';
import ActivityPage from './pages/ActivityPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Routes with Navbar and Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/bmi" element={<BMIPage />} />
          <Route path="/features/sleep" element={<SleepShowcasePage />} />
          <Route path="/features/ai" element={<AIShowcasePage />} />
        </Route>
        
        {/* Auth Routes without Layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/welcome" element={<WelcomePage />} />

        {/* Protected Routes with Sidebar and Mobile Nav */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/calculator" element={<BMIPage />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/calories" element={<CaloriePage />} />
          <Route path="/sleep" element={<SleepPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
