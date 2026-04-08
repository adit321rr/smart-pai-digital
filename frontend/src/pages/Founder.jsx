import React from 'react';
import { Link } from 'react-router-dom';

const Founder = () => {
  return (
    <div className="bg-slate-50 min-h-screen pb-16 font-sans">
      {/* --- HERO SECTION --- */}
      {/* Hapus text-center dari div utama ini */}
      <div className="bg-emerald-700 text-white pt-8 pb-32 px-6 relative overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-48 h-48 bg-yellow-400 rounded-full blur-3xl"></div>
        </div>

        {/* Header Content (Rata Kiri & Tengah) */}
        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Tombol Kembali (Rata Kiri) */}
          <div className="text-left mb-6">
            <Link to="/" className="text-sm text-emerald-200 hover:text-white inline-flex items-center gap-2 transition-colors">
              &larr; Kembali ke Beranda
            </Link>
          </div>
          
          {/* Profil (Rata Tengah) */}
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <img
                src="/src/assets/founder.jpeg" 
                alt="Sarah Dina, S.Pd., M.Pd."
                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl object-cover"
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Sarah Dina, S.Pd., M.Pd.</h1>
            <h2 className="text-lg md:text-xl text-yellow-400 font-bold mb-4">Founder & Pengembang Utama SMART PAI DIGITAL</h2>
            <p className="max-w-2xl mx-auto text-sm md:text-base text-emerald-100 leading-relaxed">
              Guru, Dosen, dan Praktisi Pendidikan yang mendedikasikan diri pada integrasi nilai-nilai keislaman dan inovasi teknologi digital dalam dunia pendidikan.
            </p>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT CARD --- */}
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl -mt-20 p-8 md:p-12 relative z-20 mx-4 lg:mx-auto">
        
        {/* Grid 2 Kolom untuk Konten Utama */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* KOLOM KIRI: Tentang Saya & Pendidikan */}
          <div className="space-y-10">
            {/* Tentang Saya */}
            <section>
              <h3 className="text-2xl font-bold text-slate-800 mb-4 border-b-2 border-yellow-400 pb-2 inline-block">Tentang Saya</h3>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base text-justify">
                Saya percaya bahwa pendidikan di era digital tidak boleh hanya berfokus pada transfer pengetahuan atau kecanggihan alat semata. Transformasi digital harus dibarengi dengan penguatan karakter, adab, dan literasi yang bermakna. Melalui SMART PAI Digital Model, saya merancang sebuah ekosistem pembelajaran di mana teknologi hadir sebagai jembatan untuk mendekatkan siswa pada nilai-nilai spiritual dan sosial yang luhur.
              </p>
            </section>

            {/* Riwayat Pendidikan */}
            <section>
              <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b-2 border-yellow-400 pb-2 inline-block">Riwayat Pendidikan</h3>
              <div className="space-y-6">
                <div className="relative pl-6 border-l-2 border-emerald-200">
                  <div className="absolute w-4 h-4 bg-emerald-600 rounded-full -left-[9px] top-1 border-4 border-white shadow-sm"></div>
                  <h4 className="font-bold text-slate-800">Doctor (S3) - Islamic Studies</h4>
                  <p className="text-sm text-emerald-600 font-semibold mb-1">UIN Sunan Kalijaga Yogyakarta (2025 - Sekarang)</p>
                  <p className="text-xs text-slate-500 italic leading-relaxed">Disertasi: "Reconstruction of Islamic Religious Education Teachers' Digital Literacy Competencies in Technology-Based PAI Learning..."</p>
                </div>
                <div className="relative pl-6 border-l-2 border-emerald-200">
                  <div className="absolute w-4 h-4 bg-yellow-400 rounded-full -left-[9px] top-1 border-4 border-white shadow-sm"></div>
                  <h4 className="font-bold text-slate-800">Ph.D Short Course - Philosophy of Education</h4>
                  <p className="text-sm text-emerald-600 font-semibold">International Islamic University Malaysia (IIUM) (2025)</p>
                </div>
                <div className="relative pl-6 border-l-2 border-emerald-200">
                  <div className="absolute w-4 h-4 bg-yellow-400 rounded-full -left-[9px] top-1 border-4 border-white shadow-sm"></div>
                  <h4 className="font-bold text-slate-800">Master Short Course - Higher Education Systems</h4>
                  <p className="text-sm text-emerald-600 font-semibold mb-1">USIM, Taksin Univ., Muhammadiyah Islamic College Singapore (2024)</p>
                </div>
                <div className="relative pl-6 border-l-2 border-emerald-200">
                  <div className="absolute w-4 h-4 bg-emerald-600 rounded-full -left-[9px] top-1 border-4 border-white shadow-sm"></div>
                  <h4 className="font-bold text-slate-800">Master (S2) - Islamic Studies</h4>
                  <p className="text-sm text-emerald-600 font-semibold">UIN Sunan Kalijaga Yogyakarta (2022 - 2024)</p>
                </div>
                <div className="relative pl-6 border-l-2 border-emerald-200">
                  <div className="absolute w-4 h-4 bg-slate-300 rounded-full -left-[9px] top-1 border-4 border-white shadow-sm"></div>
                  <h4 className="font-bold text-slate-800">Bachelor (S1) - Islamic Studies</h4>
                  <p className="text-sm text-emerald-600 font-semibold">UIN Sumatera Utara (2018 - 2022)</p>
                </div>
              </div>
            </section>
          </div>

          {/* KOLOM KANAN: Fokus, Keahlian, Karya, Penghargaan */}
          <div className="space-y-10">
            {/* Fokus & Keahlian */}
            <section className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100 shadow-sm">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="bg-yellow-400 text-slate-900 p-2 rounded-lg text-sm">🎓</span> Fokus & Keahlian
                </h3>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold">✓</span> Inovasi Pembelajaran PAI Berbasis Teknologi</li>
                  <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold">✓</span> Literasi Digital Pendidik dan Siswa</li>
                  <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold">✓</span> Filsafat dan Sistem Pendidikan Tinggi</li>
                  <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold">✓</span> Integrasi Karakter Islami dalam Ekosistem Digital</li>
                </ul>
            </section>

            {/* Karya Buku Utama */}
            <section>
              <h3 className="text-2xl font-bold text-slate-800 mb-4 border-b-2 border-yellow-400 pb-2 inline-block">Publikasi Buku Utama</h3>
              <div className="space-y-4">
                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-slate-800 text-sm">Guru PAI di Era Digital: Transformasi Pembelajaran Berbasis Teknologi dan Penguatan Nilai</h4>
                  <p className="text-xs text-slate-500 mt-1 font-semibold">Penerbit: Bacaan Media (2025)</p>
                </div>
                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-slate-800 text-sm">Digitalisasi Manajemen Pendidikan Islam: Integrasi Teknologi dalam Tata Kelola Lembaga</h4>
                  <p className="text-xs text-slate-500 mt-1 font-semibold">Penerbit: Bacaan Media (2026)</p>
                </div>
                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-slate-800 text-sm">Literasi Digital untuk Pendidik dan Peserta Didik</h4>
                  <p className="text-xs text-slate-500 mt-1 font-semibold">Penerbit: UMSU Press (2026)</p>
                </div>
              </div>
            </section>

            {/* Penghargaan & Prestasi */}
            <section>
              <h3 className="text-2xl font-bold text-slate-800 mb-4 border-b-2 border-yellow-400 pb-2 inline-block">Penghargaan (Highlights)</h3>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <span className="text-yellow-500 text-lg">🏆</span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">Best Graduates of Masters and Doctoral Programs</h4>
                    <p className="text-xs text-slate-500">UIN Sunan Kalijaga Yogyakarta (2025)</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-yellow-500 text-lg">🥇</span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">1st Place International Essay Competition</h4>
                    <p className="text-xs text-slate-500">UNISSA Brunei Darussalam (2024)</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-yellow-500 text-lg">🌟</span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">The Top Three PKU Participants</h4>
                    <p className="text-xs text-slate-500">Universitas Darussalam Gontor (2024)</p>
                  </div>
                </li>
              </ul>
            </section>
          </div>
        </div>

        {/* --- TOMBOL DOWNLOAD CV SECTION --- */}
        <div className="mt-16 pt-8 border-t border-slate-100 text-center">
          <a 
            href="/cv-sarah-dina.pdf" 
            download="CV_Sarah_Dina.pdf"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download CV Lengkap
          </a>
          <p className="text-xs text-slate-400 mt-3">Format PDF • Curriculum Vitae 2026</p>
        </div>

      </div>
    </div>
  );
}

export default Founder;