import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('MEMBER'); // Default role adalah MEMBER
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      await axios.post('https://smart-pai-digital.vercel.app/api/register', {
        name,
        email,
        password,
        role
      });

      alert('Pendaftaran Berhasil! Silakan Login.');
      navigate('/login'); // Arahkan ke halaman login setelah sukses daftar
    } catch (error) {
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
          Daftar <span className="text-blue-600">SMART PAI DIGITAL</span>
        </h2>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Nama Lengkap</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan nama Anda..."
              required
            />
          </div>

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
              placeholder="Buat password..."
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Daftar Sebagai</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="MEMBER">Member (Guru/Siswa)</option>
              <option value="ADMIN">Admin (Pengelola)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">*Opsi Admin dimunculkan sementara untuk keperluan testing.</p>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg mt-2 hover:bg-blue-700 transition-colors"
          >
            Buat Akun
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Sudah punya akun? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;