const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Middleware untuk parsing JSON
app.use(express.json());

// Koneksi ke MongoDB
mongoose.connect('mongodb://mongo:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Definisikan schema dan model untuk data
const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true },
});

const Item = mongoose.model('Item', ItemSchema);

// Route untuk mendapatkan semua data
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route untuk menambahkan item baru
app.post('/items', async (req, res) => {
  const { name, gender } = req.body;
  const newItem = new Item({ name, gender });

  try {
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route untuk memperbarui item berdasarkan ID
app.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { name, gender } = req.body;

  try {
    const item = await Item.findByIdAndUpdate(id, { name, gender }, { new: true });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route untuk menghapus item berdasarkan ID
app.delete('/items/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Item.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Menjalankan server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
