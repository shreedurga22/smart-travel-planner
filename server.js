import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import tipsData from "./tips.json" assert { type: "json" };

dotenv.config();
const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Photos (Unsplash)
app.get("/api/photos", async (req,res)=>{
  const { place } = req.query;
  try{
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(place)}&per_page=9&client_id=${process.env.UNSPLASH_KEY}`;
    const data = await (await fetch(url)).json();
    res.json(data);
  }catch(e){console.error(e);res.status(500).json({error:"Failed to fetch photos"});}
});

// Weather (OpenWeatherMap)
app.get("/api/weather", async (req,res)=>{
  const { place } = req.query;
  try{
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(place)}&APPID=${process.env.OWM_KEY}&units=metric`;
    const data = await (await fetch(url)).json();
    res.json(data);
  }catch(e){console.error(e);res.status(500).json({error:"Failed to fetch weather"});}
});

// Nearby (Google Places)
app.get("/api/nearby", async (req,res)=>{
  const { lat, lon, type } = req.query; 
  if(!lat || !lon || !type) return res.status(400).json({error:"lat, lon, type required"});
  try{
    const radius = 5000;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radius}&type=${type}&key=${process.env.GOOGLE_KEY}`;
    const data = await (await fetch(url)).json();
    res.json(data);
  }catch(e){console.error(e);res.status(500).json({error:"Failed to fetch nearby places"});}
});

// Tips
app.get("/api/tips", (req,res)=>{
  const { city } = req.query;
  res.json(tipsData[city] || {});
});

app.listen(PORT, ()=>console.log(`Server running at http://localhost:${PORT}`));
