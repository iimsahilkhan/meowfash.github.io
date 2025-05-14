import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Package, User, Key, MapPin, Heart, LogOut } from "lucide-react";

export default function Account() {
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Login functionality",
      description: "This is a demo account page. Login is not implemented in this version.",
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Registration functionality",
      description: "This is a demo account page. Registration is not implemented in this version.",
    });
  };

  // Demo orders data for display
  const demoOrders = [
    {
      id: "ORD-12345",
      date: "2023-09-15",
      status: "Delivered",
      total: 124.95,
      items: 3
    },
    {
      id: "ORD-12346",
      date: "2023-10-22",
      status: "Processing",
      total: 89.99,
      items: 1
    },
    {
      id: "ORD-12347",
      date: "2023-11-05",
      status: "Shipped",
      total: 215.50,
      items: 4
    }
  ];

  // Demo addresses for display
  const demoAddresses = [
    {
      id: 1,
      name: "Home",
      address: "123 Main Street, Apt 4B",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
      isDefault: true
    },
    {
      id: 2,
      name: "Work",
      address: "456 Office Plaza, Suite 200",
      city: "New York",
      state: "NY",
      zipCode: "10018",
      country: "United States",
      isDefault: false
    }
  ];

  return (
    <>
      <Helmet>
        <title>My Account | MEOWTH FASHION</title>
        <meta name="description" content="Manage your account at MEOWTH FASHION. View orders, update profile, and more." />
      </Helmet>
      
      <div className="bg-neutral-light py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">
            My Account
          </h1>
          <p className="text-neutral-dark">
            Manage your profile, orders, and preferences
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <div className="max-w-md mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Login to Your Account</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin}>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@example.com" required />
                      </div>
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Password</Label>
                          <Link href="#" className="text-sm text-secondary">
                            Forgot password?
                          </Link>
                        </div>
                        <Input id="password" type="password" required />
                      </div>
                      <Button type="submit" className="bg-secondary hover:bg-secondary/90 w-full">
                        Sign In
                      </Button>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col items-center justify-center">
                  <div className="text-sm text-neutral-dark mt-2">
                    Don't have an account?{" "}
                    <button 
                      className="text-secondary underline"
                      onClick={() => document.querySelector('[value="register"]')?.dispatchEvent(new MouseEvent('click'))}
                    >
                      Register
                    </button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="register">
            <div className="max-w-md mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Create an Account</CardTitle>
                  <CardDescription>
                    Join MEOWTH FASHION to access exclusive deals and track your orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister}>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="full-name">Full Name</Label>
                        <Input id="full-name" placeholder="John Doe" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="register-email">Email</Label>
                        <Input id="register-email" type="email" placeholder="m@example.com" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="register-password">Password</Label>
                        <Input id="register-password" type="password" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input id="confirm-password" type="password" required />
                      </div>
                      <Button type="submit" className="bg-secondary hover:bg-secondary/90 w-full">
                        Create Account
                      </Button>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col items-center justify-center">
                  <div className="text-sm text-neutral-dark mt-2">
                    Already have an account?{" "}
                    <button 
                      className="text-secondary underline"
                      onClick={() => document.querySelector('[value="login"]')?.dispatchEvent(new MouseEvent('click'))}
                    >
                      Login
                    </button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* Demo Account Dashboard - Would be shown after login in a real app */}
          <div className="mt-16 border-t pt-8">
            <h2 className="text-2xl font-bold font-montserrat mb-8 text-center">Demo Account Dashboard</h2>
            
            <div className="flex flex-col md:flex-row gap-6">
              {/* Sidebar */}
              <div className="md:w-64 p-4 bg-white rounded-lg shadow-sm">
                <div className="space-y-1">
                  <button 
                    className={`w-full flex items-center space-x-2 py-2 px-3 rounded-md text-left ${activeTab === 'profile' ? 'bg-secondary/10 text-secondary font-medium' : 'hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </button>
                  
                  <button 
                    className={`w-full flex items-center space-x-2 py-2 px-3 rounded-md text-left ${activeTab === 'orders' ? 'bg-secondary/10 text-secondary font-medium' : 'hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('orders')}
                  >
                    <Package className="h-5 w-5" />
                    <span>Orders</span>
                  </button>
                  
                  <button 
                    className={`w-full flex items-center space-x-2 py-2 px-3 rounded-md text-left ${activeTab === 'addresses' ? 'bg-secondary/10 text-secondary font-medium' : 'hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('addresses')}
                  >
                    <MapPin className="h-5 w-5" />
                    <span>Addresses</span>
                  </button>
                  
                  <button 
                    className={`w-full flex items-center space-x-2 py-2 px-3 rounded-md text-left ${activeTab === 'wishlist' ? 'bg-secondary/10 text-secondary font-medium' : 'hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('wishlist')}
                  >
                    <Heart className="h-5 w-5" />
                    <span>Wishlist</span>
                  </button>
                  
                  <button 
                    className={`w-full flex items-center space-x-2 py-2 px-3 rounded-md text-left ${activeTab === 'password' ? 'bg-secondary/10 text-secondary font-medium' : 'hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('password')}
                  >
                    <Key className="h-5 w-5" />
                    <span>Change Password</span>
                  </button>
                  
                  <button 
                    className="w-full flex items-center space-x-2 py-2 px-3 rounded-md text-left hover:bg-gray-100 text-neutral-dark mt-8"
                    onClick={() => toast({
                      title: "Logout functionality",
                      description: "This is a demo account page. Logout is not implemented in this version.",
                    })}
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
              
              {/* Dashboard Content */}
              <div className="flex-1 bg-white p-6 rounded-lg shadow-sm">
                {activeTab === 'profile' && (
                  <div>
                    <h3 className="text-xl font-bold font-montserrat mb-6">Profile Information</h3>
                    <form className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="profile-name">Full Name</Label>
                          <Input id="profile-name" defaultValue="John Doe" />
                        </div>
                        
                        <div>
                          <Label htmlFor="profile-email">Email</Label>
                          <Input id="profile-email" type="email" defaultValue="john.doe@example.com" />
                        </div>
                        
                        <div>
                          <Label htmlFor="profile-phone">Phone</Label>
                          <Input id="profile-phone" defaultValue="(123) 456-7890" />
                        </div>
                        
                        <div>
                          <Label htmlFor="profile-birthdate">Date of Birth</Label>
                          <Input id="profile-birthdate" type="date" defaultValue="1990-01-01" />
                        </div>
                      </div>
                      
                      <Button 
                        type="button" 
                        className="bg-secondary hover:bg-secondary/90"
                        onClick={() => toast({
                          title: "Profile updated",
                          description: "Your profile information has been updated successfully.",
                        })}
                      >
                        Save Changes
                      </Button>
                    </form>
                  </div>
                )}
                
                {activeTab === 'orders' && (
                  <div>
                    <h3 className="text-xl font-bold font-montserrat mb-6">Order History</h3>
                    <Table>
                      <TableCaption>A list of your recent orders</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {demoOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                order.status === 'Delivered' 
                                  ? 'bg-green-100 text-green-800' 
                                  : order.status === 'Shipped'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {order.status}
                              </span>
                            </TableCell>
                            <TableCell>{order.items}</TableCell>
                            <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                className="text-primary hover:text-secondary"
                                onClick={() => toast({
                                  title: "Order details",
                                  description: `This would show details for order ${order.id}.`,
                                })}
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                
                {activeTab === 'addresses' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold font-montserrat">Saved Addresses</h3>
                      <Button 
                        className="bg-secondary hover:bg-secondary/90"
                        onClick={() => toast({
                          title: "Add address",
                          description: "This would open a form to add a new address.",
                        })}
                      >
                        Add New Address
                      </Button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {demoAddresses.map((address) => (
                        <Card key={address.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">{address.name}</CardTitle>
                              {address.isDefault && (
                                <span className="bg-secondary/20 text-secondary text-xs px-2 py-1 rounded">
                                  Default
                                </span>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="text-sm text-neutral-dark">
                            <p>{address.address}</p>
                            <p>{address.city}, {address.state} {address.zipCode}</p>
                            <p>{address.country}</p>
                          </CardContent>
                          <CardFooter className="flex justify-end gap-2 pt-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => toast({
                                title: "Edit address",
                                description: `This would open a form to edit address: ${address.name}.`,
                              })}
                            >
                              Edit
                            </Button>
                            {!address.isDefault && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => toast({
                                  title: "Set as default",
                                  description: `Address ${address.name} has been set as default.`,
                                })}
                              >
                                Set as Default
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'wishlist' && (
                  <div>
                    <h3 className="text-xl font-bold font-montserrat mb-6">My Wishlist</h3>
                    <div className="text-center py-10">
                      <Heart className="h-16 w-16 mx-auto mb-4 text-secondary/50" />
                      <h4 className="text-lg font-medium mb-2">Your wishlist is empty</h4>
                      <p className="text-neutral-dark mb-6">
                        Browse our collection and add your favorite items to your wishlist
                      </p>
                      <Button asChild className="bg-secondary hover:bg-secondary/90">
                        <Link href="/shop">Explore Products</Link>
                      </Button>
                    </div>
                  </div>
                )}
                
                {activeTab === 'password' && (
                  <div>
                    <h3 className="text-xl font-bold font-montserrat mb-6">Change Password</h3>
                    <form className="space-y-4 max-w-md">
                      <div>
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      
                      <div>
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      
                      <div>
                        <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                        <Input id="confirm-new-password" type="password" />
                      </div>
                      
                      <Button 
                        type="button" 
                        className="bg-secondary hover:bg-secondary/90"
                        onClick={() => toast({
                          title: "Password updated",
                          description: "Your password has been updated successfully.",
                        })}
                      >
                        Update Password
                      </Button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </>
  );
}
