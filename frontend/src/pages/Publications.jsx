import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Publications = () => {
  const [publications, setPublications] = useState([]);
  const [userData, setUserData] = useState(null);
  
  // State Form
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  
  // State untuk Edit
  const [editingId, setEditingId] = useState(null);
  
  const token = localStorage.getItem('smartpai_token');

  const fetchPublications = async () => {
    try {
      const response = await axios.get('https://smart-pai-digital.vercel.app/api/publications');
      setPublications(response.data);
    } catch (error) { console.error("Gagal mengambil data", error); }
  };

  const fetchProfile = async () => {
    if (token) {
      try {
        const response = await axios.get('https://smart-pai-digital.vercel.app/api/me', { headers: { Authorization: `Bearer ${token}` } });
        setUserData(response.data);
      } catch (error) { console.error("Gagal mengambil profil", error); }
    }
  };

  useEffect(() => {
    fetchPublications();
    fetchProfile();
  }, [token]);

  // --- Fungsi Simpan & Edit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`https://smart-pai-digital.vercel.app/api/publications/${editingId}`, 
          { title, abstract, linkUrl },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Publikasi berhasil diperbarui!');
      } else {
        await axios.post('https://smart-pai-digital.vercel.app/api/publications', 
          { title, abstract, linkUrl },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Publikasi berhasil ditambahkan!');
      }
      
      handleCancelEdit();
      fetchPublications();
    } catch (error) {
      alert('Gagal menyimpan publikasi.');
    }
  };

  // --- Fungsi Hapus ---
  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus jurnal ini?")) return;
    try {
      await axios.delete(`https://smart-pai-digital.vercel.app/api/publications/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      alert('Publikasi berhasil dihapus!');
      fetchPublications();
    } catch (error) { alert('Gagal menghapus.'); }
  };

  // --- Fungsi Klik Edit ---
  const handleEditClick = (pub) => {
    setEditingId(pub.id);
    setTitle(pub.title);
    setAbstract(pub.abstract);
    setLinkUrl(pub.linkUrl || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle(''); setAbstract(''); setLinkUrl('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b-4 border-purple-600 inline-block pb-2">
          Publikasi Akademik 
        </h1>

        {/* --- FORM ADMIN --- */}
        {userData && userData.role === 'ADMIN' && (
          <div className={`p-6 rounded-xl shadow-md mb-8 border ${editingId ? 'bg-yellow-50 border-yellow-400' : 'bg-white border-purple-100'}`}>
            <h3 className={`text-xl font-bold mb-4 ${editingId ? 'text-yellow-700' : 'text-purple-800'}`}>
              {editingId ? 'Panel Admin: Edit Jurnal' : 'Panel Admin: Submit Jurnal Baru'}
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input 
                type="text" 
                placeholder="Judul Publikasi..." 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white outline-none"
                required
              />
              <textarea 
                placeholder="Abstrak atau ringkasan..." 
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white outline-none"
                rows="4"
                required
              />
              <input 
                type="url" 
                placeholder="Link URL Jurnal Asli (opsional)" 
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white outline-none"
              />
              
              <div className="flex gap-4 mt-2">
                <button type="submit" className={`${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-purple-600 hover:bg-purple-700'} text-white font-bold py-2 px-6 rounded-lg transition-colors`}>
                  {editingId ? 'Simpan Perubahan' : 'Submit Publikasi'}
                </button>
                {editingId && (
                  <button type="button" onClick={handleCancelEdit} className="bg-gray-300 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-400 transition-colors">
                    Batal Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* --- DAFTAR PUBLIKASI --- */}
        <div className="flex flex-col gap-6">
          {publications.length === 0 ? (
            <p className="text-gray-500 italic">Belum ada publikasi yang disubmit.</p>
          ) : (
            publications.map((pub) => (
              <div key={pub.id} className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500 relative hover:shadow-md transition-shadow">
                
                {/* TOMBOL EDIT & HAPUS (Hanya Admin) */}
                {userData && userData.role === 'ADMIN' && (
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={() => handleEditClick(pub)} className="bg-yellow-400 text-yellow-900 w-8 h-8 flex justify-center items-center rounded-full shadow-sm font-bold text-sm hover:bg-yellow-500">✏️</button>
                    <button onClick={() => handleDelete(pub.id)} className="bg-red-500 text-white w-8 h-8 flex justify-center items-center rounded-full shadow-sm font-bold text-sm hover:bg-red-600">X</button>
                  </div>
                )}

                <h2 className="text-xl font-bold text-gray-800 mb-2 pr-20">{pub.title}</h2>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{pub.abstract}</p>
                <div className="flex justify-between items-end border-t border-gray-100 pt-4">
                  <div className="text-xs text-gray-400">
                    Oleh: <span className="font-semibold text-gray-600">{pub.author?.name || 'Anonim'}</span>
                  </div>
                  {pub.linkUrl && (
                    <a href={pub.linkUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-purple-600 hover:text-purple-800 underline">
                      Baca Jurnal Asli &rarr;
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Publications;