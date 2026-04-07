import React from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaChalkboardTeacher, FaBook, FaArrowLeft } from 'react-icons/fa';
import founderImg from '../assets/founder.jpeg'; // Pastikan path gambarnya benar

const Founder = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900 pb-20">
      
      {/* Header Profile */}
      <section className="bg-gradient-to-br from-blue-800 to-indigo-900 text-white pt-16 pb-32 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-8">
            <FaArrowLeft /> Kembali ke Beranda
          </Link>
          <div className="text-center md:text-left flex flex-col md:flex-row items-center gap-8">
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl flex-shrink-0">
              <img src={founderImg} alt="Sarah Dina" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-4">Sarah Dina, S.Pd., M.Pd.</h1>
              <p className="text-xl text-yellow-300 font-bold mb-4">Founder & Pengembang Utama SMART PAI DIGITAL</p>
              <p className="text-blue-100 leading-relaxed max-w-xl">
                Guru, Dosen, dan Praktisi Pendidikan yang mendedikasikan diri pada integrasi nilai-nilai keislaman dan inovasi teknologi digital dalam dunia pendidikan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Konten Detail */}
      <section className="max-w-4xl mx-auto px-6 -mt-16 relative z-10">
        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-gray-100">
          
          {/* Tentang Saya */}
          <div className="mb-12">
            <h2 className="text-2xl font-black text-gray-900 mb-4 border-b-2 border-yellow-400 inline-block pb-2">Tentang Saya</h2>
            <p className="text-gray-600 leading-loose text-lg">
              Saya percaya bahwa pendidikan di era digital tidak boleh hanya berfokus pada transfer pengetahuan atau kecanggihan alat semata. Transformasi digital harus dibarengi dengan penguatan karakter, adab, dan literasi yang bermakna. Melalui SMART PAI Digital Model, saya merancang sebuah ekosistem pembelajaran di mana teknologi hadir sebagai jembatan untuk mendekatkan siswa pada nilai-nilai spiritual dan sosial yang luhur.
            </p>
          </div>

          {/* Grid Informasi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Pendidikan */}
            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center text-2xl mb-4">
                <FaGraduationCap />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Riwayat Pendidikan</h3>
              <ul className="space-y-4 relative border-l-2 border-blue-200 ml-3 pl-4">
                <li className="relative">
                  <span className="absolute -left-[21px] top-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white"></span>
                  <h4 className="font-bold text-gray-800">S2 Magister Pendidikan (M.Pd.)</h4>
                  <p className="text-sm text-gray-500">Universitas ... (Contoh: UIN Syarif Hidayatullah)</p>
                </li>
                <li className="relative">
                  <span className="absolute -left-[21px] top-1 w-3 h-3 bg-gray-400 rounded-full border-2 border-white"></span>
                  <h4 className="font-bold text-gray-800">S1 Sarjana Pendidikan (S.Pd.)</h4>
                  <p className="text-sm text-gray-500">Universitas ... (Contoh: Universitas Negeri Medan)</p>
                </li>
              </ul>
            </div>

            {/* Fokus Keahlian */}
            <div className="bg-yellow-50 p-6 rounded-3xl border border-yellow-100">
              <div className="w-12 h-12 bg-yellow-400 text-slate-900 rounded-xl flex items-center justify-center text-2xl mb-4">
                <FaChalkboardTeacher />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Fokus & Keahlian</h3>
              <ul className="space-y-3 text-gray-600 font-medium">
                <li className="flex items-center gap-2">✔ Inovasi Pembelajaran PAI</li>
                <li className="flex items-center gap-2">✔ Literasi Digital Siswa</li>
                <li className="flex items-center gap-2">✔ Pengembangan Media Edukasi</li>
                <li className="flex items-center gap-2">✔ Penguatan Karakter Berbasis Teknologi</li>
              </ul>
            </div>

          </div>

        </div>
      </section>
      
    </div>
  );
};

export default Founder;