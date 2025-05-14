import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function PromoBanner() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would send a request to the server
    toast({
      title: "Success!",
      description: "Thank you for subscribing! Your discount code has been sent to your email.",
    });
    
    setEmail("");
  };

  return (
    <section className="py-24 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold font-montserrat mb-4">Get 25% Off Your First Order</h2>
          <p className="text-lg mb-8">Sign up for our newsletter and receive an exclusive discount code</p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Input
              type="email"
              placeholder="Your email address"
              className="py-3 px-6 rounded-md text-primary focus:outline-none focus:ring-2 focus:ring-secondary min-w-0 flex-1 max-w-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              className="bg-secondary hover:bg-secondary/90 text-white font-montserrat font-medium"
              size="lg"
            >
              SUBSCRIBE
            </Button>
          </form>
          <p className="text-sm mt-4 text-gray-300">By subscribing, you agree to our Privacy Policy</p>
        </div>
      </div>
    </section>
  );
}
