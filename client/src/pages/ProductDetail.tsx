import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Product, ProductReview } from "@shared/schema";
import { useCart } from "@/hooks/useCart";
import { 
  Share, 
  ShoppingBag, 
  Star, 
  StarHalf,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ProductCard";
import WishlistButton from "@/components/WishlistButton";
import ReviewForm from "@/components/ReviewForm";
import { useProductReviews } from "@/hooks/useProductReviews";
import { toast } from "@/hooks/use-toast";

export default function ProductDetail() {
  const { id } = useParams();
  const productId = parseInt(id || "0");
  const { addItem } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  // Get product reviews
  const { reviews, isLoading: isReviewsLoading, submitReview, isSubmitting } = useProductReviews(productId);
  
  const { data: product, isLoading: isProductLoading } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
  });
  
  const { data: relatedProducts, isLoading: isRelatedLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    select: (products) => 
      products
        .filter(p => p.id !== productId && p.category === product?.category)
        .slice(0, 4),
    enabled: !!product,
  });
  
  const handleAddToCart = () => {
    if (product) {
      addItem(product.id, quantity, selectedSize, selectedColor);
    }
  };
  
  const handleSubmitReview = async (data: { title: string; comment: string; username: string; rating: number }) => {
    if (!product) return;
    
    try {
      await submitReview({
        productId: product.id,
        ...data
      });
      
      toast({
        title: "Review Submitted",
        description: "Thank you for sharing your feedback!",
      });
      
      setShowReviewForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem submitting your review.",
        variant: "destructive",
      });
      console.error(error);
    }
  };
  
  const renderStars = (rating: number | null) => {
    if (rating === null || rating === undefined) {
      rating = 0;
    }
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="fill-accent text-accent" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="fill-accent text-accent" />);
    }

    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="text-accent" />);
    }

    return stars;
  };
  
  if (isProductLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/2">
            <Skeleton className="w-full aspect-square rounded-lg" />
          </div>
          <div className="md:w-1/2">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/4 mb-6" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-6" />
            <div className="mb-6">
              <Skeleton className="h-10 w-32 rounded" />
            </div>
            <div className="mb-6">
              <Skeleton className="h-10 w-full rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Button asChild className="bg-secondary hover:bg-secondary/90">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>{product.name} | MEOWTH FASHION</title>
        <meta name="description" content={product.description || `Shop ${product.name} at MEOWTH FASHION. ${product.category} fashion for every occasion.`} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center text-sm mb-4 text-neutral-dark">
          <Link href="/" className="hover:text-secondary transition">Home</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link href="/shop" className="hover:text-secondary transition">Shop</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link 
            href={`/shop?category=${product.category}`} 
            className="hover:text-secondary transition capitalize"
          >
            {product.category}
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="truncate max-w-[200px]">{product.name}</span>
        </div>
        
        <div className="flex flex-col md:flex-row gap-12">
          {/* Product Image */}
          <div className="md:w-1/2">
            <div className="rounded-lg overflow-hidden">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          
          {/* Product Details */}
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold font-montserrat mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex mr-2">
                {renderStars(product.rating)}
              </div>
              <span className="text-neutral-dark">({product.reviewCount} reviews)</span>
            </div>
            
            <div className="mb-6">
              {product.salePrice ? (
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-secondary mr-3">
                    ${product.salePrice.toFixed(2)}
                  </span>
                  <span className="text-lg text-neutral-dark line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="ml-3 bg-primary text-white text-sm px-2 py-1 rounded">
                    Save ${(product.price - product.salePrice).toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-secondary">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            
            <p className="text-neutral-dark mb-6">{product.description}</p>
            
            {product.isNewArrival && (
              <div className="inline-block bg-secondary text-white px-3 py-1 text-sm font-medium rounded-full mb-4">
                NEW ARRIVAL
              </div>
            )}
            
            {product.isBestSeller && (
              <div className="inline-block bg-accent text-primary px-3 py-1 text-sm font-medium rounded-full mb-4 ml-2">
                BEST SELLER
              </div>
            )}
            
            <div className="mb-6">
              <p className="font-montserrat font-medium mb-2">Size</p>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XS">XS</SelectItem>
                  <SelectItem value="S">S</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="XL">XL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="mb-6">
              <p className="font-montserrat font-medium mb-2">Color</p>
              <Select value={selectedColor} onValueChange={setSelectedColor}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Black">Black</SelectItem>
                  <SelectItem value="White">White</SelectItem>
                  <SelectItem value="Blue">Blue</SelectItem>
                  <SelectItem value="Red">Red</SelectItem>
                  <SelectItem value="Green">Green</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="mb-6 flex items-center">
              <p className="font-montserrat font-medium mr-4">Quantity</p>
              <div className="flex items-center border rounded">
                <button 
                  className="px-3 py-1 text-neutral-dark hover:text-secondary"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="px-4 py-1">{quantity}</span>
                <button 
                  className="px-3 py-1 text-neutral-dark hover:text-secondary"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <Button 
                className="bg-secondary hover:bg-secondary/90 flex-grow md:flex-grow-0"
                size="lg"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="mr-2 h-5 w-5" /> ADD TO CART
              </Button>
              <WishlistButton 
                productId={product.id}
                variant="outline"
                size="icon"
                className="border-2"
              />
              <Button 
                variant="outline"
                size="icon"
                className="border-2"
              >
                <Share className="h-5 w-5" />
              </Button>
            </div>
            
            <Separator className="my-6" />
            
            <div className="text-sm text-neutral-dark">
              <p className="mb-2">
                <span className="font-semibold">Category:</span>{" "}
                <Link 
                  href={`/shop?category=${product.category}`}
                  className="hover:text-secondary transition capitalize"
                >
                  {product.category}
                </Link>
              </p>
              {product.subcategory && (
                <p className="mb-2">
                  <span className="font-semibold">Subcategory:</span>{" "}
                  <Link 
                    href={`/shop?subcategory=${product.subcategory}`}
                    className="hover:text-secondary transition capitalize"
                  >
                    {product.subcategory}
                  </Link>
                </p>
              )}
              <p>
                <span className="font-semibold">Tags:</span>{" "}
                <Link href="/shop?tag=fashion" className="hover:text-secondary transition">
                  fashion
                </Link>
                , 
                <Link href={`/shop?category=${product.category}`} className="hover:text-secondary transition ml-1">
                  {product.category}
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-16">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start border-b rounded-none">
              <TabsTrigger value="description" className="font-montserrat">Description</TabsTrigger>
              <TabsTrigger value="details" className="font-montserrat">Product Details</TabsTrigger>
              <TabsTrigger value="reviews" className="font-montserrat">Reviews ({product.reviewCount})</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="py-6">
              <div className="prose max-w-none">
                <h3 className="text-xl font-montserrat font-bold mb-4">Product Description</h3>
                <p className="mb-4">{product.description}</p>
                <p>
                  Experience the perfect blend of style and comfort with our {product.name}. 
                  Made with high-quality materials and attention to detail, this {product.category} 
                  piece is designed to make you look and feel your best.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="details" className="py-6">
              <div className="prose max-w-none">
                <h3 className="text-xl font-montserrat font-bold mb-4">Product Details</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Premium quality materials</li>
                  <li>Comfortable fit and feel</li>
                  <li>Durable construction</li>
                  <li>Easy care and maintenance</li>
                  <li>Designed with attention to detail</li>
                </ul>
                <h4 className="text-lg font-montserrat font-bold mt-6 mb-2">Sizing Information</h4>
                <p>This item fits true to size. We recommend selecting your normal size.</p>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="py-6">
              <div className="prose max-w-none">
                <h3 className="text-xl font-montserrat font-bold mb-4">Customer Reviews</h3>
                <div className="flex items-center mb-6">
                  <div className="flex mr-2">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-neutral-dark">Based on {product.reviewCount} reviews</span>
                </div>
                
                {/* Review form */}
                {showReviewForm ? (
                  <ReviewForm 
                    productId={productId}
                    onSubmit={handleSubmitReview}
                    onCancel={() => setShowReviewForm(false)}
                  />
                ) : (
                  <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
                    <h4 className="text-lg font-montserrat font-bold mb-4">Write a Review</h4>
                    <p className="text-sm text-neutral-dark mb-4">
                      Share your experience with this product and help other shoppers make better decisions.
                    </p>
                    <Button 
                      className="bg-secondary hover:bg-secondary/90"
                      onClick={() => setShowReviewForm(true)}
                    >
                      Write a Review
                    </Button>
                  </div>
                )}
                
                {/* Reviews list */}
                <div className="space-y-6">
                  {isReviewsLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                  ) : reviews && reviews.length > 0 ? (
                    reviews.map((review: ProductReview) => (
                      <div key={review.id} className="border-b pb-6 last:border-b-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h5 className="font-bold">{review.title}</h5>
                            <div className="flex items-center mt-1">
                              <div className="flex mr-2">
                                {renderStars(review.rating)}
                              </div>
                              <span className="text-sm text-neutral-dark">
                                by {review.username}
                              </span>
                            </div>
                          </div>
                          <div className="text-sm text-neutral-dark">
                            {new Date(review.createdAt || "").toLocaleDateString()}
                          </div>
                        </div>
                        <p className="mt-2">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-neutral-dark">
                      <p>No reviews yet. Be the first to review this product!</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold font-montserrat mb-8">You May Also Like</h2>
          
          {isRelatedLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-4">
                  <Skeleton className="w-full h-72 rounded-lg" />
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
              {relatedProducts && relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
