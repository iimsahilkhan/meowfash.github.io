import { ProductReview } from "@shared/schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

type ReviewFormData = {
  productId: number;
  rating: number;
  title: string;
  comment: string;
  username?: string;
};

export function useProductReviews(productId: number) {
  // Fetch reviews for a product
  const { 
    data: reviews = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['/api/reviews/product', productId],
    queryFn: async () => {
      // apiRequest takes method first, then URL
      const response = await apiRequest('GET', `/api/reviews/product/${productId}`);
      const data = await response.json();
      return data as ProductReview[];
    },
    enabled: !!productId,
  });

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum: number, review: ProductReview) => sum + review.rating, 0) / reviews.length
    : 0;

  // Add review mutation
  const addReviewMutation = useMutation({
    mutationFn: async (reviewData: ReviewFormData) => {
      return apiRequest('POST', '/api/reviews/add', reviewData);
    },
    onSuccess: () => {
      // Refetch reviews and invalidate product details to update rating
      refetch();
      queryClient.invalidateQueries({ queryKey: ['/api/products', productId] });
      
      toast({
        title: "Review Submitted",
        description: "Thank you for your review!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Could not submit your review",
        variant: "destructive",
      });
      console.error(error);
    }
  });

  // Submit a new review
  async function submitReview(reviewData: ReviewFormData) {
    await addReviewMutation.mutateAsync(reviewData);
  }

  return {
    reviews,
    isLoading,
    averageRating,
    submitReview,
    isSubmitting: addReviewMutation.isPending
  };
}