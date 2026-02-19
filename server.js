const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize SQLite database
const db = new Database('signups.db');

// Create signups table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS signups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    current_tool TEXT,
    frustration TEXT,
    would_pay TEXT,
    open_to_call TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Email capture endpoint
app.post('/api/signup', (req, res) => {
  const { email, current_tool, frustration, would_pay, open_to_call } = req.body;
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }
  
  try {
    const stmt = db.prepare(`
      INSERT INTO signups (email, current_tool, frustration, would_pay, open_to_call)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt.run(email, current_tool || null, frustration || null, would_pay || null, open_to_call || null);
    
    res.json({ success: true, message: 'Thanks for signing up!' });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get signup count (for dashboard)
app.get('/api/stats', (req, res) => {
  const count = db.prepare('SELECT COUNT(*) as count FROM signups').get();
  const recent = db.prepare('SELECT * FROM signups ORDER BY created_at DESC LIMIT 10').all();
  const wouldPay = db.prepare('SELECT COUNT(*) as count FROM signups WHERE would_pay = "yes"').get();
  
  res.json({
    total: count.count,
    wouldPay: wouldPay.count,
    recent: recent.map(r => ({ 
      email: r.email.replace(/(.{3}).*(@.*)/, '$1***$2'), // Mask email
      created: r.created_at,
      wouldPay: r.would_pay
    }))
  });
});

// Export signups (CSV)
app.get('/api/export', (req, res) => {
  const signups = db.prepare('SELECT * FROM signups ORDER BY created_at DESC').all();
  
  let csv = 'Email,Current Tool,Frustration,Would Pay,Open to Call,Created At\n';
  signups.forEach(s => {
    csv += `"${s.email}","${s.current_tool || ''}","${s.frustration || ''}","${s.would_pay || ''}","${s.open_to_call || ''}","${s.created_at}"\n`;
  });
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=hearthspace-signups.csv');
  res.send(csv);
});

// Serve landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Hearthspace landing page running on http://localhost:${PORT}`);
  console.log(`Dashboard: http://localhost:${PORT}/dashboard.html`);
});
