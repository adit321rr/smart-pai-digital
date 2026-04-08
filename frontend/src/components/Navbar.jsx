import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('smartpai_token');
  
  const [isOpen, setIsOpen] = useState(false); 

  const handleLogout = () => {
    localStorage.removeItem('smartpai_token');
    navigate('/login');
    setIsOpen(false); 
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-emerald-700 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-7xl">
        
        {/* LOGO KIRI - SUDAH DIUBAH */}
        <Link to="/" className="text-xl md:text-2xl font-extrabold tracking-wider" onClick={closeMenu}>
          SMART PAI DIGITAL
        </Link>
        
        <button 
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> 
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /> 
            )}
          </svg>
        </button>

        <div className="hidden md:flex gap-4 lg:gap-6 items-center font-medium text-sm lg:text-base">
          <Link to="/" className="hover:text-emerald-200 transition-colors">Home</Link>
          <Link to="/ebooks" className="hover:text-emerald-200 transition-colors">E-Book</Link>
          <Link to="/publications" className="hover:text-emerald-200 transition-colors">Publikasi</Link>
          <Link to="/webinars" className="hover:text-emerald-200 transition-colors">Pelatihan</Link>
          <Link to="/tutorials" className="hover:text-emerald-200 transition-colors">Tutorial</Link>
          <Link to="/community" className="hover:text-emerald-200 transition-colors">Komunitas</Link>
          <Link to="/blogs" className="hover:text-emerald-200 transition-colors">Blog</Link>
          
          {token ? (
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-bold transition-colors shadow-sm ml-2">
              Logout
            </button>
          ) : (
            <div className="flex gap-2 ml-2">
              <Link to="/login" className="bg-transparent border border-white text-white hover:bg-white hover:text-emerald-600 px-4 py-2 rounded-lg font-bold transition-all shadow-sm">
                Login
              </Link>
              <Link to="/register" className="bg-white text-emerald-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-bold transition-colors shadow-sm">
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-emerald-700 absolute w-full left-0 top-full flex flex-col shadow-xl border-t border-emerald-500">
          <div className="flex flex-col px-6 py-4 space-y-4 font-medium text-lg">
            <Link to="/" onClick={closeMenu} className="hover:text-yellow-300 transition-colors">Home</Link>
            <Link to="/ebooks" onClick={closeMenu} className="hover:text-yellow-300 transition-colors">E-Book & Modul</Link>
            <Link to="/publications" onClick={closeMenu} className="hover:text-yellow-300 transition-colors">Publikasi Akademik</Link>
            <Link to="/webinars" onClick={closeMenu} className="hover:text-yellow-300 transition-colors">Pelatihan & Webinar</Link>
            <Link to="/tutorials" onClick={closeMenu} className="hover:text-yellow-300 transition-colors">Tutorial & Panduan</Link>
            <Link to="/community" onClick={closeMenu} className="hover:text-yellow-300 transition-colors">Komunitas</Link>
            <Link to="/blogs" onClick={closeMenu} className="hover:text-yellow-300 transition-colors">Blog & Berita</Link>
            
            <hr className="border-emerald-500 my-2" />

            {token ? (
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-bold text-center">
                Logout
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/login" onClick={closeMenu} className="border border-white text-center py-3 rounded-lg font-bold text-white hover:bg-white hover:text-emerald-600">
                  Login
                </Link>
                <Link to="/register" onClick={closeMenu} className="bg-white text-emerald-600 text-center py-3 rounded-lg font-bold hover:bg-gray-100">
                  Daftar Member Baru
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;