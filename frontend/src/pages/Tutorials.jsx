import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Tutorials = () => {
  const [tutorials, setTutorials] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  
  // State untuk Gambar dan PDF
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  
  const token = localStorage.getItem('smartpai_token');

  const fetchTutorials = async () => {
    try {
      const response = await axios.get('https://smart-pai-digital.vercel.app/api/tutorials');
      setTutorials(response.data);
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

  useEffect(() => { fetchTutorials(); fetchProfile(); }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('videoUrl', videoUrl);
    
    if (thumbnailFile) formData.append('thumbnailImage', thumbnailFile);
    if (pdfFile) formData.append('pdfFile', pdfFile);

    try {
      if (editingId) {
        await axios.put(`https://smart-pai-digital.vercel.app/api/tutorials/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        alert('Panduan berhasil diperbarui!');
      } else {
        await axios.post('https://smart-pai-digital.vercel.app/api/tutorials', formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        alert('Panduan berhasil ditambahkan!');
      }
      handleCancelEdit();
      fetchTutorials();
    } catch (error) { alert('Gagal menyimpan panduan.'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus tutorial ini?")) return;
    try {
      await axios.delete(`https://smart-pai-digital.vercel.app/api/tutorials/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      alert('Tutorial dihapus!');
      fetchTutorials();
    } catch (error) { alert('Gagal menghapus.'); }
  };

  const handleEditClick = (tutorial) => {
    setEditingId(tutorial.id); setTitle(tutorial.title); setContent(tutorial.content); setVideoUrl(tutorial.videoUrl || '');
    setThumbnailFile(null); setPdfFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null); setTitle(''); setContent(''); setVideoUrl(''); setThumbnailFile(null); setPdfFile(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b-4 border-amber-500 inline-block pb-2">
          Tutorial & Panduan
        </h1>

        {userData && userData.role === 'ADMIN' && (
          <div className={`p-6 rounded-xl shadow-md mb-10 border ${editingId ? 'bg-yellow-50 border-yellow-400' : 'bg-white border-amber-100'}`}>
            <h3 className={`text-xl font-bold mb-4 ${editingId ? 'text-yellow-700' : 'text-amber-800'}`}>
              {editingId ? 'Panel Admin: Edit Panduan' : 'Panel Admin: Buat Panduan Baru'}
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input type="text" placeholder="Judul Tutorial..." value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500" required />
              <textarea placeholder="Deskripsi atau langkah-langkah..." value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500" rows="3" required />
              
              <div className="flex flex-col md:flex-row gap-4">
                <input type="url" placeholder="Link Video (YouTube)..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500" />
                
                {/* UPLOAD FILE PDF MODUL TUTORIAL */}
                <div className="flex-1 flex flex-col bg-white p-2 border rounded-lg">
                  <label className="text-xs text-emerald-600 font-bold mb-1">Upload Modul PDF (*.pdf)</label>
                  <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files[0])} className="text-sm" />
                </div>
              </div>

              {/* UPLOAD POSTER THUMBNAIL */}
              <div className="flex flex-col bg-white p-2 border rounded-lg">
                <label className="text-xs text-gray-500 font-bold mb-1">Upload Poster/Thumbnail (JPG/PNG)</label>
                <input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files[0])} className="text-sm" required={!editingId} />
              </div>

              <div className="flex gap-4 mt-2">
                <button type="submit" disabled={loading} className={`${loading ? 'bg-gray-400' : (editingId ? 'bg-yellow-500' : 'bg-amber-500')} text-white font-bold py-2 px-6 rounded-lg transition-colors`}>
                  {loading ? 'Mengunggah...' : (editingId ? 'Simpan Perubahan' : 'Posting Tutorial')}
                </button>
                {editingId && <button type="button" onClick={handleCancelEdit} className="bg-gray-300 px-6 rounded-lg font-bold">Batal Edit</button>}
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((t) => (
            <div key={t.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 flex flex-col relative">
              {userData && userData.role === 'ADMIN' && (
                <div className="absolute top-3 right-3 flex gap-2 z-10">
                  <button onClick={() => handleEditClick(t)} className="bg-white text-gray-800 px-3 py-1 text-xs font-bold rounded shadow">Edit</button>
                  <button onClick={() => handleDelete(t.id)} className="bg-red-600 text-white px-3 py-1 text-xs font-bold rounded shadow">Hapus</button>
                </div>
              )}
              <div className="h-48 bg-amber-50 w-full border-b border-gray-100">
                <img src={t.thumbnailUrl || "https://via.placeholder.com/400x300"} alt="Thumbnail" className="w-full h-full object-cover" />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h2 className="text-lg font-bold text-gray-900 mb-2">{t.title}</h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{t.content}</p>
                <div className="mt-auto flex gap-3 mb-4">
                  {t.videoUrl && <a href={t.videoUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-gray-50 border border-gray-200 py-2 rounded-lg text-sm font-bold">Nonton Video</a>}
                  {t.pdfUrl && <a href={t.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-emerald-50 text-emerald-700 border border-emerald-200 py-2 rounded-lg text-sm font-bold">Unduh Modul PDF</a>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tutorials;