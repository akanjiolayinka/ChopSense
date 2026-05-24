import DemoSection from "../components/DemoSection.jsx";
import FeaturesGrid from "../components/FeaturesGrid.jsx";
import Footer from "../components/Footer.jsx";
import Hero from "../components/Hero.jsx";
import HowItWorks from "../components/HowItWorks.jsx";
import Navbar from "../components/Navbar.jsx";
import ProblemSection from "../components/ProblemSection.jsx";

export default function Landing() {
  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <FeaturesGrid />
        <HowItWorks />
        <DemoSection />
      </main>
      <Footer />
    </div>
  );
}
