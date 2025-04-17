const express = require('express');
const multer = require('multer');
const whisper = require('whisper');
const { detect } = require('langdetect');
const fs = require('fs');
const app = express();
const port = 3001;

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'temp_audio/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Define video databases
const englishVideos = {
  "How to add a product in Tijarah360": "https://youtu.be/gni702igl7M",
  "How to add a printer in Tijarah360": "https://youtu.be/pATScZzqukI",
  "How to scan a product in Tijarah360": "https://youtu.be/KqfpV3YMyX4",
  "How to generate a bill in Tijarah360": "https://youtu.be/pvSZUg79P5o",
  "Complete POS setup guide": "https://youtu.be/tT1ovJG7SIo",
  "Tijarah360 stock updates": "https://youtube.com/shorts/QgtyLTZQIng",
  "Update the price": "https://youtube.com/shorts/n3szo9UAWUc"
  // Add more English video links here
};

const urduVideos = {
  "تجارہ 360 POS شروع کرنے سے پہلے ترتیب دینے کی ضروری ترتیبات": "https://youtu.be/UhaO1hc5Bug",
  "T 360 POS ڈیوائس میں لاگ اِن کرنے کا طریقہ": "https://youtu.be/enJ8wAC2e40",
  "T 360 POS ڈیوائس میں لاگ اِن کرنے کا طریقہ": "https://youtu.be/enJ8wAC2e40",
  "T 360 POS میں پرنٹر شامل کرنے کا طریقہ": "https://youtu.be/4E_-w-NG7wo",
  "T 360 POS میں پروڈکٹ شامل کرنے کا طریقہ": "https://youtu.be/RCvAmpn5gGc",
  "T 360 POS میں بل بنانے کا طریقہ": "https://youtu.be/Njg7ygcp8e0",
  "POS سیٹ اپ کرنے کی مکمل گائیڈ": "https://youtu.be/Eg-Aq6hkKeo",
  "T 360 POS میں بارکوڈ اسکینر کے ذریعے پروڈکٹ شامل کرنے کا طریقہ": "https://youtu.be/6lG0E7RIwag"
  // Add more Urdu video links here
};

app.post('/upload', upload.single('audioFile'), async (req, res) => {
  try {
    const filePath = req.file.path;

    // Transcribe the audio using Whisper model (ensure you have Whisper installed)
    const result = await whisper.transcribe(filePath, { language: 'auto' });
    const transcription = result.text;

    // Detect language
    const language = detect(transcription);

    let videoUrl = null;

    // Suggest video based on language and transcription
    if (language === 'en') {
      videoUrl = Object.keys(englishVideos).find(key => transcription.toLowerCase().includes(key.toLowerCase()));
    } else if (language === 'ur') {
      videoUrl = Object.keys(urduVideos).find(key => transcription.toLowerCase().includes(key.toLowerCase()));
    }

    // Respond with transcription and video URL
    if (videoUrl) {
      res.status(200).json({ transcribed: transcription, videoUrl: (language === 'en' ? englishVideos[videoUrl] : urduVideos[videoUrl]) });
    } else {
      res.status(200).json({ transcribed: transcription, videoUrl: 'No matching video found' });
    }

    // Clean up the temporary audio file
    fs.unlinkSync(filePath);
  } catch (error) {
    res.status(500).send('Error processing the file');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
