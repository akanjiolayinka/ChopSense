// Top-level router. Public marketing routes plus the authed /app/* shell.

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import AppLayout from "./components/AppLayout.jsx";
import { ToastProvider } from "./components/Toast.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import MainApp from "./pages/App.jsx";
import Profile from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";

export default function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/app/onboarding" element={<Onboarding />} />
          <Route element={<AppLayout />}>
            <Route path="/app" element={<MainApp />} />
            <Route path="/app/profile" element={<Profile />} />
            <Route path="/app/settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  );
}
