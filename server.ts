import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;
const ADMIN_PIN = process.env.ADMIN_PIN || 'admin123';

app.use(express.json());

// Initialize Supabase if credentials are provided
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
let supabase: any = null;

if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-supabase-project')) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase integrated successfully.');
  } catch (err) {
    console.error('❌ Failed to initialize Supabase client:', err);
  }
} else {
  console.log('ℹ️ Supabase credentials not found or are default. Using local persistent JSON database.');
}

// Ensure local JSON DB exists
const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

function ensureDbExists() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ enquiries: [], contacts: [] }, null, 2));
  }
}

ensureDbExists();

// Helper to read local DB
function readLocalDb() {
  ensureDbExists();
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading local DB:', err);
    return { enquiries: [], contacts: [] };
  }
}

// Helper to write local DB
function writeLocalDb(data: any) {
  ensureDbExists();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing local DB:', err);
  }
}

// Middleware to authenticate Admin request
const adminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const pin = req.headers['x-admin-pin'] || req.query.pin;
  if (pin === ADMIN_PIN) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized: Invalid Admin PIN' });
  }
};

// =================== API ENDPOINTS ===================

// Check Admin Pin status
app.post('/api/admin/verify', (req, res) => {
  const { pin } = req.body;
  if (pin === ADMIN_PIN) {
    res.json({ success: true, message: 'Authenticated successfully' });
  } else {
    res.status(401).json({ success: false, error: 'Invalid PIN. Please try again.' });
  }
});

// Create membership enquiry
app.post('/api/enquiries', async (req, res) => {
  const { name, email, phone, plan, message } = req.body;

  if (!name || !email || !phone || !plan) {
    return res.status(400).json({ error: 'All fields (name, email, phone, plan) are required.' });
  }

  const newEnquiry = {
    id: 'enq_' + Math.random().toString(36).substr(2, 9),
    name,
    email,
    phone,
    plan,
    message: message || '',
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  // If Supabase is active, try writing to it first
  if (supabase) {
    try {
      console.log('[Server] Attempting Supabase insertion into primary table: gym_memberships');
      const { data, error: gymError } = await supabase
        .from('gym_memberships')
        .insert([{ 
          id: newEnquiry.id,
          name, 
          email, 
          phone, 
          plan, 
          message: newEnquiry.message, 
          status: newEnquiry.status, 
          created_at: newEnquiry.createdAt 
        }])
        .select();

      if (!gymError) {
        console.log('✅ Registration successfully stored in Supabase (gym_memberships).');
        return res.status(201).json(newEnquiry);
      }

      console.warn('⚠️ Primary table gym_memberships insert failed, attempting enquiries table:', gymError.message);

      // Attempt backup enquiries table
      const { data: enqData, error: enqError } = await supabase
        .from('enquiries')
        .insert([{ 
          id: newEnquiry.id,
          name, 
          email, 
          phone, 
          plan, 
          message: newEnquiry.message, 
          status: newEnquiry.status, 
          created_at: newEnquiry.createdAt 
        }])
        .select();

      if (!enqError) {
        console.log('✅ Registration successfully stored in Supabase (enquiries).');
        return res.status(201).json(newEnquiry);
      }

      // If both tables failed on an active Supabase config, report the error to the user
      console.error('❌ Supabase insertion failed completely:', enqError.message);
      return res.status(400).json({ 
        error: `Supabase database error: ${gymError.message || enqError.message}. Please check your SQL setup and RLS policies.` 
      });

    } catch (err: any) {
      console.error('❌ Unhandled backend error inserting into Supabase:', err.message);
      return res.status(500).json({ error: `Internal connection error: ${err.message}` });
    }
  }

  // Fallback to local DB ONLY if Supabase is not configured
  console.log('[Server] Supabase is inactive. Saving registration to local JSON file...');
  const db = readLocalDb();
  db.enquiries.push(newEnquiry);
  writeLocalDb(db);
  res.status(201).json(newEnquiry);
});

// Get all enquiries (Admin)
app.get('/api/enquiries', adminAuth, async (req, res) => {
  if (supabase) {
    try {
      console.log('[Server] Admin read request: Fetching from Supabase table gym_memberships...');
      let { data, error } = await supabase
        .from('gym_memberships')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('⚠️ Supabase gym_memberships read failed, falling back to enquiries table:', error.message);
        const fallback = await supabase
          .from('enquiries')
          .select('*')
          .order('created_at', { ascending: false });
        data = fallback.data;
        error = fallback.error;
      }

      if (!error && data) {
        const mappedData = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          plan: item.plan,
          message: item.message,
          status: item.status,
          createdAt: item.created_at || item.createdAt
        }));
        return res.json(mappedData);
      }
      console.warn('⚠️ Supabase read failed entirely, falling back to local database logs:', error?.message);
    } catch (err: any) {
      console.warn('⚠️ Supabase read connection error:', err.message);
    }
  }

  const db = readLocalDb();
  const sorted = [...db.enquiries].sort((a: any, b: any) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  res.json(sorted);
});

