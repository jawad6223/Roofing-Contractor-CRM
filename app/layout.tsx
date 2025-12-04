import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Free Roof Quotes | Fast & Trusted Roofing Claims Experts',
  description: 'Discover your best roofing options with a free quote. Fast, reliable roof inspections and professional insurance claim help. Secure your home with trusted local experts—request your free estimate today!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <Header /> */}
        <main className="min-h-screen">
          {children}
        </main>
        {/* <Footer /> */}
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </body>
    </html>
  );
}