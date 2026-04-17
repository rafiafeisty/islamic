import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <footer className="bg-emerald-900 text-white border-t-4 border-emerald-500 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h1 className="text-4xl font-bold text-amber-400">Deen Digital</h1>
            <p className="mt-3 text-emerald-200">
              Guidance for the soul
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-5 text-amber-400">Quick Links</h3>
            <div className="space-y-3">
              <Link to="/" className="block hover:text-amber-400 transition-colors">Home</Link>
              <Link to="/surah" className="block hover:text-amber-400 transition-colors">Surah</Link>
              <Link to="/juz" className="block hover:text-amber-400 transition-colors">Juz</Link>
              <Link to="/prayer" className="block hover:text-amber-400 transition-colors">Prayer Time</Link>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-5 text-amber-400">Quick Links</h3>
            <div className="space-y-3">
              <Link to="/calender" className="block hover:text-amber-400 transition-colors">Calendar</Link>
              <Link to="/hadith" className="block hover:text-amber-400 transition-colors">Hadith</Link>
              <Link to="/search" className="block hover:text-amber-400 transition-colors">Search</Link>
            </div>
          </div>
        </div>

        <div className="text-center text-emerald-400 text-sm mt-12 pt-8 border-t border-emerald-700">
          © 2026 Quran App | All Rights Reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;