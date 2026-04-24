// backend/routes/productRoutes.ts
import express from 'express';
import Perfume from '../models/Product'; // Ensure path is correct

const router = express.Router();



router.get('/hero-slides', async (_req, res) => {
  try {
    const slides = await Perfume.find({
      $or: [
        { name: { $regex: /m.*suf/i } },   // Finds Mosuf, Mousuf, Musuf
        { name: { $regex: /oud/i } },     // Finds anything with "Oud"
        { name: { $regex: /sultan/i } },  // Finds Sultani, Sultan
        { name: { $regex: /dhahab/i } }   // Finds Dhahab
      ]
    });
    
    console.log(`Backend found: ${slides.map(s => s.name)}`); // Check your terminal!
    res.json(slides);
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
});

export default router;

