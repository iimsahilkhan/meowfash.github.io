import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative">
      {/* Hero background image */}
      <div 
        className="w-full h-[70vh] bg-cover bg-center" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')" 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-transparent flex items-center">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="lg:max-w-lg text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat mb-4">
                Summer Collection 2023
              </h1>
              <p className="text-lg md:text-xl mb-8">
                Discover the hottest styles for the season
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  asChild
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90"
                >
                  <Link href="/shop">SHOP NOW</Link>
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/20"
                >
                  <Link href="/lookbook">EXPLORE</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
