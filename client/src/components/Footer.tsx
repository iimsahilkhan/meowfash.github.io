import { Link } from "wouter";
import { Cat, MapPin, Phone, Mail, Clock } from "lucide-react";
import { 
  FaFacebookF, 
  FaInstagram, 
  FaTwitter, 
  FaPinterestP, 
  FaTiktok 
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="font-montserrat font-bold text-xl mb-6 flex items-center">
              MEOWTH FASHION
              <Cat className="ml-2 h-5 w-5 text-accent" />
            </h3>
            <p className="mb-6 text-gray-300">
              Fashion that purrs with style. Discover the latest trends and timeless classics.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-secondary transition">
                <FaFacebookF />
              </a>
              <a href="#" className="text-gray-300 hover:text-secondary transition">
                <FaInstagram />
              </a>
              <a href="#" className="text-gray-300 hover:text-secondary transition">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-300 hover:text-secondary transition">
                <FaPinterestP />
              </a>
              <a href="#" className="text-gray-300 hover:text-secondary transition">
                <FaTiktok />
              </a>
            </div>
          </div>
          
          {/* Shopping */}
          <div>
            <h3 className="font-montserrat font-bold text-xl mb-6">Shopping</h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link href="/shop?category=women" className="hover:text-secondary transition">
                  Women's Collection
                </Link>
              </li>
              <li>
                <Link href="/shop?category=men" className="hover:text-secondary transition">
                  Men's Collection
                </Link>
              </li>
              <li>
                <Link href="/shop?category=accessories" className="hover:text-secondary transition">
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="/shop?new=true" className="hover:text-secondary transition">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/shop?sale=true" className="hover:text-secondary transition">
                  Sale Items
                </Link>
              </li>
              <li>
                <Link href="/lookbook" className="hover:text-secondary transition">
                  Lookbook
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Information */}
          <div>
            <h3 className="font-montserrat font-bold text-xl mb-6">Information</h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link href="/about" className="hover:text-secondary transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-secondary transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-secondary transition">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-secondary transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-secondary transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-secondary transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-montserrat font-bold text-xl mb-6">Contact Us</h3>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start">
                <MapPin className="mt-1 mr-3 text-secondary h-5 w-5" />
                <span>123 Fashion Street, Style Avenue, CA 90210</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 text-secondary h-5 w-5" />
                <span>+1 (234) 567-8900</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 text-secondary h-5 w-5" />
                <span>hello@meowthfashion.com</span>
              </li>
              <li className="flex items-center">
                <Clock className="mr-3 text-secondary h-5 w-5" />
                <span>Mon-Fri: 9am - 6pm</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} MEOWTH FASHION. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" 
              alt="Visa" 
              className="h-6 w-auto" 
            />
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
              alt="Mastercard" 
              className="h-6 w-auto" 
            />
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" 
              alt="PayPal" 
              className="h-6 w-auto" 
            />
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/4/40/Apple_Pay_logo.svg" 
              alt="Apple Pay" 
              className="h-6 w-auto" 
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
