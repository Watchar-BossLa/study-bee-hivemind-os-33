
import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotImplemented = () => {
  const location = useLocation();
  const path = location.pathname.substring(1); // Remove the leading slash
  const formattedPath = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-20">
        <div className="container max-w-md text-center">
          <div className="bg-bee-amber/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-4xl">🐝</div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Coming Soon</h1>
          
          <p className="text-xl mb-6">
            The <span className="font-semibold">{formattedPath}</span> feature is currently under development.
          </p>
          
          <p className="text-muted-foreground mb-8">
            Our team is working hard to bring you this exciting new feature. Check back soon!
          </p>
          
          <Link to="/">
            <Button className="group">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Button>
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotImplemented;
