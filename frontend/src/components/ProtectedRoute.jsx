import React from 'react';
import { Link } from 'react-router-dom';
import { FaLock, FaUserPlus, FaSignInAlt } from 'react-icons/fa';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('smartpai_token');

  // JIKA TIDAK ADA TOKEN (BELUM LOGIN), TAMPILKAN HALAMAN GEMBOK INI
  if (!token) {
    return (
      <div className="min-h-[80vh] bg-[#F8FAFC] flex flex-col justify-center items-center p-6">
        <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 text-center border border-gray-100 relative overflow-hidden">
          
          {/* Dekorasi Background Cahaya Blur */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-100 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-yellow-100 rounded-full blur-3xl opacity-60"></div>

          <div className="relative z-10">
            {/* Ikon Gembok */}
            <div className="w-24 h-24 bg-gradient-to-tr from-emerald-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg shadow-emerald-200">
              <FaLock />
            </div>
            
            <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Konten Eksklusif</h2>
            <p className="text-gray-600 mb-8 leading-relaxed text-sm">
              Halaman ini khusus untuk member <span className="font-bold text-emerald-600">SMART PAI DIGITAL</span>. Silakan masuk atau daftar akun secara gratis untuk mengakses materi, jurnal, dan fitur premium lainnya.
            </p>
            
            {/* Tombol Aksi */}
            <div className="flex flex-col gap-3">
              <Link to="/register" className="w-full bg-yellow-400 text-slate-900 font-black py-4 rounded-2xl hover:bg-yellow-300 transition-transform transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-md">
                <FaUserPlus className="text-lg" /> Daftar Member Gratis
              </Link>
              <Link to="/login" className="w-full bg-gray-50 text-gray-700 border border-gray-200 font-bold py-4 rounded-2xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                <FaSignInAlt className="text-lg" /> Sudah Punya Akun? Masuk
              </Link>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // JIKA SUDAH LOGIN, SILAKAN MASUK KE HALAMAN YANG DITUJU
  return children;
};

export default ProtectedRoute;