import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaYoutube, FaWhatsapp, FaEnvelope, FaQuoteLeft, FaCheckCircle, FaChevronRight, FaTimes } from 'react-icons/fa';

import founderImg from '../assets/founder.jpeg';

const Home = () => {
  const [recentProducts, setRecentProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', text: '', imageUrl: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProducts = await axios.get('https://smart-pai-digital.vercel.app/api/products');
        setRecentProducts(resProducts.data.slice(0, 4)); 
        
        const resTesti = await axios.get('https://smart-pai-digital.vercel.app/api/testimonials');
        setTestimonials(resTesti.data);
      } catch (error) { console.error(error); }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitTestimoni = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post('https://smart-pai-digital.vercel.app/api/testimonials', formData);
      setTestimonials([response.data, ...testimonials]);
      setIsModalOpen(false);
      setFormData({ name: '', role: '', text: '', imageUrl: '' });
      alert("Terima kasih! Ulasan Anda telah berhasil dikirim.");
    } catch (error) {
      console.error(error);
      alert("Gagal mengirim ulasan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayTestimonials = testimonials.length > 0 ? testimonials : [
    { name: "Ahmad Fauzi, S.PdI.", role: "Guru PAI", text: "Modul yang tersedia sangat aplikatif dan membantu saya mengajar di kelas digital." },
    { name: "Dr. Siti Fatimah", role: "Dosen", text: "Integrasi riset akademik dan media praktis adalah keunggulan utama platform ini." },
    { name: "Nisa Sabyan", role: "Mahasiswi", text: "E-Book dan tutorialnya sangat mudah dipahami. Sangat membantu tugas kuliah saya." }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900 overflow-hidden relative">
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* --- MODAL POPUP FORM TESTIMONI --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 relative shadow-2xl animate-fade-in-up">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors">
              <FaTimes className="text-xl" />
            </button>
            <h3 className="text-2xl font-black text-gray-900 mb-6 text-center">Tulis Ulasan Anda</h3>
            
            <form onSubmit={handleSubmitTestimoni} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap *</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors" placeholder="Contoh: Budi Santoso" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Profesi / Peran *</label>
                <input required type="text" name="role" value={formData.role} onChange={handleInputChange} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors" placeholder="Contoh: Guru PAI / Mahasiswa" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Link Foto Profil (Opsional)</label>
                <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors" placeholder="https://link-foto-anda.jpg" />
                <p className="text-xs text-gray-500 mt-1">Kosongkan jika tidak ada, sistem akan membuat avatar otomatis.</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Pesan / Kesan *</label>
                <textarea required name="text" value={formData.text} onChange={handleInputChange} rows="4" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors" placeholder="Ceritakan pengalaman Anda bersama kami..."></textarea>
              </div>
              
              <button disabled={isSubmitting} type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-xl transition-all disabled:opacity-50 mt-4">
                {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 1. HERO SECTION (TEMA HIJAU ISLAMI) */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-900 text-white pt-24 pb-32 px-6">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sm font-semibold tracking-wider text-yellow-300 mb-6">
              PLATFORM EDUKASI MASA DEPAN
            </span>
            <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight drop-shadow-lg">
              SMART-PAI <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">Digital Model</span>
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light">
              Platform pengembangan media, riset, dan inovasi Pendidikan Agama Islam untuk membentuk generasi berkarakter unggul di era transformasi teknologi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/ebooks" className="bg-yellow-400 text-emerald-900 hover:bg-yellow-300 px-8 py-4 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:shadow-[0_0_30px_rgba(250,204,21,0.6)] flex items-center justify-center gap-2">
                Lihat Produk Digital <FaChevronRight className="text-sm" />
              </Link>
              <a href="#tentang" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 px-8 py-4 rounded-full font-bold transition-all flex items-center justify-center">
                Eksplor Model
              </a>
            </div>
          </div>
          
          {/* KOLOM KANAN: LOGO 3D FLOATING CARD (CAHAYA HIJAU) */}
          <div className="flex-1 flex justify-center relative mt-12 lg:mt-0 w-full">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[450px] md:h-[450px] bg-gradient-to-r from-emerald-400 via-teal-400 to-yellow-200 rounded-full blur-[70px] opacity-30 animate-pulse pointer-events-none"></div>
            
            <div className="relative group w-full max-w-[320px] md:max-w-[400px]">
              <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 p-4 md:p-6 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] transform transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)] hover:rotate-1">
                <div className="bg-white rounded-[30px] p-6 md:p-10 shadow-inner overflow-hidden relative flex items-center justify-center">
                  <div className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-[150%] group-hover:translate-x-[50%] transition-transform duration-1000 ease-in-out z-10 pointer-events-none"></div>
                  <img src="/src/assets/logo.jpeg" alt="Logo SMART PAI Digital" className="w-full h-auto object-contain relative z-0 transform group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-black py-3 px-6 rounded-2xl shadow-xl transform -rotate-6 group-hover:rotate-0 transition-all duration-500 border-2 border-white/50 z-20">
                  #Inovasi2026
                </div>
                <div className="absolute -top-6 -right-6 bg-emerald-600 text-white font-bold py-3 px-6 rounded-2xl shadow-xl transform rotate-6 group-hover:rotate-0 transition-all duration-500 border-2 border-white/20 flex items-center gap-2 z-20">
                  <span className="w-3 h-3 rounded-full bg-yellow-400 animate-ping"></span> Live
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VISI & MISI */}
      <section id="tentang" className="py-24 px-6 relative -mt-16 z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-teal-950 rounded-[40px] p-12 text-white shadow-2xl relative overflow-hidden flex flex-col justify-center transform transition duration-500 hover:scale-[1.02]">
            <FaQuoteLeft className="text-6xl text-white/10 absolute top-10 left-10" />
            <h3 className="text-3xl font-black mb-6 text-yellow-400 relative z-10 uppercase tracking-widest">Visi Kami</h3>
            <p className="text-lg leading-relaxed font-light relative z-10 text-gray-200">
              "Menjadi pusat inovasi dan pengembangan model pembelajaran Pendidikan Agama Islam berbasis digital yang <span className="font-bold text-white">unggul</span>, <span className="font-bold text-white">integratif</span>, dan berkontribusi dalam membentuk <span className="font-bold text-yellow-400">generasi berkarakter</span> dan adaptif di era digital."
            </p>
          </div>
          <div className="lg:col-span-7 bg-white rounded-[40px] p-12 shadow-xl border border-gray-100 transform transition duration-500 hover:scale-[1.02]">
            <h3 className="text-3xl font-black mb-8 text-gray-900 uppercase tracking-widest flex items-center gap-4">
              <span className="w-12 h-2 bg-emerald-600 rounded-full"></span> Misi
            </h3>
            <ul className="space-y-6">
              {[
                "Mengembangkan model pembelajaran PAI berbasis digital yang sistematis, inovatif, dan aplikatif.",
                "Meningkatkan kompetensi literasi digital guru dan siswa.",
                "Mengintegrasikan nilai-nilai keislaman dalam pembelajaran berbasis teknologi.",
                "Menghasilkan produk pembelajaran dan riset yang relevan dengan kebutuhan pendidikan.",
                "Mendorong pembelajaran yang bermakna dan berorientasi pada penguatan karakter."
              ].map((misi, i) => (
                <li key={i} className="flex gap-4 items-start group">
                  <div className="mt-1 bg-emerald-100 text-emerald-600 rounded-full p-2 group-hover:bg-emerald-600 group-hover:text-white transition-colors"><FaCheckCircle /></div>
                  <p className="text-gray-700 leading-relaxed font-medium">{misi}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3. LANDASAN & KEUNGGULAN */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Landasan Pengembangan", iconBg: "bg-emerald-100", iconText: "text-emerald-600", dot: "bg-emerald-400", items: ["Pendidikan Agama Islam berbasis nilai", "Literasi digital dalam pembelajaran", "Psikologi pendidikan & karakter", "Integrasi keilmuan (Agama & Teknologi)"] },
            { title: "Tujuan & Manfaat", iconBg: "bg-yellow-100", iconText: "text-yellow-600", dot: "bg-yellow-400", items: ["Mengembangkan model PAI digital", "Meningkatkan literasi digital", "Menghasilkan inovasi riset", "Pembelajaran reflektif & bermakna", "Menguatkan karakter spiritual"] },
            { title: "Keunggulan", iconBg: "bg-teal-100", iconText: "text-teal-600", dot: "bg-teal-400", items: ["Berbasis riset akademik", "Integrasi nilai Islam & teknologi", "Fokus pembentukan karakter", "Relevan dengan masa kini", "Adaptif untuk guru & siswa"] }
          ].map((box, index) => (
            <div key={index} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className={`w-14 h-14 ${box.iconBg} ${box.iconText} rounded-2xl flex items-center justify-center mb-6 text-xl font-black`}>0{index + 1}</div>
              <h3 className="text-xl font-black text-gray-900 mb-6">{box.title}</h3>
              <ul className="space-y-3">
                {box.items.map((item, i) => (
                  <li key={i} className="text-gray-600 text-sm font-medium flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${box.dot}`}></div> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 4. QUOTES TOKOH */}
      <section className="py-24 px-6 bg-slate-900 text-white text-center relative overflow-hidden">
        <FaQuoteLeft className="absolute top-10 left-10 text-9xl text-white/5" />
        <div className="max-w-4xl mx-auto relative z-10">
          <p className="text-3xl md:text-5xl font-serif mb-8 leading-snug font-light italic text-gray-300">
            "Ing Ngarsa Sung Tulada, <br/> Ing Madya Mangun Karsa, <br/> Tut Wuri Handayani."
          </p>
          <div className="flex items-center justify-center gap-6">
            <div className="w-16 h-1 bg-yellow-400"></div>
            <span className="font-black tracking-widest text-lg uppercase text-yellow-400">Ki Hajar Dewantara</span>
            <div className="w-16 h-1 bg-yellow-400"></div>
          </div>
        </div>
      </section>

      {/* 5. PRODUK DIGITAL */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Koleksi E-Book & Modul</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Materi pilihan berbasis riset mendalam untuk mendukung transformasi digital Pendidikan Agama Islam.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recentProducts.map(product => (
              <div key={product.id} className="bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col group hover:shadow-2xl transition-all border border-gray-100">
                <div className="h-64 bg-gray-200 overflow-hidden relative">
                  <img src={product.coverUrl || "https://via.placeholder.com/300x400"} alt="Cover" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                    {product.pdfUrl ? (
                      <a href={product.pdfUrl} target="_blank" rel="noopener noreferrer" className="bg-yellow-400 text-slate-900 font-bold px-6 py-3 rounded-full text-sm hover:bg-yellow-300 transition-colors shadow-lg cursor-pointer">Baca Sekarang</a>
                    ) : (
                      <Link to="/ebooks" className="bg-yellow-400 text-slate-900 font-bold px-6 py-3 rounded-full text-sm hover:bg-yellow-300 transition-colors shadow-lg cursor-pointer">Lihat Detail</Link>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase mb-3 inline-block">{product.publisher}</span>
                  <h3 className="font-bold text-gray-900 leading-snug mb-2 line-clamp-2">{product.title}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/ebooks" className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-800 text-lg">Lihat Semua Koleksi <FaChevronRight/></Link>
          </div>
        </div>
      </section>

      {/* 6. FOUNDER PROFILE */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-2/5 relative overflow-hidden min-h-[400px]">
            <img src={founderImg} alt="Sarah Dina, S.Pd., M.Pd." className="w-full h-full object-cover absolute inset-0" />
          </div>
          <div className="md:w-3/5 p-10 md:p-16 lg:p-20 flex flex-col justify-center bg-gradient-to-br from-white to-emerald-50/50">
            <span className="text-emerald-600 font-black tracking-widest text-sm mb-3">PENGEMBANG UTAMA</span>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">Sarah Dina, S.Pd., M.Pd.</h2>
            <p className="text-gray-600 leading-loose mb-8 text-lg">
              Seorang guru, dosen, dan praktisi pendidikan serta pegiat literasi digital siswa. Berfokus pada pengembangan inovasi pembelajaran PAI berbasis teknologi dengan pendekatan integratif antara nilai keislaman, pedagogi, dan transformasi digital.
            </p>
            <Link to="/founder" className="bg-slate-900 text-white font-bold py-4 px-10 rounded-full w-fit hover:bg-slate-800 transition-all shadow-xl flex items-center gap-3">
            Lihat Profil Lengkap <FaChevronRight/>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONI DINAMIS */}
      <section className="py-24 bg-emerald-50 border-y border-emerald-100 overflow-hidden">
        <div className="text-center mb-12 px-6 max-w-2xl mx-auto">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Kepuasan Member</h2>
          <p className="text-gray-600 mb-8">Apa kata mereka yang telah bergabung dan berkembang bersama di ekosistem SMART-PAI?</p>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black py-3 px-8 rounded-full shadow-lg transition-transform transform hover:-translate-y-1"
          >
            + Tulis Ulasan Anda
          </button>
        </div>
        
        <div className="w-full flex mt-10">
          <div className="animate-marquee flex gap-6 px-3">
            {[...displayTestimonials, ...displayTestimonials].map((testi, idx) => (
              <div key={idx} className="w-[350px] md:w-[450px] bg-white p-8 rounded-3xl shadow-sm border border-emerald-100 flex flex-col justify-between flex-shrink-0">
                <div>
                  <div className="flex gap-1 text-yellow-400 mb-4">★★★★★</div>
                  <p className="text-gray-600 text-lg italic mb-8 leading-relaxed font-light">"{testi.text}"</p>
                </div>
                <div className="flex items-center gap-4">
                  {testi.imageUrl ? (
                    <img src={testi.imageUrl} alt={testi.name} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-100" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-xl uppercase">
                      {testi.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-gray-900">{testi.name}</h4>
                    <span className="text-xs text-emerald-600 font-semibold">{testi.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-slate-950 text-gray-300 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 mb-16 border-b border-white/10 pb-16">
          <div className="md:col-span-5">
            <h3 className="text-3xl font-black text-white mb-6">SMART PAI <span className="text-yellow-400">DIGITAL</span></h3>
            <p className="text-gray-400 leading-relaxed mb-8 max-w-md">Membangun generasi berkarakter unggul di era digital melalui inovasi pembelajaran Pendidikan Agama Islam yang bermakna dan aplikatif.</p>
            <div className="flex gap-4">
               <a href="#" className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-xl hover:bg-yellow-400 hover:text-slate-900 transition-all"><FaInstagram /></a>
               <a href="#" className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-xl hover:bg-yellow-400 hover:text-slate-900 transition-all"><FaFacebookF /></a>
               <a href="#" className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-xl hover:bg-yellow-400 hover:text-slate-900 transition-all"><FaYoutube /></a>
            </div>
          </div>
          <div className="md:col-span-4">
            <h4 className="font-black text-white mb-6 uppercase tracking-widest text-sm">Hubungi Kami</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="bg-white/10 p-3 rounded-xl text-yellow-400"><FaWhatsapp className="text-xl"/></div>
                <div><p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">WhatsApp</p><p className="font-medium text-white">0852-6179-4971</p></div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-white/10 p-3 rounded-xl text-yellow-400"><FaEnvelope className="text-xl"/></div>
                <div><p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Email</p><p className="font-medium text-white">sarahdina925@gmail.com</p></div>
              </li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <h4 className="font-black text-white mb-6 uppercase tracking-widest text-sm">Mulai Sekarang</h4>
            <div className="flex flex-col gap-4">
              <Link to="/register" className="bg-yellow-400 text-slate-900 text-center font-black py-4 rounded-2xl hover:bg-yellow-300 transition-all shadow-lg">Daftar Member Gratis</Link>
              <Link to="/login" className="bg-white/10 text-white border border-white/20 text-center font-bold py-4 rounded-2xl hover:bg-white/20 transition-all">Masuk ke Akun</Link>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
          <p>&copy; {new Date().getFullYear()} SMART PAI DIGITAL MODEL.</p>
          <p>Dibuat untuk Inovasi Pendidikan.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;