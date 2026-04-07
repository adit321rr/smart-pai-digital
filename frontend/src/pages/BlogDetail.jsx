import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const BlogDetail = () => {
  const { id } = useParams(); // Mengambil ID dari URL
  const [blog, setBlog] = useState(null);
  const [commentText, setCommentText] = useState('');
  const token = localStorage.getItem('smartpai_token');

  const fetchBlogDetail = async () => {
    try {
      const response = await axios.get(`https://smart-pai-digital.vercel.app/api/blogs/${id}`);
      setBlog(response.data);
    } catch (error) { console.error("Gagal mengambil detail blog", error); }
  };

  useEffect(() => { fetchBlogDetail(); }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`https://smart-pai-digital.vercel.app/api/blogs/${id}/comments`, 
        { content: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentText('');
      fetchBlogDetail(); // Refresh data untuk memunculkan komentar baru
    } catch (error) { alert('Gagal mengirim komentar. Pastikan Anda sudah login.'); }
  };

  if (!blog) return <div className="text-center py-20 font-bold text-gray-500">Memuat artikel...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* HEADER GAMBAR */}
      <div className="w-full h-[400px] bg-slate-200 relative">
        <img src={blog.imageUrl || "https://via.placeholder.com/1200x600"} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
          <div className="max-w-4xl mx-auto px-6 w-full pb-10">
            <span className="bg-blue-600 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 inline-block">
              {blog.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">{blog.title}</h1>
            <p className="text-gray-300 text-sm">Ditulis oleh: <span className="font-bold text-white">{blog.author?.name}</span> • {new Date(blog.createdAt).toLocaleDateString('id-ID')}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-8">
        <Link to="/blogs" className="text-blue-600 font-bold hover:underline mb-8 inline-block">← Kembali ke Daftar Blog</Link>
        
       {/* ISI ARTIKEL */}
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 mb-10 overflow-hidden">
          {/* dangerouslySetInnerHTML mengubah string HTML dari React Quill menjadi elemen visual nyata */}
          <div 
            className="prose max-w-none text-gray-800 text-lg leading-loose ql-editor"
            dangerouslySetInnerHTML={{ __html: blog.content }} 
          />
        </div>

        {/* BAGIAN KOMENTAR */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Komentar Pembaca ({blog.comments.length})</h3>
          
          {/* Form Kirim Komentar */}
          {token ? (
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <textarea 
                placeholder="Tulis pendapat Anda tentang artikel ini..." 
                value={commentText} onChange={(e) => setCommentText(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                rows="3" required
              />
              <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-8 rounded-xl hover:bg-blue-700">Kirim Komentar</button>
            </form>
          ) : (
            <div className="bg-blue-50 text-blue-700 p-4 rounded-xl mb-8 text-center">
              Silakan <Link to="/login" className="font-bold underline">Login</Link> untuk ikut berkomentar.
            </div>
          )}

          {/* Daftar Komentar */}
          <div className="space-y-6">
            {blog.comments.length === 0 ? (
              <p className="text-gray-400 italic text-center py-4">Jadilah yang pertama berkomentar!</p>
            ) : (
              blog.comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-10 h-10 bg-slate-200 text-slate-700 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {comment.author?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl rounded-tl-none border border-gray-100 flex-1">
                    <div className="flex justify-between items-end mb-1">
                      <span className="font-bold text-sm text-gray-800">{comment.author?.name}</span>
                      <span className="text-[10px] text-gray-400">{new Date(comment.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BlogDetail;