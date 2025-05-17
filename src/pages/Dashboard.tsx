
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container flex-grow py-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-4">Dashboard content will be implemented in a future sprint.</p>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
