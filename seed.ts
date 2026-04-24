import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

//  SCHEMA 
const perfumeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },     
  heroImage: { type: String, required: true }, 
  description: { type: String },
  category: { type: String }
});

const Perfume = mongoose.model('Perfume', perfumeSchema);

const samplePerfumes = [
  {
    name: "Mosuf",
    brand: "Ard Al Zaafaran",
    price: 15000,
    image: "/images/mosuf7.jpg",
    heroImage: "/images/mosuf7.jpg", 
    description: "Deep woody scent with chocolate notes.",
    category: "Oud"
  },
  {
    name: "Oud 24 Hours",
    brand: "Ard Al Zaafaran",
    price: 12000,
    image: "/images/oud-24.jpg",     
    heroImage: "/images/oud-24.jpg", 
    description: "Long-lasting oriental fragrance.",
    category: "Oriental"
  },
   {
    name: "Imperial Musk",
    brand: "Sultani",
    price: 12000,
    image: "/images/sultani.png",     
    heroImage:  "/images/sultani.png", 
    description: ": A cool, vibrant, and elegant `Imperial Blue` environment.",
    category: "Oriental"
  },
 {
    name: "Desert Gold Rose",
    brand: "Dhahab",
    price: 12000,
    image: "/images/dhahab.png",     
    heroImage:  "/images/dhahab.png",
    description: "A bright, minimal, and high-key. Desert Gold environment.",
    category: "Oriental"
  }  

];

const seedDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb+srv://babsgirei_db_user:PIih38Gpe0lNVKZU@cluster0.vnombam.mongodb.net/future_empire?retryWrites=true&w=majority&appName=Cluster0';
    
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(uri);
    
    console.log("Cleaning old data...");
    await Perfume.deleteMany({});
    
    console.log("Inserting new perfumes...");
    await Perfume.insertMany(samplePerfumes);
    
    console.log("✅ Database Seeded Successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
};

seedDB();