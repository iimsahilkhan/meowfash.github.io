import { FaInstagram } from "react-icons/fa";

export default function InstagramFeed() {
  const instagramPosts = [
    {
      image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      link: "#"
    },
    {
      image: "https://images.unsplash.com/photo-1544441893-675973e31985?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      link: "#"
    },
    {
      image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      link: "#"
    },
    {
      image: "https://images.unsplash.com/photo-1504198458649-3128b932f49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      link: "#"
    },
    {
      image: "https://images.unsplash.com/photo-1528834342297-fdefb02b2a83?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      link: "#"
    },
    {
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      link: "#"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-montserrat mb-4">Follow Our Style</h2>
          <p className="text-neutral-dark max-w-2xl mx-auto">
            Share your style with <span className="text-secondary">#MeowthFashion</span> for a chance to be featured on our page
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {instagramPosts.map((post, index) => (
            <div key={index} className="aspect-square overflow-hidden group relative">
              <img 
                src={post.image} 
                alt="Instagram fashion post" 
                className="w-full h-full object-cover"
              />
              <a 
                href={post.link} 
                className="absolute inset-0 bg-primary/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                <FaInstagram className="text-white text-2xl" />
              </a>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <a 
            href="https://instagram.com/meowthfashion" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary hover:text-secondary transition font-montserrat font-medium"
          >
            <FaInstagram className="mr-2" /> @MEOWTHFASHION
          </a>
        </div>
      </div>
    </section>
  );
}
