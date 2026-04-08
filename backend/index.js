const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
require('dotenv').config();

// --- IMPORT SUPABASE ---
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5001;

// --- MESIN UPLOAD KUSTOM UNTUK SUPABASE ---
class SupabaseStorage {
  _handleFile(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Bersihkan nama file dari spasi dan karakter aneh agar URL selalu aman
    const cleanFileName = file.originalname.replace(/[^a-zA-Z0-9.\-]/g, '_');
    const fileName = `${uniqueSuffix}_${cleanFileName}`;

    const chunks = [];
    file.stream.on('data', chunk => chunks.push(chunk));
    file.stream.on('end', async () => {
      const buffer = Buffer.concat(chunks);
      
      // Upload ke Supabase
      const { data, error } = await supabase.storage
        .from('smart_pai_assets') // Nama bucket yang kamu buat
        .upload(fileName, buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (error) return cb(error);

      // Buat URL Publik
      const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/smart_pai_assets/${fileName}`;
      
      // Kembalikan URL ke rute API sebagai req.file.path
      cb(null, { path: publicUrl }); 
    });
  }
  _removeFile(req, file, cb) {
    cb(null);
  }
}
const upload = multer({ storage: new SupabaseStorage() });

app.use(cors());
app.use(express.json());

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Akses ditolak! Anda belum login." });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token tidak valid atau kedaluwarsa!" });
    req.user = user;
    next();
  });
};

app.get('/', (req, res) => res.send('API SMART-PAI Berjalan dengan Supabase Storage!'));

// --- 1. AUTH & USER ---
app.post('/api/register', async (req, res) => {
  try {
    const { name, namaLengkap, email, password, role } = req.body;
    const finalName = name || namaLengkap; 
    if (!finalName || !email || !password) return res.status(400).json({ message: "Data tidak lengkap!" });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email sudah digunakan!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { name: finalName, email, password: hashedPassword, role: role || "MEMBER" }
    });
    res.status(201).json({ message: "Berhasil didaftarkan!", user: newUser });
  } catch (error) { res.status(500).json({ message: "Terjadi kesalahan pada server." }); }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "Email tidak terdaftar!" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Password salah!" });

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ message: "Login berhasil!", token, user });
  } catch (error) { res.status(500).json({ message: "Terjadi kesalahan saat login." }); }
});

app.get('/api/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId }, select: { id: true, name: true, email: true, role: true } });
    res.status(200).json(user);
  } catch (error) { res.status(500).json({ message: "Terjadi kesalahan." }); }
});

// --- 2. ROUTES PRODUK / E-BOOK ---
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({ include: { author: { select: { name: true } } }, orderBy: { createdAt: 'desc' } });
    res.status(200).json(products);
  } catch (error) { res.status(500).json({ message: "Gagal mengambil data produk." }); }
});

app.post('/api/products', authenticateToken, upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'pdfFile', maxCount: 1 }]), async (req, res) => {
  try {
    const { title, description, category, publisher } = req.body;
    let coverUrl = null;
    let pdfUrl = null;
    
    if (req.files && req.files['coverImage']) coverUrl = req.files['coverImage'][0].path;
    if (req.files && req.files['pdfFile']) pdfUrl = req.files['pdfFile'][0].path;

    const newProduct = await prisma.product.create({
      data: { title, description, category: category || "E-BOOK", publisher, coverUrl, pdfUrl, authorId: req.user.userId }
    });
    res.status(201).json({ message: "E-Book berhasil ditambahkan!", product: newProduct });
  } catch (error) { res.status(500).json({ message: "Gagal menambah produk." }); }
});

app.put('/api/products/:id', authenticateToken, upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'pdfFile', maxCount: 1 }]), async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ message: "Akses ditolak!" });
    const { title, description, category, publisher } = req.body;
    const dataToUpdate = { title, description, category: category || "E-BOOK", publisher };
    
    if (req.files && req.files['coverImage']) dataToUpdate.coverUrl = req.files['coverImage'][0].path;
    if (req.files && req.files['pdfFile']) dataToUpdate.pdfUrl = req.files['pdfFile'][0].path;

    const updatedProduct = await prisma.product.update({ where: { id: parseInt(req.params.id) }, data: dataToUpdate });
    res.status(200).json({ message: "E-Book diperbarui!", product: updatedProduct });
  } catch (error) { res.status(500).json({ message: "Gagal memperbarui produk." }); }
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ message: "Akses ditolak!" });
    await prisma.product.delete({ where: { id: parseInt(req.params.id) } });
    res.status(200).json({ message: "Produk dihapus!" });
  } catch (error) { res.status(500).json({ message: "Gagal menghapus produk." }); }
});

// --- 3. ROUTES PUBLIKASI ---
app.get('/api/publications', async (req, res) => {
  try {
    const publications = await prisma.publication.findMany({ include: { author: { select: { name: true } } }, orderBy: { createdAt: 'desc' } });
    res.status(200).json(publications);
  } catch (error) { res.status(500).json({ message: "Gagal mengambil data." }); }
});
app.post('/api/publications', authenticateToken, async (req, res) => {
  try {
    const { title, abstract, linkUrl } = req.body;
    const newPublication = await prisma.publication.create({ data: { title, abstract, linkUrl, authorId: req.user.userId } });
    res.status(201).json({ message: "Publikasi berhasil ditambahkan!", publication: newPublication });
  } catch (error) { res.status(500).json({ message: "Gagal menambah." }); }
});
app.put('/api/publications/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ message: "Akses ditolak!" });
    const { title, abstract, linkUrl } = req.body;
    const updatedPublication = await prisma.publication.update({ where: { id: parseInt(req.params.id) }, data: { title, abstract, linkUrl } });
    res.status(200).json({ message: "Publikasi diperbarui!", publication: updatedPublication });
  } catch (error) { res.status(500).json({ message: "Gagal memperbarui." }); }
});
app.delete('/api/publications/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ message: "Akses ditolak!" });
    await prisma.publication.delete({ where: { id: parseInt(req.params.id) } });
    res.status(200).json({ message: "Publikasi dihapus!" });
  } catch (error) { res.status(500).json({ message: "Gagal menghapus." }); }
});

// --- 4. ROUTES WEBINAR ---
app.get('/api/webinars', async (req, res) => {
  try {
    const webinars = await prisma.webinar.findMany({ include: { author: { select: { name: true } } }, orderBy: { schedule: 'asc' } });
    res.status(200).json(webinars);
  } catch (error) { res.status(500).json({ message: "Gagal mengambil data webinar." }); }
});
app.post('/api/webinars', authenticateToken, upload.single('flyerImage'), async (req, res) => {
  try {
    const { title, description, schedule, meetingLink } = req.body;
    let flyerUrl = null;
    if (req.file) flyerUrl = req.file.path;
    const newWebinar = await prisma.webinar.create({ data: { title, description, schedule: new Date(schedule), meetingLink, flyerUrl, authorId: req.user.userId } });
    res.status(201).json({ message: "Webinar berhasil ditambahkan!", webinar: newWebinar });
  } catch (error) { res.status(500).json({ message: "Gagal menambah webinar." }); }
});
app.put('/api/webinars/:id', authenticateToken, upload.single('flyerImage'), async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ message: "Akses ditolak!" });
    const { title, description, schedule, meetingLink } = req.body;
    const dataToUpdate = { title, description, schedule: new Date(schedule), meetingLink };
    if (req.file) dataToUpdate.flyerUrl = req.file.path;
    const updatedWebinar = await prisma.webinar.update({ where: { id: parseInt(req.params.id) }, data: dataToUpdate });
    res.status(200).json({ message: "Webinar diperbarui!", webinar: updatedWebinar });
  } catch (error) { res.status(500).json({ message: "Gagal memperbarui webinar." }); }
});
app.delete('/api/webinars/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ message: "Akses ditolak!" });
    await prisma.webinar.delete({ where: { id: parseInt(req.params.id) } });
    res.status(200).json({ message: "Webinar dihapus!" });
  } catch (error) { res.status(500).json({ message: "Gagal menghapus webinar." }); }
});

// --- 5. ROUTES TUTORIAL ---
app.get('/api/tutorials', async (req, res) => {
  try {
    const tutorials = await prisma.tutorial.findMany({ include: { author: { select: { name: true } } }, orderBy: { createdAt: 'desc' } });
    res.status(200).json(tutorials);
  } catch (error) { res.status(500).json({ message: "Gagal mengambil data tutorial." }); }
});

app.post('/api/tutorials', authenticateToken, upload.fields([{ name: 'thumbnailImage', maxCount: 1 }, { name: 'pdfFile', maxCount: 1 }]), async (req, res) => {
  try {
    const { title, content, videoUrl } = req.body;
    let thumbnailUrl = null;
    let pdfUrl = null;
    
    if (req.files && req.files['thumbnailImage']) thumbnailUrl = req.files['thumbnailImage'][0].path;
    if (req.files && req.files['pdfFile']) pdfUrl = req.files['pdfFile'][0].path;

    const newTutorial = await prisma.tutorial.create({ data: { title, content, videoUrl, pdfUrl, thumbnailUrl, authorId: req.user.userId } });
    res.status(201).json({ message: "Tutorial berhasil ditambahkan!", tutorial: newTutorial });
  } catch (error) { res.status(500).json({ message: "Gagal menambah tutorial." }); }
});

app.put('/api/tutorials/:id', authenticateToken, upload.fields([{ name: 'thumbnailImage', maxCount: 1 }, { name: 'pdfFile', maxCount: 1 }]), async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ message: "Akses ditolak!" });
    const { title, content, videoUrl } = req.body;
    const dataToUpdate = { title, content, videoUrl };
    
    if (req.files && req.files['thumbnailImage']) dataToUpdate.thumbnailUrl = req.files['thumbnailImage'][0].path;
    if (req.files && req.files['pdfFile']) dataToUpdate.pdfUrl = req.files['pdfFile'][0].path;

    const updatedTutorial = await prisma.tutorial.update({ where: { id: parseInt(req.params.id) }, data: dataToUpdate });
    res.status(200).json({ message: "Tutorial diperbarui!", tutorial: updatedTutorial });
  } catch (error) { res.status(500).json({ message: "Gagal memperbarui tutorial." }); }
});

app.delete('/api/tutorials/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ message: "Akses ditolak!" });
    await prisma.tutorial.delete({ where: { id: parseInt(req.params.id) } });
    res.status(200).json({ message: "Tutorial dihapus!" });
  } catch (error) { res.status(500).json({ message: "Gagal menghapus tutorial." }); }
});

// --- 6. ROUTES KOMUNITAS ---
app.get('/api/community', async (req, res) => {
  try {
    const posts = await prisma.communityPost.findMany({ include: { author: { select: { name: true, role: true } } }, orderBy: { createdAt: 'desc' } });
    res.status(200).json(posts);
  } catch (error) { res.status(500).json({ message: "Gagal mengambil data forum." }); }
});
app.post('/api/community', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    const newPost = await prisma.communityPost.create({ data: { content, authorId: req.user.userId } });
    res.status(201).json({ message: "Pesan terkirim!", post: newPost });
  } catch (error) { res.status(500).json({ message: "Gagal mengirim pesan." }); }
});

app.get('/api/community/settings', async (req, res) => {
  try {
    let setting = await prisma.communitySetting.findFirst();
    if (!setting) setting = await prisma.communitySetting.create({ data: { whatsappLink: "https://chat.whatsapp.com/", qrCodeUrl: null } });
    res.status(200).json(setting);
  } catch (error) { res.status(500).json({ message: "Gagal mengambil pengaturan." }); }
});
app.put('/api/community/settings', authenticateToken, upload.single('qrImage'), async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ message: "Akses ditolak!" });
    const { whatsappLink } = req.body;
    let setting = await prisma.communitySetting.findFirst();
    const dataToUpdate = { whatsappLink };
    if (req.file) dataToUpdate.qrCodeUrl = req.file.path; 
    const updatedSetting = await prisma.communitySetting.update({ where: { id: setting.id }, data: dataToUpdate });
    res.status(200).json({ message: "Pengaturan diperbarui!", setting: updatedSetting });
  } catch (error) { res.status(500).json({ message: "Gagal memperbarui pengaturan." }); }
});
app.delete('/api/community/settings/qr', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ message: "Akses ditolak!" });
    let setting = await prisma.communitySetting.findFirst();
    await prisma.communitySetting.update({ where: { id: setting.id }, data: { qrCodeUrl: null } });
    res.status(200).json({ message: "QR Code dihapus!" });
  } catch (error) { res.status(500).json({ message: "Gagal menghapus QR Code." }); }
});

// --- 7. ROUTES BLOG ---
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await prisma.blogPost.findMany({ include: { author: { select: { name: true } } }, orderBy: { createdAt: 'desc' } });
    res.status(200).json(blogs);
  } catch (error) { res.status(500).json({ message: "Gagal mengambil data blog." }); }
});
app.get('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await prisma.blogPost.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { author: { select: { name: true } }, comments: { include: { author: { select: { name: true, role: true } } }, orderBy: { createdAt: 'desc' } } }
    });
    if (!blog) return res.status(404).json({ message: "Artikel tidak ditemukan." });
    res.status(200).json(blog);
  } catch (error) { res.status(500).json({ message: "Gagal mengambil detail blog." }); }
});
app.post('/api/blogs', authenticateToken, upload.single('blogImage'), async (req, res) => {
  try {
    const { title, content, category } = req.body;
    let imageUrl = null;
    if (req.file) imageUrl = req.file.path;
    const newBlog = await prisma.blogPost.create({ data: { title, content, category: category || "TIPS", imageUrl, authorId: req.user.userId } });
    res.status(201).json({ message: "Artikel dipublikasikan!", blog: newBlog });
  } catch (error) { res.status(500).json({ message: "Gagal mempublikasikan artikel." }); }
});
app.put('/api/blogs/:id', authenticateToken, upload.single('blogImage'), async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ message: "Akses ditolak!" });
    const { title, content, category } = req.body;
    const dataToUpdate = { title, content, category };
    if (req.file) dataToUpdate.imageUrl = req.file.path;
    const updatedBlog = await prisma.blogPost.update({ where: { id: parseInt(req.params.id) }, data: dataToUpdate });
    res.status(200).json({ message: "Artikel diperbarui!", blog: updatedBlog });
  } catch (error) { res.status(500).json({ message: "Gagal memperbarui artikel." }); }
});
app.delete('/api/blogs/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ message: "Akses ditolak!" });
    await prisma.blogPost.delete({ where: { id: parseInt(req.params.id) } });
    res.status(200).json({ message: "Artikel dihapus!" });
  } catch (error) { res.status(500).json({ message: "Gagal menghapus artikel." }); }
});
app.post('/api/blogs/:id/comments', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    const newComment = await prisma.blogComment.create({ data: { content, authorId: req.user.userId, blogPostId: parseInt(req.params.id) } });
    res.status(201).json({ message: "Komentar terkirim!", comment: newComment });
  } catch (error) { res.status(500).json({ message: "Gagal mengirim komentar." }); }
});

// --- API UNTUK MENGAMBIL DATA TESTIMONI ---
app.get('/api/testimonials', async (req, res) => {
  try {
    // Ambil data dari database, urutkan dari yang paling baru
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ error: "Gagal mengambil data testimoni" });
  }
});

// --- API UNTUK MENYIMPAN TESTIMONI BARU ---
app.post('/api/testimonials', async (req, res) => {
  try {
    const { name, role, text, imageUrl } = req.body;
    
    // Simpan ke database Prisma
    const newTestimonial = await prisma.testimonial.create({
      data: {
        name,
        role,
        text,
        imageUrl // Berisi link foto dari Supabase
      }
    });
    
    res.status(201).json(newTestimonial);
  } catch (error) {
    console.error("Error creating testimonial:", error);
    res.status(500).json({ error: "Gagal mengirim testimoni" });
  }
});

// --- KODE PALING BAWAH INDEX.JS ---
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server Backend berjalan di http://localhost:${PORT}`);
  });
}

// Wajib diexport agar bisa dibaca oleh Vercel
module.exports = app;