// Update enquiry status (Admin approve/reject)
app.put('/api/enquiries/:id', adminAuth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'Approved' | 'Rejected' | 'Pending'

  if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  if (supabase) {
    try {
      // Try gym_memberships first
      let { data, error } = await supabase
        .from('gym_memberships')
        .update({ status })
        .eq('id', id)
        .select();

      if (error || !data || data.length === 0) {
        console.warn('⚠️ Supabase gym_memberships update failed/empty, falling back to enquiries table...');
        const fallback = await supabase
          .from('enquiries')
          .update({ status })
          .eq('id', id)
          .select();
        data = fallback.data;
        error = fallback.error;
      }

      if (!error && data && data.length > 0) {
        return res.json({ success: true, updated: data[0] });
      }
      console.warn('⚠️ Supabase update failed on both tables, updating locally instead');
    } catch (err: any) {
      console.warn('⚠️ Supabase update connection error:', err.message);
    }
  }

  const db = readLocalDb();
  const index = db.enquiries.findIndex((e: any) => e.id === id);
  if (index !== -1) {
    db.enquiries[index].status = status;
    writeLocalDb(db);
    res.json({ success: true, updated: db.enquiries[index] });
  } else {
    res.status(404).json({ error: 'Enquiry not found' });
  }
});

// Delete enquiry (Admin)
app.delete('/api/enquiries/:id', adminAuth, async (req, res) => {
  const { id } = req.params;

  if (supabase) {
    try {
      const { error: gymError } = await supabase
        .from('gym_memberships')
        .delete()
        .eq('id', id);

      const { error: enqError } = await supabase
        .from('enquiries')
        .delete()
        .eq('id', id);

      if (!gymError || !enqError) {
        return res.json({ success: true, message: 'Deleted from Supabase' });
      }
      console.warn('⚠️ Supabase delete failed, deleting locally...');
    } catch (err: any) {
      console.warn('⚠️ Supabase delete connection error:', err.message);
    }
  }

  const db = readLocalDb();
  const initialLength = db.enquiries.length;
  db.enquiries = db.enquiries.filter((e: any) => e.id !== id);
  
  if (db.enquiries.length < initialLength) {
    writeLocalDb(db);
    res.json({ success: true, message: 'Deleted locally' });
  } else {
    res.status(404).json({ error: 'Enquiry not found' });
  }
});

// Submit contact message
app.post('/api/contacts', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !phone || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const newContact = {
    id: 'cnt_' + Math.random().toString(36).substr(2, 9),
    name,
    email,
    phone,
    subject,
    message,
    createdAt: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { error } = await supabase
        .from('contacts')
        .insert([{
          id: newContact.id,
          name,
          email,
          phone,
          subject,
          message,
          created_at: newContact.createdAt
        }]);

      if (!error) {
        console.log('✅ Contact query stored in Supabase.');
        return res.status(201).json(newContact);
      } else {
        console.warn('⚠️ Supabase contact insert failed, falling back to local:', error.message);
      }
    } catch (err: any) {
      console.warn('⚠️ Supabase contact connection error, falling back to local:', err.message);
    }
  }

  const db = readLocalDb();
  db.contacts.push(newContact);
  writeLocalDb(db);
  res.status(201).json(newContact);
});

// Get contact messages (Admin)
app.get('/api/contacts', adminAuth, async (req, res) => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mappedData = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          subject: item.subject,
          message: item.message,
          createdAt: item.created_at || item.createdAt
        }));
        return res.json(mappedData);
      }
      console.warn('⚠️ Supabase contacts read failed, reading from local DB');
    } catch (err) {
      console.warn('⚠️ Supabase contacts connection error, reading from local DB');
    }
  }

  const db = readLocalDb();
  const sorted = [...db.contacts].sort((a: any, b: any) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  res.json(sorted);
});

// Delete contact (Admin)
app.delete('/api/contacts/:id', adminAuth, async (req, res) => {
  const { id } = req.params;

  if (supabase) {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (!error) {
        return res.json({ success: true, message: 'Deleted contact from Supabase' });
      }
      console.warn('⚠️ Supabase contact delete failed, deleting locally');
    } catch (err) {
      console.warn('⚠️ Supabase contact delete error, deleting locally');
    }
  }

  const db = readLocalDb();
  const initialLength = db.contacts.length;
  db.contacts = db.contacts.filter((c: any) => c.id !== id);
  
  if (db.contacts.length < initialLength) {
    writeLocalDb(db);
    res.json({ success: true, message: 'Deleted contact locally' });
  } else {
    res.status(404).json({ error: 'Contact message not found' });
  }
});

// Get system configuration info (public)
app.get('/api/config', (req, res) => {
  res.json({
    supabaseActive: !!supabase,
    supabaseUrl: supabaseUrl || '',
    gymName: 'Royal Fitness Club',
    gymPhone: '07999960952',
    gymAddress: 'Shagun Vihar colony, Sarangpur, Madhya Pradesh 465697'
  });
});


// =================== VITE MIDDLEWARE SETUP ===================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Mount Vite middleware in development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve built files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Royal Fitness Club server running at http://localhost:${PORT}`);
  });
}

startServer();
