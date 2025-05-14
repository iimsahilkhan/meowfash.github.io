import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { CartItemWithProduct } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

type CartContextType = {
  items: CartItemWithProduct[];
  itemCount: number;
  subtotal: number;
  sessionId: string | null;
  isLoading: boolean;
  addItem: (productId: number, quantity: number, size?: string, color?: string) => Promise<void>;
  updateItemQuantity: (id: number, quantity: number) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [itemCount, setItemCount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  // Load cart on initial render
  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      setIsLoading(true);
      const response = await fetch('/api/cart', {
        headers: sessionId ? { sessionId } : {},
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      
      const data = await response.json();
      setItems(data.items);
      setItemCount(data.itemCount);
      setSubtotal(data.subtotal);
      setSessionId(data.sessionId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load your shopping cart",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function addItem(productId: number, quantity: number, size?: string, color?: string) {
    try {
      setIsLoading(true);
      const response = await apiRequest('POST', '/api/cart/add', {
        productId,
        quantity,
        size,
        color
      });
      
      const data = await response.json();
      setItems(data.items);
      setItemCount(data.itemCount);
      setSubtotal(data.subtotal);
      setSessionId(data.sessionId);
      
      toast({
        title: "Item added to cart",
        description: "Your item has been added to the cart",
      });
      
      setIsCartOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function updateItemQuantity(id: number, quantity: number) {
    try {
      setIsLoading(true);
      const response = await apiRequest('PUT', `/api/cart/update/${id}`, { quantity });
      
      const data = await response.json();
      setItems(data.items);
      setItemCount(data.itemCount);
      setSubtotal(data.subtotal);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item quantity",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function removeItem(id: number) {
    try {
      setIsLoading(true);
      const response = await apiRequest('DELETE', `/api/cart/remove/${id}`);
      
      const data = await response.json();
      setItems(data.items);
      setItemCount(data.itemCount);
      setSubtotal(data.subtotal);
      
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function clearCart() {
    try {
      setIsLoading(true);
      const response = await apiRequest('DELETE', '/api/cart/clear');
      
      const data = await response.json();
      setItems(data.items);
      setItemCount(data.itemCount);
      setSubtotal(data.subtotal);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        sessionId,
        isLoading,
        addItem,
        updateItemQuantity,
        removeItem,
        clearCart,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
