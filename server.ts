import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://babsgirei_db_user:Futureempire1@cluster0.vnombam.mongodb.net/future_empire?retryWrites=true&w=majority&appName=Cluster0';
const JWT_SECRET = process.env.JWT_SECRET || 'future_empire_luxury_secret_2026';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    console.log('📂 Database:', mongoose.connection.name);
  })
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// --- SCHEMAS & MODELS ---

const perfumeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  heroImage: { type: String, required: true },
  description: String,
  category: String
});

const Perfume = mongoose.models.Perfume || mongoose.model('Perfume', perfumeSchema, 'perfumes');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

// --- AUTH API ROUTES ---

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "Account created successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

// --- PRODUCT API ROUTES ---

app.get('/api/products/hero-slides', async (_req, res) => {
  try {
    const slides = await Perfume.find({}); 
    console.log(`📡 SUCCESS: Sending all ${slides.length} perfumes to frontend.`);
    res.json(slides);
  } catch (err) {
    console.error("❌ Slider Route Error:", err);
    res.status(500).json({ message: "Error fetching slider data" });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const perfumes = await Perfume.find();
    res.json(perfumes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching perfumes" });
  }
});

// GET a single product by its ID
app.get('/api/products/:id', async (req, res) => {
  try {
    // 1. Change 'Product' to 'Perfume' here
    const product = await Perfume.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found in database" });
    }
    
    res.json(product);
  } catch (error) {
    // This catch block was likely triggering the 500 error 
    // because "Product" was undefined.
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error or invalid ID format" });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const newPerfume = new Perfume(req.body);
    const savedPerfume = await newPerfume.save();
    res.status(201).json(savedPerfume);
  } catch (err) {
    res.status(400).json({ message: "Error saving perfume" });
  }
});


app.get('/', (_req, res) => {
  res.send('Future Empire API is running...');
});

// DELETE a product by ID
app.get('/api/products/delete/:id', async (req, res) => { // Using GET for a quick test, but normally app.delete
  try {
    const deletedPerfume = await Perfume.findByIdAndDelete(req.params.id);
    if (!deletedPerfume) {
      return res.status(404).json({ message: "Perfume not found" });
    }
    res.json({ message: "Scent removed from Empire collection" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
