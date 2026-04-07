import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Ebooks = () => {
  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [publisher, setPublisher] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  
  // State BARU untuk File PDF
  const [pdfFile, setPdfFile] = useState(null); 
  
  const [editingId, setEditingId] = useState(null);
  
  const token = localStorage.getItem('smartpai_token');

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://smart-pai-digital.vercel.app/api/products');
      setProducts(response.data);
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

  useEffect(() => { fetchProducts(); fetchProfile(); }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('publisher', publisher);
    
    if (coverImage) formData.append('coverImage', coverImage);
    // Masukkan file PDF ke dalam FormData jika Admin meng-upload
    if (pdfFile) formData.append('pdfFile', pdfFile); 

    try {
      if (editingId) {
        await axios.put(`https://smart-pai-digital.vercel.app/api/products/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        alert('E-Book diperbarui!');
      } else {
        await axios.post('https://smart-pai-digital.vercel.app/api/products', formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        alert('E-Book berhasil ditambahkan!');
      }
      handleCancelEdit();
      fetchProducts();
    } catch (error) { alert('Gagal menyimpan E-Book. Pastikan server nyala dan file tidak terlalu besar.'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus produk ini?")) return;
    try {
      await axios.delete(`https://smart-pai-digital.vercel.app/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      alert('Produk dihapus!');
      fetchProducts();
    } catch (error) { alert('Gagal menghapus.'); }
  };

  const handleEditClick = (product) => {
    setEditingId(product.id); setTitle(product.title); setDescription(product.description); setPublisher(product.publisher || '');
    setCoverImage(null); setPdfFile(null); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null); setTitle(''); setDescription(''); setPublisher(''); setCoverImage(null); setPdfFile(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b-4 border-blue-600 inline-block pb-2">
          Koleksi E-Book & Modul
        </h1>

        {/* --- FORM ADMIN --- */}
        {userData && userData.role === 'ADMIN' && (
          <div className={`p-6 rounded-xl shadow-md mb-10 border ${editingId ? 'bg-yellow-50 border-yellow-400' : 'bg-white border-blue-100'}`}>
            <h3 className={`text-xl font-bold mb-4 ${editingId ? 'text-yellow-700' : 'text-blue-800'}`}>
              {editingId ? 'Panel Admin: Edit E-Book' : 'Panel Admin: Tambah E-Book'}
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <input type="text" placeholder="Judul E-Book..." value={title} onChange={(e) => setTitle(e.target.value)} className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" required />
                <input type="text" placeholder="Nama Penerbit..." value={publisher} onChange={(e) => setPublisher(e.target.value)} className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" required />
              </div>
              <textarea placeholder="Deskripsi singkat..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" rows="3" required />
              
              <div className="flex flex-col md:flex-row gap-4">
                {/* UPLOAD FILE PDF */}
                <div className="flex-1 flex flex-col bg-white p-2 border rounded-lg">
                  <label className="text-xs text-red-500 font-bold mb-1">Upload File PDF Modul (*.pdf)</label>
                  <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files[0])} className="text-sm" required={!editingId} />
                </div>
                {/* UPLOAD GAMBAR COVER */}
                <div className="flex-1 flex flex-col bg-white p-2 border rounded-lg">
                  <label className="text-xs text-gray-500 font-bold mb-1">Upload Gambar Cover (JPG/PNG)</label>
                  <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files[0])} className="text-sm" required={!editingId} />
                </div>
              </div>

              <div className="flex gap-4 mt-2">
                <button type="submit" disabled={loading} className={`${loading ? 'bg-gray-400' : (editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700')} text-white font-bold py-2 px-6 rounded-lg transition-colors`}>
                  {loading ? 'Mengunggah...' : (editingId ? 'Simpan Perubahan' : 'Upload E-Book')}
                </button>
                {editingId && <button type="button" onClick={handleCancelEdit} className="bg-gray-300 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-400 transition-colors">Batal Edit</button>}
              </div>
            </form>
          </div>
        )}

        {/* --- DAFTAR PRODUK --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <p className="text-gray-500 italic col-span-full">Belum ada E-Book yang diunggah.</p>
          ) : (
            products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col relative hover:shadow-lg transition-shadow">
                {userData && userData.role === 'ADMIN' && (
                  <div className="absolute top-2 right-2 flex gap-2 z-10">
                    <button onClick={() => handleEditClick(product)} className="bg-yellow-400 text-yellow-900 w-8 h-8 rounded-full font-bold text-sm shadow">✏️</button>
                    <button onClick={() => handleDelete(product.id)} className="bg-red-600 text-white w-8 h-8 rounded-full font-bold text-sm shadow">X</button>
                  </div>
                )}
                <div className="h-64 bg-gray-200">
                  <img src={product.coverUrl || "https://via.placeholder.com/300x400"} alt={product.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <span className="text-[10px] font-bold uppercase text-gray-500 mb-1">{product.publisher}</span>
                  <h2 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{product.title}</h2>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">{product.description}</p>
                  
               {/* TOMBOL BACA PDF (NATIVE SUPABASE) */}
                  {product.pdfUrl ? (
                    <a 
                      href={product.pdfUrl}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="mt-auto block text-center bg-blue-50 text-blue-700 border border-blue-200 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition shadow-sm"
                    >
                      Buka PDF &rarr;
                    </a>
                  ) : (
                    <span className="mt-auto block text-center bg-gray-100 text-gray-400 py-2 rounded-lg text-sm font-bold">PDF Tidak Tersedia</span>
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

export default Ebooks;