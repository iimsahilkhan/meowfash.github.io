import { createContext, ReactNode, useContext, useState } from "react";
import { Product, WishlistItemWithProduct } from "@shared/schema";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

type WishlistContextType = {
  items: WishlistItemWithProduct[];
  itemCount: number;
  sessionId: string | null;
  isLoading: boolean;
  isInWishlist: (productId: number) => boolean;
  addItem: (productId: number) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  clearWishlist: () => Promise<void>;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Fetch wishlist data
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['/api/wishlist'],
    enabled: true,
    refetchOnWindowFocus: false,
    select: (data: any) => data as { sessionId: string; items: WishlistItemWithProduct[] }
  });

  // Add to wishlist mutation
  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: number) => {
      return apiRequest('/api/wishlist/add', 'POST', { productId });
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Added to Wishlist",
        description: "Item was added to your wishlist",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Could not add item to wishlist",
        variant: "destructive",
      });
      console.error(error);
    }
  });

  // Remove from wishlist mutation
  const removeFromWishlistMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/wishlist/remove/${id}`, 'DELETE');
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Removed from Wishlist",
        description: "Item was removed from your wishlist",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Could not remove item from wishlist",
        variant: "destructive",
      });
      console.error(error);
    }
  });

  // Clear wishlist mutation
  const clearWishlistMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/wishlist/clear', 'DELETE');
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Wishlist Cleared",
        description: "Your wishlist has been cleared",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Could not clear wishlist",
        variant: "destructive",
      });
      console.error(error);
    }
  });

  // If we have wishlist data, extract session ID and items
  const items = data ? data.items : [];
  const itemCount = items.length;

  if (data && data.sessionId && !sessionId) {
    setSessionId(data.sessionId);
  }

  // Check if a product is in the wishlist
  function isInWishlist(productId: number): boolean {
    return items.some((item: WishlistItemWithProduct) => item.productId === productId);
  }

  // Add item to wishlist
  async function addItem(productId: number) {
    await addToWishlistMutation.mutateAsync(productId);
  }

  // Remove item from wishlist
  async function removeItem(id: number) {
    await removeFromWishlistMutation.mutateAsync(id);
  }

  // Clear wishlist
  async function clearWishlist() {
    await clearWishlistMutation.mutateAsync();
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        itemCount,
        sessionId,
        isLoading,
        isInWishlist,
        addItem,
        removeItem,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}