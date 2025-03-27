"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import "./globals.css";

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import Features from './components/Features';
import Footer from './components/Footer';
import ReviewsSection from "./components/ReviewsSection";


export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <ProductList />
      <Features />
      <ReviewsSection />
      <Footer />
    </>
  );
}












