import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertCartItemSchema } from "@shared/schema";
import { v4 as uuidv4 } from "uuid";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all products
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching products" });
    }
  });

  // Get product by ID
  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Error fetching product" });
    }
  });

  // Get products by category
  app.get("/api/products/category/:category", async (req: Request, res: Response) => {
    try {
      const category = req.params.category;
      const products = await storage.getProductsByCategory(category);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching products by category" });
    }
  });

  // Get featured products (for homepage)
  app.get("/api/featured-products", async (req: Request, res: Response) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching featured products" });
    }
  });

  // Get new arrivals
  app.get("/api/products/new-arrivals", async (req: Request, res: Response) => {
    try {
      const products = await storage.getNewArrivals();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching new arrivals" });
    }
  });

  // Get best sellers
  app.get("/api/products/best-sellers", async (req: Request, res: Response) => {
    try {
      const products = await storage.getBestSellers();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching best sellers" });
    }
  });

  // Get on sale products
  app.get("/api/products/on-sale", async (req: Request, res: Response) => {
    try {
      const products = await storage.getOnSaleProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching on sale products" });
    }
  });

  // Search products
  app.get("/api/products/search/:query", async (req: Request, res: Response) => {
    try {
      const query = req.params.query;
      const products = await storage.searchProducts(query);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error searching products" });
    }
  });

  // Cart endpoints
  // Helper function to ensure a session ID exists
  const ensureSessionId = (req: Request): string => {
    if (!req.headers.sessionid) {
      const sessionId = uuidv4();
      req.headers.sessionid = sessionId;
      return sessionId;
    }
    return req.headers.sessionid as string;
  };

  // Get cart items
  app.get("/api/cart", async (req: Request, res: Response) => {
    try {
      const sessionId = ensureSessionId(req);
      const cartItems = await storage.getCartItems(sessionId);
      
      // Calculate totals
      const subtotal = cartItems.reduce(
        (sum, item) => sum + (item.product.salePrice || item.product.price) * item.quantity, 
        0
      );
      
      res.json({ 
        sessionId,
        items: cartItems, 
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        subtotal
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching cart items" });
    }
  });

  // Add item to cart
  app.post("/api/cart/add", async (req: Request, res: Response) => {
    try {
      const sessionId = ensureSessionId(req);
      
      // Validate request body using zod
      const cartItemSchema = insertCartItemSchema.extend({
        productId: z.number(),
        quantity: z.number().min(1),
        size: z.string().optional(),
        color: z.string().optional()
      });
      
      const validatedData = cartItemSchema.parse({
        ...req.body,
        sessionId: sessionId
      });
      
      const cartItem = await storage.addCartItem(validatedData);
      const cartItems = await storage.getCartItems(sessionId);
      
      // Calculate totals
      const subtotal = cartItems.reduce(
        (sum, item) => sum + (item.product.salePrice || item.product.price) * item.quantity, 
        0
      );
      
      res.json({ 
        sessionId,
        items: cartItems, 
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        subtotal,
        addedItem: cartItem
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
      }
      res.status(500).json({ message: "Error adding item to cart" });
    }
  });

  // Update cart item quantity
  app.put("/api/cart/update/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const quantity = parseInt(req.body.quantity);
      
      if (isNaN(quantity) || quantity < 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      
      const sessionId = ensureSessionId(req);
      
      if (quantity === 0) {
        await storage.removeCartItem(id);
      } else {
        await storage.updateCartItemQuantity(id, quantity);
      }
      
      const cartItems = await storage.getCartItems(sessionId);
      
      // Calculate totals
      const subtotal = cartItems.reduce(
        (sum, item) => sum + (item.product.salePrice || item.product.price) * item.quantity, 
        0
      );
      
      res.json({ 
        sessionId,
        items: cartItems, 
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        subtotal
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating cart item" });
    }
  });

  // Remove item from cart
  app.delete("/api/cart/remove/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const sessionId = ensureSessionId(req);
      
      await storage.removeCartItem(id);
      const cartItems = await storage.getCartItems(sessionId);
      
      // Calculate totals
      const subtotal = cartItems.reduce(
        (sum, item) => sum + (item.product.salePrice || item.product.price) * item.quantity, 
        0
      );
      
      res.json({ 
        sessionId,
        items: cartItems, 
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        subtotal
      });
    } catch (error) {
      res.status(500).json({ message: "Error removing cart item" });
    }
  });

  // Clear cart
  app.delete("/api/cart/clear", async (req: Request, res: Response) => {
    try {
      const sessionId = ensureSessionId(req);
      
      await storage.clearCart(sessionId);
      
      res.json({ 
        sessionId,
        items: [], 
        itemCount: 0,
        subtotal: 0
      });
    } catch (error) {
      res.status(500).json({ message: "Error clearing cart" });
    }
  });

  // Checkout (mock process)
  app.post("/api/checkout", async (req: Request, res: Response) => {
    try {
      const sessionId = ensureSessionId(req);
      const cartItems = await storage.getCartItems(sessionId);
      
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
      
      // Validate checkout data
      const checkoutSchema = z.object({
        fullName: z.string().min(1, "Full name is required"),
        email: z.string().email("Invalid email address"),
        address: z.string().min(1, "Address is required"),
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        zipCode: z.string().min(1, "Zip code is required"),
        country: z.string().min(1, "Country is required"),
        paymentMethod: z.string().min(1, "Payment method is required")
      });
      
      const validatedData = checkoutSchema.parse(req.body);
      
      // Calculate totals
      const subtotal = cartItems.reduce(
        (sum, item) => sum + (item.product.salePrice || item.product.price) * item.quantity, 
        0
      );
      
      const shipping = subtotal >= 75 ? 0 : 9.99;
      const total = subtotal + shipping;
      
      // In a real app, we would process payment and create an order
      // For now, we'll just clear the cart and return a success message
      await storage.clearCart(sessionId);
      
      res.json({
        success: true,
        orderId: `ORD-${Date.now()}`,
        orderDetails: {
          customer: validatedData,
          items: cartItems,
          subtotal,
          shipping,
          total
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid checkout data", errors: error.errors });
      }
      res.status(500).json({ message: "Error processing checkout" });
    }
  });

  // Wishlist routes
  app.get("/api/wishlist", async (req: Request, res: Response) => {
    try {
      const sessionId = ensureSessionId(req);
      const wishlistItems = await storage.getWishlistItems(sessionId);
      res.json({
        sessionId,
        items: wishlistItems
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching wishlist items" });
    }
  });

  app.post("/api/wishlist/add", async (req: Request, res: Response) => {
    try {
      const sessionId = ensureSessionId(req);
      const { productId } = req.body;
      
      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }
      
      const wishlistItem = await storage.addWishlistItem({
        sessionId,
        productId
      });
      
      const wishlistItems = await storage.getWishlistItems(sessionId);
      
      res.json({
        sessionId,
        items: wishlistItems,
        added: wishlistItem
      });
    } catch (error) {
      res.status(500).json({ message: "Error adding item to wishlist" });
    }
  });

  app.delete("/api/wishlist/remove/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const sessionId = ensureSessionId(req);
      
      await storage.removeWishlistItem(id);
      const wishlistItems = await storage.getWishlistItems(sessionId);
      
      res.json({
        sessionId,
        items: wishlistItems
      });
    } catch (error) {
      res.status(500).json({ message: "Error removing wishlist item" });
    }
  });

  app.delete("/api/wishlist/clear", async (req: Request, res: Response) => {
    try {
      const sessionId = ensureSessionId(req);
      
      await storage.clearWishlist(sessionId);
      
      res.json({
        sessionId,
        items: []
      });
    } catch (error) {
      res.status(500).json({ message: "Error clearing wishlist" });
    }
  });

  // Product reviews routes
  app.get("/api/reviews/product/:productId", async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.productId);
      const reviews = await storage.getProductReviews(productId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Error fetching product reviews" });
    }
  });

  app.post("/api/reviews/add", async (req: Request, res: Response) => {
    try {
      const sessionId = ensureSessionId(req);
      
      // Validate review data
      const reviewSchema = z.object({
        productId: z.number(),
        rating: z.number().min(1).max(5),
        title: z.string().min(1, "Review title is required"),
        comment: z.string().min(1, "Review comment is required"),
        username: z.string().optional()
      });
      
      const validatedData = reviewSchema.parse({
        ...req.body,
        username: req.body.username || "Anonymous"
      });
      
      const review = await storage.addProductReview({
        sessionId,
        ...validatedData
      });
      
      const reviews = await storage.getProductReviews(validatedData.productId);
      
      res.json({
        review,
        reviews
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      res.status(500).json({ message: "Error adding product review" });
    }
  });
  
  const httpServer = createServer(app);
  
  return httpServer;
}
