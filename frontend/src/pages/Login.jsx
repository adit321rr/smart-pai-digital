import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Mencegah halaman reload saat tombol diklik
    setErrorMsg(''); // Bersihkan pesan error sebelumnya

    try {
      // Mengirim data ke Backend kita di port 5001
      const response = await axios.post('https://smart-pai-digital.vercel.app/api/login', {
        email: email,
        password: password
      });

      // Jika berhasil, backend akan mengirim token. Kita simpan di Local Storage Browser
      const token = response.data.token;
      localStorage.setItem('smartpai_token', token);

      alert('Login Berhasil! Selamat datang.');
      
      // Arahkan user kembali ke halaman Home setelah sukses login
      navigate('/'); 

    } catch (error) {
      // Menangkap pesan error dari backend (misal: password salah)
      if (error.response && error.response.data.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg('Terjadi kesalahan pada server.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 border-t-8 border-blue-600">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Login <span className="text-blue-600">SMART PAI DIGITAL</span>
        </h2>

        {/* Jika ada error, tampilkan kotak merah ini */}
        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan email..."
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan password..."
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg mt-4 hover:bg-blue-700 transition-colors"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;