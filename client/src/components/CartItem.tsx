import { useState } from "react";
import { Link } from "wouter";
import { CartItemWithProduct } from "@shared/schema";
import { useCart } from "@/hooks/useCart";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartItemProps {
  item: CartItemWithProduct;
  isOverlay?: boolean;
}

export default function CartItem({ item, isOverlay = false }: CartItemProps) {
  const { updateItemQuantity, removeItem } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
    updateItemQuantity(item.id, newQuantity);
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  const product = item.product;
  const price = product.salePrice || product.price;
  const totalPrice = price * item.quantity;

  return (
    <div className={`flex ${isOverlay ? 'mb-6 pb-6 border-b' : 'mb-8 pb-8 border-b'}`}>
      <Link href={`/product/${product.id}`} className="block">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-20 h-24 object-cover rounded"
        />
      </Link>
      <div className="ml-4 flex-grow">
        <div className="flex justify-between">
          <Link href={`/product/${product.id}`} className="font-montserrat font-medium hover:text-secondary">
            {product.name}
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRemove}
            className="text-neutral-dark hover:text-secondary"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>
        <p className="text-neutral-dark text-sm mb-1">
          {item.size && `Size: ${item.size}`}
          {item.size && item.color && " | "}
          {item.color && `Color: ${item.color}`}
        </p>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center border rounded">
            <Button
              variant="ghost"
              size="sm"
              className="px-2 py-0 h-8 hover:text-secondary"
              onClick={() => handleQuantityChange(quantity - 1)}
            >
              -
            </Button>
            <span className="px-2 py-1">{quantity}</span>
            <Button
              variant="ghost"
              size="sm"
              className="px-2 py-0 h-8 hover:text-secondary"
              onClick={() => handleQuantityChange(quantity + 1)}
            >
              +
            </Button>
          </div>
          <p className="font-bold">${totalPrice.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
