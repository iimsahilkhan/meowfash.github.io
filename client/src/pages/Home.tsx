import { Helmet } from "react-helmet";
import HeroSection from "@/components/HeroSection";
import CategoryCards from "@/components/CategoryCards";
import FeaturedProducts from "@/components/FeaturedProducts";
import PromoBanner from "@/components/PromoBanner";
import StoreFeatures from "@/components/StoreFeatures";
import InstagramFeed from "@/components/InstagramFeed";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>MEOWTH FASHION | Cat-themed Clothing Store</title>
        <meta name="description" content="Discover the latest trends and purr-fect styles for every occasion at MEOWTH FASHION, your go-to cat-themed clothing store." />
      </Helmet>
      
      <HeroSection />
      <CategoryCards />
      <FeaturedProducts />
      <PromoBanner />
      <StoreFeatures />
      <InstagramFeed />
    </>
  );
}
