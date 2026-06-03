const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Post = require('../models/Post');
const Message = require('../models/Message');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Atlas bağlantısı başarılı!'))
    .catch(err => console.error('Bağlantı hatası:', err));

// API Yolları
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/posts', async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.post('/api/contact', async (req, res) => {
    const newMessage = new Message(req.body);
    try {
        const savedMessage = await newMessage.save();
        res.status(201).json({ success: true, data: savedMessage });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// Vercel'in bu dosyayı API olarak tanıması için bu satır şart:
module.exports = app;