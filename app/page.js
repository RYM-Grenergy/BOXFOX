import Navbar from "./components/Navbar";
import HeroBanner from "./components/HeroBanner";
import CategorySection from "./components/CategorySection";
import ProductSection from "./components/ProductSection";
import FeaturesStrip from "./components/FeaturesStrip";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroBanner />
        <FeaturesStrip />
        <CategorySection />


        <ProductSection />
      </main>
      <Footer />
    </div>
  );
}

