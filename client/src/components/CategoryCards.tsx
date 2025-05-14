import { Link } from "wouter";

export default function CategoryCards() {
  const categories = [
    {
      title: "Women's Collection",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80",
      link: "/shop?category=women"
    },
    {
      title: "Men's Collection",
      image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80",
      link: "/shop?category=men"
    },
    {
      title: "Accessories",
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80",
      link: "/shop?category=accessories"
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold font-montserrat text-center mb-12">Shop By Category</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div key={index} className="group relative overflow-hidden rounded-lg h-96">
              <img 
                src={category.image} 
                alt={category.title}
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent flex items-end p-8">
                <div>
                  <h3 className="text-white text-2xl font-bold font-montserrat mb-2">
                    {category.title}
                  </h3>
                  <Link 
                    href={category.link}
                    className="inline-block text-white border-b-2 border-secondary font-medium pb-1 hover:text-secondary transition"
                  >
                    SHOP NOW
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
