import { Truck, RotateCcw, Shield, Headphones } from "lucide-react";

export default function StoreFeatures() {
  const features = [
    {
      icon: <Truck className="h-10 w-10" />,
      title: "Free Shipping",
      description: "Free shipping on all orders over $75"
    },
    {
      icon: <RotateCcw className="h-10 w-10" />,
      title: "Easy Returns",
      description: "30-day hassle-free return policy"
    },
    {
      icon: <Shield className="h-10 w-10" />,
      title: "Secure Payment",
      description: "Multiple secure payment options"
    },
    {
      icon: <Headphones className="h-10 w-10" />,
      title: "Customer Support",
      description: "Support team available 24/7"
    }
  ];

  return (
    <section className="py-16 bg-neutral-light">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="text-secondary mb-4">
                {feature.icon}
              </div>
              <h3 className="font-montserrat font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-neutral-dark">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
