import { 
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  cartItems, type CartItem, type InsertCartItem, type CartItemWithProduct,
  wishlistItems, type WishlistItem, type InsertWishlistItem, type WishlistItemWithProduct,
  productReviews, type ProductReview, type InsertProductReview
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProductsBySubcategory(subcategory: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getNewArrivals(): Promise<Product[]>;
  getBestSellers(): Promise<Product[]>;
  getOnSaleProducts(): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Cart operations
  getCartItems(sessionId: string): Promise<CartItemWithProduct[]>;
  getCartItem(id: number): Promise<CartItem | undefined>;
  addCartItem(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;

  // Wishlist operations
  getWishlistItems(sessionId: string): Promise<WishlistItemWithProduct[]>;
  getWishlistItem(id: number): Promise<WishlistItem | undefined>;
  isInWishlist(sessionId: string, productId: number): Promise<boolean>;
  addWishlistItem(item: InsertWishlistItem): Promise<WishlistItem>;
  removeWishlistItem(id: number): Promise<boolean>;
  clearWishlist(sessionId: string): Promise<boolean>;

  // Product review operations
  getProductReviews(productId: number): Promise<ProductReview[]>;
  addProductReview(review: InsertProductReview): Promise<ProductReview>;
  updateProductRating(productId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private wishlistItems: Map<number, WishlistItem>;
  private productReviews: Map<number, ProductReview>;
  private userId: number;
  private productId: number;
  private cartItemId: number;
  private wishlistItemId: number;
  private reviewId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.wishlistItems = new Map();
    this.productReviews = new Map();
    this.userId = 1;
    this.productId = 1;
    this.cartItemId = 1;
    this.wishlistItemId = 1;
    this.reviewId = 1;
    
    // Initialize with some sample products
    this.initializeProducts();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { 
      ...insertUser, 
      id,
      fullName: insertUser.fullName || null,
      address: insertUser.address || null,
      city: insertUser.city || null,
      state: insertUser.state || null,
      zipCode: insertUser.zipCode || null,
      country: insertUser.country || null,
      phone: insertUser.phone || null
    };
    this.users.set(id, user);
    return user;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
  }

  async getProductsBySubcategory(subcategory: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.subcategory?.toLowerCase() === subcategory.toLowerCase()
    );
  }

  async getFeaturedProducts(): Promise<Product[]> {
    // Return a mix of best sellers and new arrivals
    return Array.from(this.products.values()).filter(
      (product) => product.isBestSeller || product.isNewArrival
    ).slice(0, 8);
  }

  async getNewArrivals(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.isNewArrival
    );
  }

  async getBestSellers(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.isBestSeller
    );
  }

  async getOnSaleProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.isOnSale
    );
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      (product) => 
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description?.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery) ||
        product.subcategory?.toLowerCase().includes(lowerQuery)
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const product: Product = { 
      ...insertProduct, 
      id,
      description: insertProduct.description || null,
      salePrice: insertProduct.salePrice || null,
      subcategory: insertProduct.subcategory || null,
      isNewArrival: insertProduct.isNewArrival || false,
      isBestSeller: insertProduct.isBestSeller || false,
      isOnSale: insertProduct.isOnSale || false,
      inStock: insertProduct.inStock || true,
      rating: insertProduct.rating || 0,
      reviewCount: insertProduct.reviewCount || 0
    };
    this.products.set(id, product);
    return product;
  }

  // Cart operations
  async getCartItems(sessionId: string): Promise<CartItemWithProduct[]> {
    const items = Array.from(this.cartItems.values()).filter(
      (item) => item.sessionId === sessionId
    );
    
    return items.map(item => {
      const product = this.products.get(item.productId);
      if (!product) {
        throw new Error(`Product with id ${item.productId} not found`);
      }
      return { ...item, product };
    });
  }

  async getCartItem(id: number): Promise<CartItem | undefined> {
    return this.cartItems.get(id);
  }

  async addCartItem(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if product exists
    const product = this.products.get(insertItem.productId);
    if (!product) {
      throw new Error(`Product with id ${insertItem.productId} not found`);
    }
    
    // Check if the item already exists in the cart
    const existingItem = Array.from(this.cartItems.values()).find(
      (item) => 
        item.sessionId === insertItem.sessionId && 
        item.productId === insertItem.productId &&
        item.size === insertItem.size &&
        item.color === insertItem.color
    );
    
    if (existingItem) {
      // Update quantity instead of adding a new item
      existingItem.quantity += (insertItem.quantity || 1);
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    }
    
    // Create new cart item
    const id = this.cartItemId++;
    const cartItem: CartItem = { 
      ...insertItem, 
      id,
      userId: insertItem.userId || null,
      quantity: insertItem.quantity || 1,
      size: insertItem.size || null,
      color: insertItem.color || null
    };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) {
      return undefined;
    }
    
    if (quantity <= 0) {
      this.cartItems.delete(id);
      return undefined;
    }
    
    cartItem.quantity = quantity;
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async removeCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const items = Array.from(this.cartItems.values()).filter(
      (item) => item.sessionId === sessionId
    );
    
    for (const item of items) {
      this.cartItems.delete(item.id);
    }
    
    return true;
  }

  // Wishlist operations
  async getWishlistItems(sessionId: string): Promise<WishlistItemWithProduct[]> {
    const items = Array.from(this.wishlistItems.values()).filter(
      (item) => item.sessionId === sessionId
    );
    
    return items.map(item => {
      const product = this.products.get(item.productId);
      if (!product) {
        throw new Error(`Product with id ${item.productId} not found`);
      }
      return { ...item, product };
    });
  }

  async getWishlistItem(id: number): Promise<WishlistItem | undefined> {
    return this.wishlistItems.get(id);
  }

  async isInWishlist(sessionId: string, productId: number): Promise<boolean> {
    return Array.from(this.wishlistItems.values()).some(
      item => item.sessionId === sessionId && item.productId === productId
    );
  }

  async addWishlistItem(insertItem: InsertWishlistItem): Promise<WishlistItem> {
    // Check if product exists
    const product = this.products.get(insertItem.productId);
    if (!product) {
      throw new Error(`Product with id ${insertItem.productId} not found`);
    }
    
    // Check if the item already exists in the wishlist
    const existingItem = Array.from(this.wishlistItems.values()).find(
      (item) => 
        item.sessionId === insertItem.sessionId && 
        item.productId === insertItem.productId
    );
    
    if (existingItem) {
      // Return existing item if already in wishlist
      return existingItem;
    }
    
    // Create new wishlist item
    const id = this.wishlistItemId++;
    const now = new Date();
    const wishlistItem: WishlistItem = { 
      ...insertItem, 
      id,
      userId: insertItem.userId || null,
      addedAt: now
    };
    
    this.wishlistItems.set(id, wishlistItem);
    return wishlistItem;
  }

  async removeWishlistItem(id: number): Promise<boolean> {
    return this.wishlistItems.delete(id);
  }

  async clearWishlist(sessionId: string): Promise<boolean> {
    const items = Array.from(this.wishlistItems.values()).filter(
      (item) => item.sessionId === sessionId
    );
    
    for (const item of items) {
      this.wishlistItems.delete(item.id);
    }
    
    return true;
  }

  // Product review operations
  async getProductReviews(productId: number): Promise<ProductReview[]> {
    return Array.from(this.productReviews.values()).filter(
      (review) => review.productId === productId
    );
  }

  async addProductReview(insertReview: InsertProductReview): Promise<ProductReview> {
    // Check if product exists
    const product = this.products.get(insertReview.productId);
    if (!product) {
      throw new Error(`Product with id ${insertReview.productId} not found`);
    }
    
    // Create new review
    const id = this.reviewId++;
    const now = new Date();
    const review: ProductReview = { 
      ...insertReview, 
      id,
      userId: insertReview.userId || null, 
      createdAt: now,
      username: insertReview.username || "Anonymous"
    };
    
    this.productReviews.set(id, review);
    
    // Update product rating
    await this.updateProductRating(insertReview.productId);
    
    return review;
  }

  async updateProductRating(productId: number): Promise<void> {
    const product = this.products.get(productId);
    if (!product) {
      throw new Error(`Product with id ${productId} not found`);
    }
    
    const reviews = Array.from(this.productReviews.values()).filter(
      (review) => review.productId === productId
    );
    
    if (reviews.length === 0) {
      return;
    }
    
    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    // Update product
    product.rating = parseFloat(averageRating.toFixed(1));
    product.reviewCount = reviews.length;
    
    this.products.set(productId, product);
  }

  // Initialize with sample products
  private initializeProducts() {
    const sampleProducts: InsertProduct[] = [
      {
        name: "Cat Print Summer Dress",
        description: "A beautiful cat-patterned summer dress perfect for showing off your feline fashion sense.",
        price: 49.99,
        imageUrl: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "women",
        subcategory: "dresses",
        isNewArrival: true,
        isBestSeller: false,
        isOnSale: false,
        rating: 4,
        reviewCount: 42
      },
      {
        name: "Men's Cat Motif Blazer",
        description: "A stylish casual blazer with subtle cat embroidery that adds personality to any outfit.",
        price: 89.99,
        imageUrl: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "men",
        subcategory: "jackets",
        isNewArrival: false,
        isBestSeller: true,
        isOnSale: false,
        rating: 4.5,
        reviewCount: 87
      },
      {
        name: "Kitty Paw Blouse",
        description: "A versatile white blouse with adorable kitty paw details on the collar and cuffs.",
        price: 39.99,
        imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "women",
        subcategory: "tops",
        isNewArrival: false,
        isBestSeller: false,
        isOnSale: false,
        rating: 4,
        reviewCount: 23
      },
      {
        name: "Cat Whisker Denim Jeans",
        description: "Timeless denim jeans with cat whisker fading details and a comfortable stretch fit.",
        price: 59.99,
        salePrice: 45.99,
        imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "men",
        subcategory: "pants",
        isNewArrival: false,
        isBestSeller: false,
        isOnSale: true,
        rating: 5,
        reviewCount: 56
      },
      {
        name: "Cat Striped Summer Shirt",
        description: "A cool and breezy shirt with cat-shaped stripes for hot summer days.",
        price: 34.99,
        imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "men",
        subcategory: "shirts",
        isNewArrival: true,
        isBestSeller: false,
        isOnSale: false,
        rating: 4,
        reviewCount: 18
      },
      {
        name: "Feline Grace Evening Gown",
        description: "A stunning evening gown with cat silhouette embellishments for special occasions.",
        price: 129.99,
        salePrice: 99.99,
        imageUrl: "https://images.unsplash.com/photo-1490091119006-53a458e64019?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "women",
        subcategory: "dresses",
        isNewArrival: false,
        isBestSeller: false,
        isOnSale: true,
        rating: 4.5,
        reviewCount: 36
      },
      {
        name: "Cat Face Crossbody Bag",
        description: "A stylish and practical leather crossbody bag with cat face design for the cat lover.",
        price: 79.99,
        imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "accessories",
        subcategory: "bags",
        isNewArrival: false,
        isBestSeller: true,
        isOnSale: false,
        rating: 4.5,
        reviewCount: 62
      },
      {
        name: "Kitten Ears Knit Sweater",
        description: "A cozy knit sweater with adorable kitten ear details on the hood, perfect for cat lovers.",
        price: 54.99,
        salePrice: 42.99,
        imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "women",
        subcategory: "sweaters",
        isNewArrival: false,
        isBestSeller: false,
        isOnSale: true,
        rating: 4,
        reviewCount: 29
      },
      {
        name: "Cat Paw Watch",
        description: "A sleek minimalist watch with cat paw hour markers that complements any outfit.",
        price: 119.99,
        imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "accessories",
        subcategory: "watches",
        isNewArrival: true,
        isBestSeller: true,
        isOnSale: false,
        rating: 5,
        reviewCount: 48
      },
      {
        name: "Cat Pounce Sneakers",
        description: "Comfortable athletic sneakers with cat paw print soles that leave cute tracks when you walk.",
        price: 89.99,
        imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "accessories",
        subcategory: "shoes",
        isNewArrival: true,
        isBestSeller: false,
        isOnSale: false,
        rating: 4.5,
        reviewCount: 37
      },
      {
        name: "Catnip Scented T-Shirt",
        description: "A comfortable cotton t-shirt with a playful cat graphic and a subtle catnip scent that cats love.",
        price: 29.99,
        imageUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "men",
        subcategory: "t-shirts",
        isNewArrival: true,
        isBestSeller: false,
        isOnSale: false,
        rating: 4.2,
        reviewCount: 28
      },
      {
        name: "Cat Eye Sunglasses",
        description: "Classic cat eye sunglasses with UV protection and a stylish feline flair.",
        price: 35.99,
        imageUrl: "https://images.unsplash.com/photo-1577803645773-f96470509666?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "accessories",
        subcategory: "eyewear",
        isNewArrival: false,
        isBestSeller: true,
        isOnSale: false,
        rating: 4.8,
        reviewCount: 53
      },
      {
        name: "9 Lives Leather Jacket",
        description: "A premium leather jacket with '9 Lives' embroidered on the back and subtle cat details.",
        price: 199.99,
        salePrice: 149.99,
        imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "men",
        subcategory: "jackets",
        isNewArrival: false,
        isBestSeller: false,
        isOnSale: true,
        rating: 4.9,
        reviewCount: 42
      },
      {
        name: "Meow Meow Beanie",
        description: "A warm knitted beanie with cat ears and 'Meow Meow' text, perfect for cold weather.",
        price: 24.99,
        imageUrl: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "accessories",
        subcategory: "hats",
        isNewArrival: true,
        isBestSeller: false,
        isOnSale: false,
        rating: 4.3,
        reviewCount: 21
      },
      {
        name: "Purr-fect Pajama Set",
        description: "A comfortable pajama set with an all-over cat print design for the ultimate cat nap.",
        price: 45.99,
        imageUrl: "https://images.unsplash.com/photo-1618333842686-06ecfd094e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "women",
        subcategory: "sleepwear",
        isNewArrival: false,
        isBestSeller: true,
        isOnSale: false,
        rating: 4.7,
        reviewCount: 68
      }
    ];
    
    for (const product of sampleProducts) {
      this.createProduct(product);
    }
  }
}

export const storage = new MemStorage();
