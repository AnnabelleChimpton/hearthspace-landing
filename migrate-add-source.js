// Migration: Add source column to existing signups table
const Database = require('better-sqlite3');
const db = new Database('signups.db');

try {
  // Check if source column exists
  const tableInfo = db.prepare("PRAGMA table_info(signups)").all();
  const hasSource = tableInfo.some(col => col.name === 'source');
  
  if (!hasSource) {
    console.log('Adding source column...');
    db.exec(`ALTER TABLE signups ADD COLUMN source TEXT DEFAULT 'direct'`);
    console.log('✅ Source column added successfully');
  } else {
    console.log('✅ Source column already exists');
  }
  
  // Verify
  const afterInfo = db.prepare("PRAGMA table_info(signups)").all();
  console.log('\nTable schema:');
  afterInfo.forEach(col => {
    console.log(`  ${col.name}: ${col.type}${col.dflt_value ? ` DEFAULT ${col.dflt_value}` : ''}`);
  });
  
} catch (err) {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
}

db.close();
console.log('\n✅ Migration complete');
