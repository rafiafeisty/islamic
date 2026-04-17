import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dark,setdark]=useState(false);
    const darking=()=>{
        if(dark){
            setdark=false;
        }
        else{
            setdark=true;
        }
    }

    return (
        <nav className="fixed w-full bg-emerald-900 border-b border-emerald-600 z-50 top-0">
            <div className="max-w-7xl mx-auto px-6 py-5">
                <div className="hidden md:flex items-center justify-center gap-10 text-white text-lg">
                    <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
                    <Link to="/surah" className="hover:text-amber-400 transition-colors">Surah</Link>
                    <Link to="/juz" className="hover:text-amber-400 transition-colors">Juz</Link>
                    <Link to="/prayer" className="hover:text-amber-400 transition-colors">Prayer Time</Link>
                    <Link to="/calender" className="hover:text-amber-400 transition-colors">Calander</Link>
                    <Link to="/hadith" className="hover:text-amber-400 transition-colors">Hadith</Link>
                    <Link to="/search" className="hover:text-amber-400 transition-colors">Search</Link>
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden flex justify-between items-center">
                    <div className="text-2xl font-bold text-white">Deen Digital</div>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex flex-col gap-1.5"
                    >
                        <span className={`block w-7 h-0.5 bg-white transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`block w-7 h-0.5 bg-white transition-all ${isOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`block w-7 h-0.5 bg-white transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown */}
            <div className={`md:hidden bg-emerald-950 border-t border-emerald-700 transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0 overflow-hidden'}`}>
                <div className="flex flex-col text-white py-4 px-6 text-lg">
                    <Link to="/" className="py-3 hover:text-amber-400" onClick={() => setIsOpen(false)}>Home</Link>
                    <Link to="/surah" className="py-3 hover:text-amber-400" onClick={() => setIsOpen(false)}>Surah</Link>
                    <Link to="/juz" className="py-3 hover:text-amber-400" onClick={() => setIsOpen(false)}>Juz</Link>
                    <Link to="/prayer" className="py-3 hover:text-amber-400" onClick={() => setIsOpen(false)}>Prayer Time</Link>
                    <Link to="/calender" className="py-3 hover:text-amber-400" onClick={() => setIsOpen(false)}>Calendar</Link>
                    <Link to="/hadith" className="py-3 hover:text-amber-400" onClick={() => setIsOpen(false)}>Hadith</Link>
                    <Link to="/search" className="py-3 hover:text-amber-400" onClick={() => setIsOpen(false)}>Search</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;