import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Product } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type FilterType = "all" | "new" | "best" | "sale";

export default function FeaturedProducts() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/featured-products"],
  });

  const filteredProducts = products?.filter(product => {
    if (activeFilter === "all") return true;
    if (activeFilter === "new") return product.isNewArrival;
    if (activeFilter === "best") return product.isBestSeller;
    if (activeFilter === "sale") return product.isOnSale;
    return true;
  }).slice(0, 4);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12 flex-wrap">
          <h2 className="text-3xl font-bold font-montserrat">Featured Products</h2>
          
          <div className="hidden md:flex space-x-4">
            {[
              { id: "all", label: "ALL" },
              { id: "new", label: "NEW ARRIVALS" },
              { id: "best", label: "BEST SELLERS" },
              { id: "sale", label: "ON SALE" }
            ].map((filter) => (
              <button
                key={filter.id}
                className={cn(
                  "font-montserrat font-medium transition",
                  activeFilter === filter.id ? "text-secondary" : "text-neutral-dark hover:text-secondary"
                )}
                onClick={() => setActiveFilter(filter.id as FilterType)}
              >
                {filter.label}
              </button>
            ))}
          </div>
          
          <div className="md:hidden mt-4 w-full">
            <select 
              className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-secondary w-full"
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value as FilterType)}
            >
              <option value="all">ALL</option>
              <option value="new">NEW ARRIVALS</option>
              <option value="best">BEST SELLERS</option>
              <option value="sale">ON SALE</option>
            </select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-4">
                <Skeleton className="w-full h-96 rounded-lg" />
                <Skeleton className="w-3/4 h-5" />
                <div className="flex justify-between">
                  <Skeleton className="w-1/4 h-5" />
                  <Skeleton className="w-1/4 h-5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Button
            asChild
            variant="outline"
            className="border-2 border-primary hover:bg-primary hover:text-white"
          >
            <Link href="/shop">VIEW ALL PRODUCTS</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
