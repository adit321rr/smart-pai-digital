import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// IMPORT REACT QUILL DAN TEMA CSS-NYA
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [userData, setUserData] = useState(null);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); // Sekarang ini akan menyimpan format HTML
  const [category, setCategory] = useState('TIPS');
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  
  const token = localStorage.getItem('smartpai_token');

  // Konfigurasi Toolbar (Menu atas) untuk React Quill
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }], // Menu Heading 1, 2, 3
      ['bold', 'italic', 'underline', 'strike', 'blockquote'], // Menu teks
      [{'list': 'ordered'}, {'list': 'bullet'}], // Menu list
      ['link', 'image'], // <--- INI DIA TOMBOL UNTUK MASUKIN GAMBAR DI TENGAH TEKS!
      ['clean'] // Tombol hapus format
    ],
  };

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('https://smart-pai-digital.vercel.app/api/blogs');
      setBlogs(response.data);
    } catch (error) { console.error(error); }
  };

  const fetchProfile = async () => {
    if (token) {
      try {
        const response = await axios.get('https://smart-pai-digital.vercel.app/api/me', { headers: { Authorization: `Bearer ${token}` } });
        setUserData(response.data);
      } catch (error) { console.error(error); }
    }
  };

  useEffect(() => { fetchBlogs(); fetchProfile(); }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    if (imageFile) formData.append('blogImage', imageFile);

    try {
      if (editingId) {
        await axios.put(`https://smart-pai-digital.vercel.app/api/blogs/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        alert('Artikel berhasil diperbarui!');
      } else {
        await axios.post('https://smart-pai-digital.vercel.app/api/blogs', formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        alert('Artikel berhasil diterbitkan!');
      }
      handleCancelEdit();
      fetchBlogs();
    } catch (error) { alert('Gagal menyimpan artikel.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus artikel ini?")) return;
    try {
      await axios.delete(`https://smart-pai-digital.vercel.app/api/blogs/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      alert('Artikel dihapus!');
      fetchBlogs();
    } catch (error) { alert('Gagal menghapus.'); }
  };

  const handleEditClick = (blog) => {
    setEditingId(blog.id); setTitle(blog.title); setContent(blog.content); setCategory(blog.category); setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null); setTitle(''); setContent(''); setCategory('TIPS'); setImageFile(null);
  };

  // Fungsi untuk membuang tag HTML dari tampilan preview agar lebih rapi
  const stripHtml = (html) => {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b-4 border-slate-800 inline-block pb-2">
          Blog & Berita Penelitian 
        </h1>

        {userData && userData.role === 'ADMIN' && (
          <div className={`p-6 rounded-xl shadow-md mb-10 border ${editingId ? 'bg-yellow-50 border-yellow-400' : 'bg-white border-slate-200'}`}>
            <h3 className="text-xl font-bold text-slate-800 mb-4">{editingId ? 'Edit Artikel' : 'Tulis Artikel Baru'}</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <input type="text" placeholder="Judul Artikel..." value={title} onChange={(e) => setTitle(e.target.value)} className="flex-1 p-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-slate-500" required />
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-slate-500">
                  <option value="TIPS">Tips</option><option value="BERITA">Berita</option><option value="INSIGHT">Insight</option>
                </select>
              </div>
              
              {/* REACT QUILL EDITOR PENGGANTI TEXTAREA */}
              <div className="bg-white rounded-lg">
                <ReactQuill 
                  theme="snow" 
                  value={content} 
                  onChange={setContent} 
                  modules={quillModules}
                  className="h-64 mb-12" // Diberi margin bawah agar toolbar bawah tidak tertutup
                />
              </div>
              
              <div className="flex flex-col bg-white p-2 border rounded-lg mt-4">
                <label className="text-xs text-gray-500 font-bold mb-1">Upload Gambar Cover Utama (JPG/PNG)</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="text-sm" required={!editingId} />
              </div>

              <div className="flex gap-4">
                <button type="submit" className="bg-slate-800 text-white font-bold py-2 px-6 rounded-lg hover:bg-slate-900">{editingId ? 'Simpan' : 'Terbitkan'}</button>
                {editingId && <button type="button" onClick={handleCancelEdit} className="bg-gray-300 px-6 rounded-lg font-bold">Batal</button>}
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map((blog) => (
            <article key={blog.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 flex flex-col relative hover:shadow-md transition">
              {userData && userData.role === 'ADMIN' && (
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                  <button onClick={() => handleEditClick(blog)} className="bg-white px-3 py-1 text-xs font-bold rounded shadow">Edit</button>
                  <button onClick={() => handleDelete(blog.id)} className="bg-red-600 text-white px-3 py-1 text-xs font-bold rounded shadow">Hapus</button>
                </div>
              )}

              <div className="h-48 bg-slate-100">
                <img src={blog.imageUrl || "https://via.placeholder.com/600x400"} alt="Cover" className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded w-fit mb-2">{blog.category}</span>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{blog.title}</h2>
                {/* Gunakan stripHtml untuk preview agar kode HTML tidak kelihatan di depan */}
                <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">{stripHtml(blog.content)}</p>
                
                <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-xs text-gray-400">Oleh: <span className="font-semibold text-gray-600">{blog.author?.name}</span></span>
                  <Link to={`/blogs/${blog.id}`} className="text-sm font-bold text-slate-800 hover:text-emerald-600 hover:underline">
                    Baca Selengkapnya →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;