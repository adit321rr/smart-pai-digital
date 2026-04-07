import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [userData, setUserData] = useState(null);
  
  // State untuk Pengaturan Grup WA (Barcode & Link)
  const [groupSetting, setGroupSetting] = useState({ whatsappLink: '', qrCodeUrl: null });
  const [isEditingQR, setIsEditingQR] = useState(false);
  const [waLinkInput, setWaLinkInput] = useState('');
  const [qrFileInput, setQrFileInput] = useState(null);

  const token = localStorage.getItem('smartpai_token');

  const fetchData = async () => {
    try {
      // Ambil Postingan Forum
      const resPosts = await axios.get('http://localhost:5001/api/community');
      setPosts(resPosts.data);
      
      // Ambil Pengaturan QR Code
      const resSetting = await axios.get('http://localhost:5001/api/community/settings');
      setGroupSetting(resSetting.data);
      setWaLinkInput(resSetting.data.whatsappLink || '');
    } catch (error) { console.error("Gagal mengambil data", error); }
  };

  const fetchProfile = async () => {
    if (token) {
      try {
        const response = await axios.get('http://localhost:5001/api/me', { headers: { Authorization: `Bearer ${token}` } });
        setUserData(response.data);
      } catch (error) { console.error("Gagal mengambil profil", error); }
    }
  };

  useEffect(() => {
    fetchData();
    fetchProfile();
  }, [token]);

  // --- Fungsi Kirim Pesan Forum ---
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/community', { content }, { headers: { Authorization: `Bearer ${token}` } });
      setContent('');
      fetchData(); // Refresh data
    } catch (error) { alert('Gagal mengirim pesan.'); }
  };

  // --- Fungsi Update Pengaturan WA (Admin) ---
  const handleUpdateSetting = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('whatsappLink', waLinkInput);
    if (qrFileInput) {
      formData.append('qrImage', qrFileInput);
    }

    try {
      await axios.put('http://localhost:5001/api/community/settings', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      alert('Pengaturan Grup WA berhasil diperbarui!');
      setIsEditingQR(false);
      setQrFileInput(null);
      fetchData();
    } catch (error) { alert('Gagal memperbarui pengaturan.'); }
  };

  // --- Fungsi Hapus QR Code (Admin) ---
  const handleDeleteQR = async () => {
    if (!window.confirm("Yakin ingin menghapus gambar Barcode ini?")) return;
    try {
      await axios.delete('http://localhost:5001/api/community/settings/qr', {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('QR Code berhasil dihapus!');
      fetchData();
    } catch (error) { alert('Gagal menghapus QR Code.'); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER HALAMAN */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Ruang Anggota</h1>
          <p className="text-gray-500">Wadah silaturahmi dan diskusi eksklusif keluarga besar SMART-PAI.</p>
          <div className="w-20 h-1.5 bg-indigo-600 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* KOLOM KIRI: INFO GRUP & REGISTRASI */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* BOX WHATSAPP */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center relative overflow-hidden">
              <h3 className="font-bold text-gray-800 mb-4">Grup WhatsApp Resmi</h3>
              
              {/* TOMBOL EDIT ADMIN UNTUK BOX WA */}
              {userData && userData.role === 'ADMIN' && !isEditingQR && (
                 <button onClick={() => setIsEditingQR(true)} className="absolute top-4 right-4 bg-gray-100 text-gray-700 px-3 py-1 text-xs font-bold rounded shadow-sm hover:bg-gray-200">
                   Edit
                 </button>
              )}

              {/* JIKA SEDANG MODE EDIT OLEH ADMIN */}
              {isEditingQR ? (
                <form onSubmit={handleUpdateSetting} className="bg-indigo-50 p-4 rounded-xl text-left border border-indigo-200 mb-4">
                  <h4 className="text-sm font-bold text-indigo-800 mb-2">Edit Info Grup</h4>
                  <label className="text-xs text-gray-600 font-bold block mb-1">Link WhatsApp:</label>
                  <input type="url" value={waLinkInput} onChange={(e) => setWaLinkInput(e.target.value)} className="w-full p-2 text-sm border rounded-lg mb-3" required />
                  
                  <label className="text-xs text-gray-600 font-bold block mb-1">Upload QR Code (JPG/PNG):</label>
                  <input type="file" accept="image/*" onChange={(e) => setQrFileInput(e.target.files[0])} className="w-full text-xs mb-4" />
                  
                  <div className="flex gap-2">
                    <button type="submit" className="bg-indigo-600 text-white text-xs font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 flex-1">Simpan</button>
                    <button type="button" onClick={() => setIsEditingQR(false)} className="bg-gray-300 text-gray-700 text-xs font-bold py-2 px-4 rounded-lg hover:bg-gray-400 flex-1">Batal</button>
                  </div>
                </form>
              ) : (
                /* TAMPILAN NORMAL (QR CODE & TOMBOL WA) */
                <>
                  <div className="relative w-40 h-40 mx-auto mb-4">
                    {groupSetting.qrCodeUrl ? (
                      <>
                        <img src={groupSetting.qrCodeUrl} alt="QR Code Grup WA" className="w-full h-full object-cover rounded-xl border border-gray-200 shadow-sm" />
                        {userData && userData.role === 'ADMIN' && (
                          <button onClick={handleDeleteQR} className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 flex justify-center items-center rounded-full text-xs font-bold shadow-md hover:bg-red-700">X</button>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center px-2">Belum Ada <br /> QR Code</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-500 mb-4">Scan QR di atas atau klik tombol di bawah untuk bergabung.</p>
                  <a href={groupSetting.whatsappLink || "#"} target="_blank" rel="noopener noreferrer" className="block w-full bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-colors shadow-md">
                    Gabung Grup Sekarang
                  </a>
                </>
              )}
            </div>

            {/* BOX REGISTRASI */}
            {!token && (
              <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg">
                <h3 className="font-bold text-lg mb-2">Belum Jadi Anggota?</h3>
                <p className="text-sm opacity-90 mb-6">Daftarkan akun Anda untuk ikut berdiskusi dan mengakses fitur premium lainnya.</p>
                <Link to="/register" className="block w-full bg-white text-indigo-600 text-center font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors">
                  Buat Akun Sekarang
                </Link>
              </div>
            )}
          </div>

          {/* KOLOM KANAN: FORUM DISKUSI */}
          <div className="lg:col-span-2 space-y-6">
            {/* FORM INPUT PESAN */}
            {token ? (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
                    {userData?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-gray-700">Hai, {userData?.name}! Bagikan pemikiranmu...</span>
                </div>
                <form onSubmit={handlePostSubmit} className="flex flex-col gap-3">
                  <textarea placeholder="Tulis pesan atau pertanyaan Anda..." value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-sm" rows="3" required />
                  <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-8 rounded-lg hover:bg-indigo-700 self-end transition-all">
                    Kirim Pesan
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                <p className="text-gray-500 text-sm">Anda harus <Link to="/login" className="text-indigo-600 font-bold hover:underline">Login</Link> untuk dapat mengirim pesan di forum ini.</p>
              </div>
            )}

            {/* LIST PESAN */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">💬 Diskusi Terbaru</h3>
              {posts.length === 0 ? (
                <p className="text-gray-400 italic text-sm py-10 text-center">Belum ada diskusi di sini.</p>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-200 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                          {post.author?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm">{post.author?.name}</h4>
                          <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold uppercase">{post.author?.role}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400">{new Date(post.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap pl-1">{post.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Community;