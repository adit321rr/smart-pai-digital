import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Webinars = () => {
  const [webinars, setWebinars] = useState([]);
  const [userData, setUserData] = useState(null);
  
  // State Input Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [schedule, setSchedule] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  
  // State File & Edit
  const [flyerFile, setFlyerFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  
  const token = localStorage.getItem('smartpai_token');

  const fetchWebinars = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/webinars');
      setWebinars(response.data);
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
    fetchWebinars();
    fetchProfile();
  }, [token]);

  // --- FUNGSI SIMPAN DENGAN FORM DATA ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('schedule', schedule);
    formData.append('meetingLink', meetingLink);
    
    if (flyerFile) {
      formData.append('flyerImage', flyerFile);
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:5001/api/webinars/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        alert('Jadwal Pelatihan berhasil diperbarui!');
      } else {
        await axios.post('http://localhost:5001/api/webinars', formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        alert('Jadwal Pelatihan berhasil ditambahkan!');
      }
      
      handleCancelEdit();
      fetchWebinars();
    } catch (error) {
      alert('Gagal menyimpan jadwal pelatihan.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus jadwal ini?")) return;
    try {
      await axios.delete(`http://localhost:5001/api/webinars/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      alert('Jadwal pelatihan dihapus!');
      fetchWebinars();
    } catch (error) { alert('Gagal menghapus.'); }
  };

  const handleEditClick = (webinar) => {
    setEditingId(webinar.id);
    setTitle(webinar.title);
    setDescription(webinar.description);
    // Format tanggal ISO dari DB agar cocok dengan input type="datetime-local"
    setSchedule(new Date(webinar.schedule).toISOString().slice(0, 16));
    setMeetingLink(webinar.meetingLink || '');
    setFlyerFile(null); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle(''); setDescription(''); setSchedule(''); setMeetingLink(''); setFlyerFile(null);
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b-4 border-green-600 inline-block pb-2">
          Pelatihan & Webinar 
        </h1>

        {/* --- FORM ADMIN --- */}
        {userData && userData.role === 'ADMIN' && (
          <div className={`p-6 rounded-xl shadow-md mb-10 border ${editingId ? 'bg-yellow-50 border-yellow-400' : 'bg-white border-green-100'}`}>
            <h3 className={`text-xl font-bold mb-4 ${editingId ? 'text-yellow-700' : 'text-green-800'}`}>
              {editingId ? 'Panel Admin: Edit Jadwal Pelatihan' : 'Panel Admin: Buat Jadwal Baru'}
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input type="text" placeholder="Judul Pelatihan/Webinar..." value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 bg-white" required />
              <textarea placeholder="Deskripsi materi pelatihan..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 bg-white" rows="3" required />
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full">
                  <label className="block text-sm text-gray-600 font-bold mb-1">Jadwal Pelaksanaan</label>
                  <input type="datetime-local" value={schedule} onChange={(e) => setSchedule(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 bg-white" required />
                </div>
                <div className="w-full">
                  <label className="block text-sm text-gray-600 font-bold mb-1">Link Pertemuan (Zoom/Meet)</label>
                  <input type="url" placeholder="https://zoom.us/j/..." value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 bg-white" />
                </div>
              </div>

              {/* UPLOAD FLYER */}
              <div className="flex flex-col bg-white p-2 border rounded-lg">
                <label className="text-xs text-gray-500 font-bold mb-1">Upload Flyer / Poster (JPG/PNG)</label>
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/jpg" 
                  onChange={(e) => setFlyerFile(e.target.files[0])} 
                  className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer" 
                  required={!editingId} 
                />
              </div>

              <div className="flex gap-4 mt-2">
                <button type="submit" className={`${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'} text-white font-bold py-2 px-6 rounded-lg transition-colors`}>
                  {editingId ? 'Simpan Perubahan' : 'Buat Jadwal'}
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

        {/* --- DAFTAR WEBINAR DENGAN FLYER --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {webinars.length === 0 ? (
            <p className="text-gray-500 italic col-span-full">Belum ada jadwal pelatihan dalam waktu dekat.</p>
          ) : (
            webinars.map((webinar) => (
              <div key={webinar.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 flex flex-col hover:shadow-lg transition-shadow relative">
                
                {/* TOMBOL EDIT & HAPUS (Hanya Admin) */}
                {userData && userData.role === 'ADMIN' && (
                  <div className="absolute top-2 right-2 flex gap-2 z-10">
                    <button onClick={() => handleEditClick(webinar)} className="bg-yellow-400 text-yellow-900 w-8 h-8 flex justify-center items-center rounded-full shadow-md font-bold text-sm">✏️</button>
                    <button onClick={() => handleDelete(webinar.id)} className="bg-red-600 text-white w-8 h-8 flex justify-center items-center rounded-full shadow-md font-bold text-sm">X</button>
                  </div>
                )}

                {/* Gambar Flyer */}
                <div className="h-48 bg-green-50 w-full border-b border-gray-100">
                  <img 
                    src={webinar.flyerUrl || "https://via.placeholder.com/400x300?text=Webinar+SMART-PAI"} 
                    alt={webinar.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                {/* Info Webinar */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded inline-block w-fit mb-2">
                    📅 {formatDate(webinar.schedule)}
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{webinar.title}</h2>
                  <p className="text-gray-600 text-xs mb-4 line-clamp-3">{webinar.description}</p>
                  
                  <div className="mt-auto pt-4 flex gap-2 border-t border-gray-50">
                    {webinar.meetingLink ? (
                      <a href={webinar.meetingLink} target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white text-center text-sm font-bold py-2 w-full rounded-lg hover:bg-green-700">
                        Gabung Ruangan
                      </a>
                    ) : (
                      <span className="bg-gray-200 text-gray-500 text-center text-sm font-bold py-2 w-full rounded-lg cursor-not-allowed">
                        Link Belum Tersedia
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Webinars;