import { Routes, Route } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import DashboardLayout from "./components/DashboardLayout";

import Home from "./pages/Home";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Classifier from "./pages/Classifier";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      {/* Public Pages Layout */}
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Dashboard Pages Layout */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="classifier" element={<Classifier />} />
      </Route>
    </Routes>
  );
}
