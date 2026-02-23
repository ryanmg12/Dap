const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rate limiting: general API limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

// Stricter limit for write operations
const writeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions, please try again later.' },
});

app.use('/api/', apiLimiter);

// Serve built React app
const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));

// GET all businesses with optional search and category filter
app.get('/api/businesses', (req, res) => {
  const { search, category, city } = req.query;
  let query = `
    SELECT b.*, 
      ROUND(AVG(r.rating), 1) as avg_rating,
      COUNT(r.id) as review_count
    FROM businesses b
    LEFT JOIN reviews r ON b.id = r.business_id
  `;
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push(`(b.name LIKE ? OR b.description LIKE ? OR b.category LIKE ?)`);
    const term = `%${search}%`;
    params.push(term, term, term);
  }
  if (category && category !== 'All') {
    conditions.push(`b.category = ?`);
    params.push(category);
  }
  if (city) {
    conditions.push(`b.city = ?`);
    params.push(city);
  }

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(' AND ');
  }

  query += ` GROUP BY b.id ORDER BY b.name ASC`;

  try {
    const businesses = db.prepare(query).all(...params);
    res.json(businesses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single business by ID
app.get('/api/businesses/:id', (req, res) => {
  try {
    const business = db.prepare(`
      SELECT b.*, 
        ROUND(AVG(r.rating), 1) as avg_rating,
        COUNT(r.id) as review_count
      FROM businesses b
      LEFT JOIN reviews r ON b.id = r.business_id
      WHERE b.id = ?
      GROUP BY b.id
    `).get(req.params.id);

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }
    res.json(business);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new business
app.post('/api/businesses', writeLimiter, (req, res) => {
  const { name, category, description, address, city, state, phone, website, image_url, owner_name } = req.body;

  if (!name || !category) {
    return res.status(400).json({ error: 'Name and category are required' });
  }

  try {
    const result = db.prepare(`
      INSERT INTO businesses (name, category, description, address, city, state, phone, website, image_url, owner_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, category, description || null, address || null, city || null, state || null, phone || null, website || null, image_url || null, owner_name || null);

    const business = db.prepare('SELECT * FROM businesses WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(business);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET reviews for a business
app.get('/api/businesses/:id/reviews', (req, res) => {
  try {
    const reviews = db.prepare(`
      SELECT * FROM reviews WHERE business_id = ? ORDER BY created_at DESC
    `).all(req.params.id);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add a review for a business
app.post('/api/businesses/:id/reviews', writeLimiter, (req, res) => {
  const { reviewer_name, rating, comment } = req.body;
  const business_id = req.params.id;

  if (!reviewer_name || !rating) {
    return res.status(400).json({ error: 'Reviewer name and rating are required' });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  // Check business exists
  const business = db.prepare('SELECT id FROM businesses WHERE id = ?').get(business_id);
  if (!business) {
    return res.status(404).json({ error: 'Business not found' });
  }

  try {
    const result = db.prepare(`
      INSERT INTO reviews (business_id, reviewer_name, rating, comment)
      VALUES (?, ?, ?, ?)
    `).run(business_id, reviewer_name, rating, comment || null);

    const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET categories list
app.get('/api/categories', (req, res) => {
  try {
    const categories = db.prepare(`
      SELECT DISTINCT category FROM businesses ORDER BY category ASC
    `).all();
    res.json(categories.map(c => c.category));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET featured businesses (top rated)
app.get('/api/featured', (req, res) => {
  try {
    const featured = db.prepare(`
      SELECT b.*, 
        ROUND(AVG(r.rating), 1) as avg_rating,
        COUNT(r.id) as review_count
      FROM businesses b
      LEFT JOIN reviews r ON b.id = r.business_id
      GROUP BY b.id
      ORDER BY avg_rating DESC, b.name ASC
      LIMIT 6
    `).all();
    res.json(featured);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Catch-all: serve React app for client-side routes
app.get('/{*path}', apiLimiter, (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Dap API server running on http://localhost:${PORT}`);
});
