"use client";

import { useState, useEffect } from "react";
import { gsap } from "gsap";
import './buttons.css';
import { useRouter } from 'next/navigation';
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user_token');
    setIsLoggedIn(!!user);

    if (isSidebarOpen) {
      gsap.to(".sidebar", { x: 0, duration: 0.5, ease: "power2.out" });
    } else {
      gsap.to(".sidebar", { x: "100%", duration: 0.5, ease: "power2.in" });
    }

    const alloyButton = document.querySelector(".alloy-button");
    if (alloyButton) {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
      tl.fromTo(
        alloyButton,
        { backgroundPosition: "200% 0%" },
        { backgroundPosition: "-200% 0%", duration: 2, ease: "linear" }
      );
    }

    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("mouseenter", () => {
        gsap.to(link, { scale: 1.1, duration: 0.3, ease: "power2.out" });
      });
      link.addEventListener("mouseleave", () => {
        gsap.to(link, { scale: 1, duration: 0.3, ease: "power2.out" });
      });
    });
  }, [isSidebarOpen]);

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <header className="flex items-center justify-between px-4 py-1 border-b border-solid border-b-[#e7eef4] md:px-10">
      <div className="flex items-center gap-2 text-[#0d151c]">
        <div className="w-[260px]">
          <a href="/">
          <img
            src="/logo.png"
            alt="SmartMaterial Advisor Logo"
            className="logo-img"
          />
          </a>
        </div>
      </div>

      <nav className="hidden md:flex flex-1 justify-end gap-8 items-center">
        <a className="nav-link bt text-[#0d151c] text-sm font-medium" href="/">
          Home
        </a>
        <a className="nav-link bt text-[#0d151c] text-sm font-medium" href="/about-us">
          About Us
        </a>
        <a className="nav-link bt text-[#0d151c] text-sm font-medium" href="/news">
          News
        </a>
        <a className="nav-link bt text-[#0d151c] text-sm font-medium" href="/#explore">
          Explore
        </a>
        <a className="nav-link alloy-button text-sm font-bold" href="/alloy">
          Alloy
        </a>

        {isLoggedIn ? (
          <div className="relative group">
            <button 
              onClick={() => router.push('/profile')}
              className="flex items-center gap-2 text-black hover:text-gray-600 transition-colors"
            >
              <FaUserCircle size={32} />
            </button>
          </div>
        ) : (
          <a className="nav-link bt text-[#0d151c] text-sm font-medium" href="/login">
            Login
          </a>
        )}
      </nav>

      <div className="md:hidden flex items-center text-black">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex items-center justify-center p-2 rounded-md focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <div className="sidebar fixed top-0 right-0 w-64 h-full text-black bg-white shadow-lg transform translate-x-full z-10">
        <div className="p-4 flex flex-col">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="self-end p-2 rounded-md focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <nav className="mt-6 flex flex-col gap-4">
            <a className="nav-link text-[#0d151c] text-sm font-medium" href="/">
              Home
            </a>
            <a className="nav-link text-[#0d151c] text-sm font-medium" href="/about-us">
              About Us
            </a>
            <a className="nav-link text-[#0d151c] text-sm font-medium" href="/news">
              News
            </a>
            <a className="nav-link text-[#0d151c] text-sm font-medium" href="/#explore">
              Explore
            </a>
            {isLoggedIn ? (
              <>
                <button 
                  onClick={() => {
                    router.push('/profile');
                    setIsSidebarOpen(false);
                  }}
                  className="nav-link text-[#0d151c] text-sm font-medium text-left"
                >
                  Profile
                </button>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsSidebarOpen(false);
                  }}
                  className="nav-link text-red-500 text-sm font-medium text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <a className="nav-link text-[#0d151c] text-sm font-medium" href="/login">
                Login
              </a>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;