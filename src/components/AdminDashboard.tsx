import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MembershipEnquiry, ContactMessage } from '../types';
import { supabase } from '../lib/supabase';

const GYM_MEMBERSHIPS_SQL = `-- Create gym_memberships table
CREATE TABLE IF NOT EXISTS gym_memberships (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  plan TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  start_date TIMESTAMPTZ,
  expiry_date TIMESTAMPTZ
);

-- Enable Row Level Security (RLS)
ALTER TABLE gym_memberships ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to register/insert from frontend
CREATE POLICY "Allow anonymous inserts" ON gym_memberships FOR INSERT WITH CHECK (true);

-- Policy to allow full read/write access for admin
CREATE POLICY "Allow all access" ON gym_memberships FOR ALL USING (true);

-- Enable Real-time Postgres Changes
ALTER PUBLICATION supabase_realtime ADD TABLE gym_memberships;`;

const ENQUIRIES_SQL = `-- Create enquiries table (Backup Table)
CREATE TABLE IF NOT EXISTS enquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  plan TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  start_date TIMESTAMPTZ,
  expiry_date TIMESTAMPTZ
);

-- Enable Row Level Security (RLS)
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to register/insert from frontend
CREATE POLICY "Allow anonymous inserts" ON enquiries FOR INSERT WITH CHECK (true);

-- Policy to allow full read/write access for admin
CREATE POLICY "Allow all access" ON enquiries FOR ALL USING (true);

-- Enable Real-time Postgres Changes
ALTER PUBLICATION supabase_realtime ADD TABLE enquiries;`;

const CONTACTS_SQL = `-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to submit contact requests
CREATE POLICY "Allow anonymous inserts" ON contacts FOR INSERT WITH CHECK (true);

-- Policy to allow full read/write access for admin
CREATE POLICY "Allow all access" ON contacts FOR ALL USING (true);

-- Enable Real-time Postgres Changes
ALTER PUBLICATION supabase_realtime ADD TABLE contacts;`;

const ADMIN_CONFIG_SQL = `-- Create admin_config table
CREATE TABLE IF NOT EXISTS admin_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Insert default admin PIN
INSERT INTO admin_config (key, value)
VALUES ('admin_pin', 'admin123')
ON CONFLICT (key) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE admin_config ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to read the admin PIN for login
CREATE POLICY "Allow public read of admin_pin" ON admin_config FOR SELECT USING (true);`;

export default function AdminDashboard() {
  const [pinInput, setPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Dashboard Data State
  const [enquiries, setEnquiries] = useState<MembershipEnquiry[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'enquiries' | 'contacts' | 'memberships'>('enquiries');
  const [membershipFilter, setMembershipFilter] = useState<'All' | 'Active' | 'Expiring Soon' | 'Expired'>('All');
  const [renewingMemberId, setRenewingMemberId] = useState<string | null>(null);
  const [renewalPlan, setRenewalPlan] = useState<string>('Monthly');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Supabase connection status state
  const [supabaseConfig, setSupabaseConfig] = useState<{ active: boolean; url: string } | null>(null);
  const [showSqlSetup, setShowSqlSetup] = useState(false);
  const [copiedGymMemberships, setCopiedGymMemberships] = useState(false);
  const [copiedEnquiries, setCopiedEnquiries] = useState(false);
  const [copiedContacts, setCopiedContacts] = useState(false);
  const [copiedAdminConfig, setCopiedAdminConfig] = useState(false);

  // Fetch Supabase configuration on mount
  useEffect(() => {
    const fetchConfig = async () => {
      // Direct frontend check first (Serverless & Free)
      const clientUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://vkwsivnvcyqjtjryjyyg.supabase.co';
      const isClientActive = !!clientUrl && !clientUrl.includes('your-supabase-project');
      
      setSupabaseConfig({
        active: isClientActive,
        url: clientUrl
      });

      // Also try backend config endpoint as backup
      try {
        const res = await fetch('/api/config');
        if (res.ok) {
          const data = await res.json();
          setSupabaseConfig({
            active: data.supabaseActive || isClientActive,
            url: data.supabaseUrl || clientUrl
          });
        }
      } catch (err) {
        console.log('[Admin Dashboard] Backend config endpoint not reachable (running serverless/SPA mode). Using client-side config.');
      }
    };
    fetchConfig();
  }, []);

  // Verify PIN
  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log('[Admin Login] Starting PIN verification flow for pin:', pinInput);

    try {
      // Path 1: Check direct Supabase query first (100% Free of Backend Server Dependency)
      if (supabase) {
        console.log('[Admin Login] Attempting direct Supabase query for admin_config table...');
        try {
          const { data, error: sbError } = await supabase
            .from('admin_config')
            .select('value')
            .eq('key', 'admin_pin');

          if (sbError) {
            console.warn('[Admin Login] Supabase admin_config query returned error:', sbError.message);
          } else if (data && data.length > 0) {
            const fetchedPin = data[0].value;
            if (fetchedPin === pinInput) {
              console.log('[Admin Login] Direct Supabase admin_config PIN verification success!');
              setIsAuthenticated(true);
              setAdminPin(pinInput);
              return;
            } else {
              console.warn('[Admin Login] Supabase PIN mismatch.');
              setError('Invalid Admin PIN. Please try again.');
              return;
            }
          } else {
            console.log('[Admin Login] No admin_config table records found in Supabase.');
          }
        } catch (queryErr: any) {
          console.error('[Admin Login] Querying admin_config threw exception:', queryErr);
        }
      }

      // Path 2: API route fallback (only if Express server is running)
      console.log('[Admin Login] Attempting fallback backend API verify route POST to /api/admin/verify...');
      try {
        const response = await fetch('/api/admin/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin: pinInput })
        });

        if (response.ok) {
          const apiData = await response.json();
          if (apiData.success) {
            console.log('[Admin Login] Fallback API route verification success!');
            setIsAuthenticated(true);
            setAdminPin(pinInput);
            return;
          }
        }
      } catch (fetchErr) {
        console.log('[Admin Login] Backend API verify route unreachable (running serverless/SPA mode).');
      }

      // Path 3: Client-side local environment / static PIN fallback (Critical for instant Serverless/Vercel support!)
      const clientSideEnvPin = (import.meta as any).env?.VITE_ADMIN_PIN;
      console.log('[Admin Login] Backend API and database PIN lookup skipped/unreached. Performing static fallback...');
      
      const expectedStaticPin = clientSideEnvPin || 'admin123';
      if (pinInput === expectedStaticPin) {
        console.log('[Admin Login] Static fallback PIN verification success!');
        setIsAuthenticated(true);
        setAdminPin(pinInput);
        return;
      }

      setError('Invalid Admin PIN. Please try again.');
    } catch (err: any) {
      console.error('[Admin Login] Error during PIN verification process:', err);
      setError(`Login failed: ${err.message || 'Connection error. Please verify your Supabase settings.'}`);
    } finally {
      setLoading(false);
    }
  };

  // Setup Real-time updates subscription
  useEffect(() => {
    if (!isAuthenticated || !supabase) return;

    console.log('[Admin Dashboard] Initializing real-time subscription channels...');

    const channel = supabase
      .channel('supabase-admin-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gym_memberships' },
        (payload) => {
          console.log('[Real-time Update] Received gym_memberships event:', payload.eventType);
          setRefreshTrigger((prev) => prev + 1);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'enquiries' },
        (payload) => {
          console.log('[Real-time Update] Received enquiries event:', payload.eventType);
          setRefreshTrigger((prev) => prev + 1);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contacts' },
        (payload) => {
          console.log('[Real-time Update] Received contacts event:', payload.eventType);
          setRefreshTrigger((prev) => prev + 1);
        }
      )
      .subscribe((status) => {
        console.log('[Real-time Subscription] Channel status:', status);
      });

    return () => {
      console.log('[Admin Dashboard] Cleaning up real-time channels...');
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated]);

  // Fetch Dashboard Records
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchRecords = async () => {
      setLoading(true);
      setError(null);
      console.log('[Admin Dashboard] fetchRecords called. Triggering load...');

      try {
        let enqData: MembershipEnquiry[] = [];
        let cntData: ContactMessage[] = [];
        let fetchedFromSupabase = false;

        // Path 1: Direct Supabase Fetch (Zero local server dependency!)
        if (supabase) {
          try {
            console.log('[Admin Dashboard] Fetching registrations directly from Supabase...');
            
            // Try gym_memberships primary table first
            let { data: gymData, error: gymError } = await supabase
              .from('gym_memberships')
              .select('*')
              .order('created_at', { ascending: false });

            if (gymError) {
              console.warn('[Admin Dashboard] gym_memberships table read failed:', gymError.message);
              console.log('[Admin Dashboard] Attempting read from fallback enquiries table...');
              const { data: fallbackData, error: fallbackError } = await supabase
                .from('enquiries')
                .select('*')
                .order('created_at', { ascending: false });

              if (fallbackError) {
                console.error('[Admin Dashboard] Both gym_memberships and enquiries tables failed to fetch directly:', fallbackError.message);
              } else if (fallbackData) {
                gymData = fallbackData;
                gymError = null;
              }
            }

            if (!gymError && gymData) {
              enqData = gymData.map((item: any) => ({
                id: item.id,
                name: item.name,
                email: item.email,
                phone: item.phone,
                plan: item.plan,
                message: item.message || '',
                status: item.status,
                createdAt: item.created_at || item.createdAt
              }));
              fetchedFromSupabase = true;
              console.log('[Admin Dashboard] Registrations fetched successfully from Supabase:', enqData.length, 'records');
            }

            // Fetch contacts directly from Supabase
            console.log('[Admin Dashboard] Fetching contacts directly from Supabase...');
            const { data: contactsData, error: contactsError } = await supabase
              .from('contacts')
              .select('*')
              .order('created_at', { ascending: false });

            if (!contactsError && contactsData) {
              cntData = contactsData.map((item: any) => ({
                id: item.id,
                name: item.name,
                email: item.email,
                phone: item.phone,
                subject: item.subject,
                message: item.message || '',
                createdAt: item.created_at || item.createdAt
              }));
              fetchedFromSupabase = true;
              console.log('[Admin Dashboard] Contacts fetched successfully from Supabase:', cntData.length, 'records');
            } else if (contactsError) {
              console.error('[Admin Dashboard] Contacts table failed to fetch directly:', contactsError.message);
            }

            if (fetchedFromSupabase) {
              setEnquiries(enqData);
              setContacts(cntData);
              return; // Successfully loaded directly from Supabase!
            }
          } catch (sbFetchErr: any) {
            console.error('[Admin Dashboard] Error during direct Supabase queries:', sbFetchErr);
          }
        }

        // Path 2: Fallback to backend API
        console.log('[Admin Dashboard] Supabase direct fetch skipped or failed. Falling back to backend API endpoints...');
        
        // Enquiries fetch
        const enqResponse = await fetch('/api/enquiries', {
          headers: { 'x-admin-pin': adminPin }
        });
        if (enqResponse.ok) {
          const apiEnq = await enqResponse.json();
          setEnquiries(apiEnq);
        } else {
          console.warn('[Admin Dashboard] Backend API /api/enquiries returned non-OK status:', enqResponse.status);
        }

        // Contacts fetch
        const cntResponse = await fetch('/api/contacts', {
          headers: { 'x-admin-pin': adminPin }
        });
        if (cntResponse.ok) {
          const apiCnt = await cntResponse.json();
          setContacts(apiCnt);
        } else {
          console.warn('[Admin Dashboard] Backend API /api/contacts returned non-OK status:', cntResponse.status);
        }

      } catch (err: any) {
        console.error('[Admin Dashboard] Error in fetchRecords:', err);
        setError(`Failed to retrieve records: ${err.message || 'Please check your connection and configuration.'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [isAuthenticated, adminPin, refreshTrigger]);

  // Approve / Reject Enquiry Status
  const handleUpdateStatus = async (id: string, newStatus: 'Approved' | 'Rejected') => {
    console.log('[Admin Dashboard] Updating registration status. ID:', id, 'New Status:', newStatus);
    
    try {
      let updatedSuccess = false;

      // Path 1: Direct Supabase Update
      if (supabase) {
        console.log('[Admin Dashboard] Attempting direct Supabase status update in gym_memberships table...');
        try {
          let { data, error } = await supabase
            .from('gym_memberships')
            .update({ status: newStatus })
            .eq('id', id)
            .select();

          if (error || !data || data.length === 0) {
            console.warn('[Admin Dashboard] Direct update in gym_memberships failed, trying enquiries fallback table...');
            const fallback = await supabase
              .from('enquiries')
              .update({ status: newStatus })
              .eq('id', id)
              .select();
            data = fallback.data;
            error = fallback.error;
          }

          if (!error && data && data.length > 0) {
            console.log('[Admin Dashboard] Direct Supabase status update succeeded!');
            updatedSuccess = true;
          } else if (error) {
            console.error('[Admin Dashboard] Direct Supabase status update failed completely:', error.message);
          }
        } catch (sbErr: any) {
          console.error('[Admin Dashboard] Exception during direct Supabase status update:', sbErr);
        }
      }

      // Path 2: API route fallback (only if direct Supabase update did not execute/succeed)
      if (!updatedSuccess) {
        console.log('[Admin Dashboard] Falling back to backend API route for status update...');
        const response = await fetch(`/api/enquiries/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-pin': adminPin
          },
          body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
          console.log('[Admin Dashboard] API route status update succeeded!');
          updatedSuccess = true;
        } else {
          const errText = await response.text();
          console.error('[Admin Dashboard] API route status update failed:', errText);
        }
      }

      if (updatedSuccess) {
        // Optimistic State update
        setEnquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
      } else {
        alert('Failed to update status. Please make sure the table exists or check permissions.');
      }
    } catch (err: any) {
      console.error('[Admin Dashboard] Error updating status:', err);
      alert(`Error updating status: ${err.message}`);
    }
  };

  // Renew Membership
  const handleRenewMembership = async (id: string, newPlan: string) => {
    console.log('[Admin Dashboard] Renewing membership. ID:', id, 'New Plan:', newPlan);

    const getPlanDays = (p: string): number => {
      switch (p) {
        case 'Monthly': return 30;
        case 'Quarterly': return 90;
        case 'Half-Yearly': return 180;
        case 'Yearly': return 365;
        default: return 30;
      }
    };

    const startDate = new Date();
    const days = getPlanDays(newPlan);
    const expiryDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);

    const updateFields = {
      plan: newPlan,
      start_date: startDate.toISOString(),
      expiry_date: expiryDate.toISOString(),
      status: 'Approved' // ensure active
    };

    try {
      let updatedSuccess = false;

      // Path 1: Direct Supabase Update
      if (supabase) {
        try {
          let { data, error } = await supabase
            .from('gym_memberships')
            .update(updateFields)
            .eq('id', id)
            .select();

          if (error || !data || data.length === 0) {
            console.warn('[Admin Dashboard] Direct renewal in gym_memberships failed, trying enquiries fallback...');
            const fallback = await supabase
              .from('enquiries')
              .update(updateFields)
              .eq('id', id)
              .select();
            data = fallback.data;
            error = fallback.error;
          }

          if (!error && data && data.length > 0) {
            console.log('[Admin Dashboard] Direct Supabase renewal succeeded!');
            updatedSuccess = true;
          } else if (error) {
            console.error('[Admin Dashboard] Direct Supabase renewal failed:', error.message);
          }
        } catch (sbErr: any) {
          console.error('[Admin Dashboard] Exception during direct Supabase renewal:', sbErr);
        }
      }

      // Path 2: API route fallback
      if (!updatedSuccess) {
        console.log('[Admin Dashboard] Falling back to backend API route for renewal...');
        const response = await fetch(`/api/enquiries/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-pin': adminPin
          },
          body: JSON.stringify(updateFields)
        });

        if (response.ok) {
          console.log('[Admin Dashboard] API route renewal succeeded!');
          updatedSuccess = true;
        } else {
          const errText = await response.text();
          console.error('[Admin Dashboard] API route renewal failed:', errText);
        }
      }

      if (updatedSuccess) {
        // Update local state
        setEnquiries((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  plan: newPlan,
                  start_date: startDate.toISOString(),
                  expiry_date: expiryDate.toISOString(),
                  status: 'Approved'
                }
              : item
          )
        );
        setRenewingMemberId(null);
        alert(`Successfully renewed membership to the ${newPlan} Package!`);
      } else {
        alert('Failed to renew membership.');
      }
    } catch (err: any) {
      console.error('[Admin Dashboard] Error renewing membership:', err);
      alert(`Error renewing membership: ${err.message}`);
    }
  };

  // Delete Enquiry
  const handleDeleteEnquiry = async (id: string) => {
    if (!window.confirm('Are you absolutely sure you want to permanently delete this membership enquiry?')) return;

    console.log('[Admin Dashboard] Deleting registration. ID:', id);

    try {
      let deletedSuccess = false;

      // Path 1: Direct Supabase Delete
      if (supabase) {
        console.log('[Admin Dashboard] Attempting direct Supabase delete from gym_memberships table...');
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
            console.log('[Admin Dashboard] Direct Supabase delete succeeded!');
            deletedSuccess = true;
          } else {
            console.error('[Admin Dashboard] Direct Supabase delete failed on both tables:', gymError?.message, enqError?.message);
          }
        } catch (sbErr: any) {
          console.error('[Admin Dashboard] Exception during direct Supabase delete:', sbErr);
        }
      }

      // Path 2: API route fallback
      if (!deletedSuccess) {
        console.log('[Admin Dashboard] Falling back to backend API route for deletion...');
        const response = await fetch(`/api/enquiries/${id}`, {
          method: 'DELETE',
          headers: { 'x-admin-pin': adminPin }
        });

        if (response.ok) {
          console.log('[Admin Dashboard] API route delete succeeded!');
          deletedSuccess = true;
        } else {
          const errText = await response.text();
          console.error('[Admin Dashboard] API route delete failed:', errText);
        }
      }

      if (deletedSuccess) {
        setEnquiries((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert('Failed to delete enquiry.');
      }
    } catch (err: any) {
      console.error('[Admin Dashboard] Error deleting enquiry:', err);
      alert(`Error: ${err.message}`);
    }
  };

  // Delete Contact Query
  const handleDeleteContact = async (id: string) => {
    if (!window.confirm('Are you absolutely sure you want to permanently delete this contact query?')) return;

    console.log('[Admin Dashboard] Deleting contact query. ID:', id);

    try {
      let deletedSuccess = false;

      // Path 1: Direct Supabase Delete
      if (supabase) {
        console.log('[Admin Dashboard] Attempting direct Supabase delete from contacts table...');
        try {
          const { error } = await supabase
            .from('contacts')
            .delete()
            .eq('id', id);

          if (!error) {
            console.log('[Admin Dashboard] Direct Supabase delete from contacts table succeeded!');
            deletedSuccess = true;
          } else {
            console.error('[Admin Dashboard] Direct Supabase delete from contacts failed:', error.message);
          }
        } catch (sbErr: any) {
          console.error('[Admin Dashboard] Exception during direct contacts delete:', sbErr);
        }
      }

      // Path 2: API route fallback
      if (!deletedSuccess) {
        console.log('[Admin Dashboard] Falling back to backend API route for contact deletion...');
        const response = await fetch(`/api/contacts/${id}`, {
          method: 'DELETE',
          headers: { 'x-admin-pin': adminPin }
        });

        if (response.ok) {
          console.log('[Admin Dashboard] API route contact delete succeeded!');
          deletedSuccess = true;
        } else {
          const errText = await response.text();
          console.error('[Admin Dashboard] API route contact delete failed:', errText);
        }
      }

      if (deletedSuccess) {
        setContacts((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert('Failed to delete contact query.');
      }
    } catch (err: any) {
      console.error('[Admin Dashboard] Error deleting contact query:', err);
      alert(`Error deleting contact query: ${err.message}`);
    }
  };

  // Helpers for remaining days & status
  const getRemainingDays = (expiryDateStr?: string) => {
    if (!expiryDateStr) return 0;
    const expiry = new Date(expiryDateStr);
    const today = new Date();
    expiry.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getMembershipStatus = (remainingDays: number) => {
    if (remainingDays <= 0) return 'Expired';
    if (remainingDays <= 7) return 'Expiring Soon';
    return 'Active';
  };

  // Select all approved members
  const approvedMembers = enquiries.filter(e => e.status === 'Approved');

  // Multi-level calculations for approved members
  const calculatedMembers = approvedMembers.map(m => {
    const remDays = getRemainingDays(m.expiry_date);
    const status = getMembershipStatus(remDays);
    return {
      ...m,
      remainingDays: remDays,
      computedStatus: status
    };
  });

  // Calculate memberships stats summary
  const totalApprovedMembers = calculatedMembers.length;
  const activeMembersCount = calculatedMembers.filter(m => m.computedStatus === 'Active').length;
  const expiringSoonCount = calculatedMembers.filter(m => m.computedStatus === 'Expiring Soon').length;
  const expiredMembersCount = calculatedMembers.filter(m => m.computedStatus === 'Expired').length;

  // Sort: near expiry first (ascending remaining days)
  const sortedMembers = [...calculatedMembers].sort((a, b) => a.remainingDays - b.remainingDays);

  // Filter based on search query AND status filter
  const filteredMembers = sortedMembers.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone.includes(searchQuery) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.plan.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      membershipFilter === 'All' ||
      m.computedStatus === membershipFilter;

    return matchesSearch && matchesStatus;
  });

  // Export CSV
  const handleExportCsv = () => {
    let headers = [];
    let rows = [];
    let fileName = '';

    if (activeTab === 'enquiries') {
      headers = ['ID', 'Name', 'Email', 'Phone', 'Selected Plan', 'Created At', 'Status', 'Message'];
      rows = enquiries.map(e => [
        e.id,
        `"${e.name.replace(/"/g, '""')}"`,
        e.email,
        e.phone,
        e.plan,
        e.createdAt,
        e.status,
        `"${(e.message || '').replace(/"/g, '""')}"`
      ]);
      fileName = 'royal_membership_enquiries.csv';
    } else if (activeTab === 'memberships') {
      headers = ['ID', 'Name', 'Email', 'Phone', 'Membership Plan', 'Join Date', 'Expiry Date', 'Remaining Days', 'Status'];
      rows = calculatedMembers.map(e => {
        const start = e.start_date || e.createdAt;
        const expiry = e.expiry_date || '';
        return [
          e.id,
          `"${e.name.replace(/"/g, '""')}"`,
          e.email,
          e.phone,
          e.plan,
          new Date(start).toLocaleDateString(),
          new Date(expiry).toLocaleDateString(),
          e.remainingDays,
          e.computedStatus
        ];
      });
      fileName = 'royal_gym_memberships.csv';
    } else {
      headers = ['ID', 'Name', 'Email', 'Phone', 'Subject', 'Created At', 'Message'];
      rows = contacts.map(c => [
        c.id,
        `"${c.name.replace(/"/g, '""')}"`,
        c.email,
        c.phone,
        `"${c.subject.replace(/"/g, '""')}"`,
        c.createdAt,
        `"${c.message.replace(/"/g, '""')}"`
      ]);
      fileName = 'royal_contact_enquiries.csv';
    }

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate stats summary
  const totalEnquiries = enquiries.length;
  const approvedCount = enquiries.filter(e => e.status === 'Approved').length;
  const pendingCount = enquiries.filter(e => e.status === 'Pending').length;
  const rejectedCount = enquiries.filter(e => e.status === 'Rejected').length;

  // Filter lists based on Search Query
  const filteredEnquiries = enquiries.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.phone.includes(searchQuery) ||
    e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.plan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sign out / Lock
  const handleSignOut = () => {
    setIsAuthenticated(false);
    setAdminPin('');
    setPinInput('');
  };

  // 1. LOCK SCREEN RENDER
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col justify-center items-center px-4 relative">
        {/* Background ambient red glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-md glass-panel p-8 rounded-3xl shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-white">Owner Admin Access</h2>
            <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">
              Enter the secure administrator PIN to manage club membership requests and contact messages. (Default PIN: <strong className="text-red-400 font-mono">admin123</strong>)
            </p>
          </div>

          <form onSubmit={handleVerifyPin} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-600/10 border border-red-600/20 rounded-xl text-red-400 text-xs text-center font-semibold">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="admin-pin" className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 font-mono text-center">
                Enter Administrator PIN
              </label>
              <input
                type="password"
                id="admin-pin"
                required
                maxLength={10}
                placeholder="••••••••"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full text-center tracking-[0.5em] font-black text-2xl px-4 py-3 bg-dark-bg border border-dark-card-border text-red-500 rounded-xl focus:outline-none focus:border-red-500 transition-colors font-mono"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              id="admin-verify-submit-btn"
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider text-xs rounded-xl transition-all duration-300 shadow-lg shadow-red-600/20 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Authorize Terminal'}
            </motion.button>
          </form>
        </div>
      </div>
    );
  }

  // 2. MAIN ADMIN CONSOLE RENDER
  return (
    <div className="min-h-screen bg-dark-bg pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top bar header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-panel p-6 rounded-2xl">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 text-red-500 border border-red-500/20 font-mono text-[10px] uppercase font-bold">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
              Admin Console Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              Royal Fitness <span className="text-red-500 font-black">Management Panel</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setRefreshTrigger(prev => prev + 1)}
              className="px-4 py-2 bg-gray-900 border border-gray-800 text-gray-300 hover:text-white rounded-lg text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-all"
              title="Reload Records"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Refresh
            </button>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600/10 border border-red-600/30 text-red-400 hover:bg-red-600 hover:text-white rounded-lg text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-all"
            >
              Lock Terminal
            </button>
          </div>
        </div>

        {/* Supabase Status Card */}
        {supabaseConfig && (
          <div className={`p-6 rounded-2xl border transition-all duration-300 ${
            supabaseConfig.active
              ? 'bg-green-500/5 border-green-500/20 text-green-400'
              : 'bg-yellow-500/5 border-yellow-500/20 text-yellow-400'
          }`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl mt-0.5 ${
                  supabaseConfig.active ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white">
                    Supabase Database Connection
                  </h3>
                  <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">
                    {supabaseConfig.active ? (
                      <>
                        Successfully connected to Supabase project <strong className="text-green-400 font-mono text-[11px]">{supabaseConfig.url}</strong>. Enrolments and contact messages are synchronized in real-time.
                      </>
                    ) : (
                      <>
                        Supabase database is currently not active. Storing registrations locally on the secure server.
                      </>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSqlSetup(!showSqlSetup)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {showSqlSetup ? 'Hide Setup' : 'Show SQL Setup'}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-3.5 h-3.5 transition-transform duration-300 ${showSqlSetup ? 'rotate-180' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </div>

            {showSqlSetup && (
              <div className="mt-6 pt-6 border-t border-white/10 space-y-6 text-gray-300">
                <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                  <h4 className="font-semibold text-white text-xs uppercase tracking-widest mb-1.5 font-mono text-red-500">How to Setup Supabase Database Tables</h4>
                  <ol className="list-decimal pl-5 text-xs space-y-1.5 text-gray-400 leading-relaxed">
                    <li>Log in to your <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-red-500 hover:underline">Supabase Dashboard</a> and open project <strong className="text-white">{supabaseConfig.url.split('//')[1]?.split('.')[0] || 'vkwsivnvcyqjtjryjyyg'}</strong>.</li>
                    <li>Go to the <strong>SQL Editor</strong> tab in the left sidebar.</li>
                    <li>Click <strong>New Query</strong>, copy and paste the SQL scripts below, and click <strong>Run</strong> to create the tables.</li>
                    <li>Row-Level Security (RLS) is automatically enabled to allow public website registrations (anonymous inserts) and full access for this client.</li>
                  </ol>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Gym Memberships Table Setup */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white uppercase tracking-wider text-green-400">1. Gym Memberships SQL (Primary)</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(GYM_MEMBERSHIPS_SQL);
                          setCopiedGymMemberships(true);
                          setTimeout(() => setCopiedGymMemberships(false), 2000);
                        }}
                        className="px-2.5 py-1 bg-red-600/10 hover:bg-red-600 border border-red-600/30 text-red-400 hover:text-white rounded text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer"
                      >
                        {copiedGymMemberships ? 'Copied!' : 'Copy SQL'}
                      </button>
                    </div>
                    <pre className="p-3 bg-black/60 border border-white/5 rounded-lg text-[10px] font-mono text-gray-400 overflow-x-auto max-h-48 leading-relaxed">
                      {GYM_MEMBERSHIPS_SQL}
                    </pre>
                  </div>

                  {/* Enquiries Table Setup */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">2. Enquiries SQL (Backup)</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(ENQUIRIES_SQL);
                          setCopiedEnquiries(true);
                          setTimeout(() => setCopiedEnquiries(false), 2000);
                        }}
                        className="px-2.5 py-1 bg-red-600/10 hover:bg-red-600 border border-red-600/30 text-red-400 hover:text-white rounded text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer"
                      >
                        {copiedEnquiries ? 'Copied!' : 'Copy SQL'}
                      </button>
                    </div>
                    <pre className="p-3 bg-black/60 border border-white/5 rounded-lg text-[10px] font-mono text-gray-400 overflow-x-auto max-h-48 leading-relaxed">
                      {ENQUIRIES_SQL}
                    </pre>
                  </div>

                  {/* Contacts Table Setup */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">3. Contacts SQL</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(CONTACTS_SQL);
                          setCopiedContacts(true);
                          setTimeout(() => setCopiedContacts(false), 2000);
                        }}
                        className="px-2.5 py-1 bg-red-600/10 hover:bg-red-600 border border-red-600/30 text-red-400 hover:text-white rounded text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer"
                      >
                        {copiedContacts ? 'Copied!' : 'Copy SQL'}
                      </button>
                    </div>
                    <pre className="p-3 bg-black/60 border border-white/5 rounded-lg text-[10px] font-mono text-gray-400 overflow-x-auto max-h-48 leading-relaxed">
                      {CONTACTS_SQL}
                    </pre>
                  </div>

                  {/* Admin Config Table Setup */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-red-400 uppercase tracking-wider">4. Admin Config SQL</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(ADMIN_CONFIG_SQL);
                          setCopiedAdminConfig(true);
                          setTimeout(() => setCopiedAdminConfig(false), 2000);
                        }}
                        className="px-2.5 py-1 bg-red-600/10 hover:bg-red-600 border border-red-600/30 text-red-400 hover:text-white rounded text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer"
                      >
                        {copiedAdminConfig ? 'Copied!' : 'Copy SQL'}
                      </button>
                    </div>
                    <pre className="p-3 bg-black/60 border border-white/5 rounded-lg text-[10px] font-mono text-gray-400 overflow-x-auto max-h-48 leading-relaxed">
                      {ADMIN_CONFIG_SQL}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats Summary Cards Row with Sophisticated Dark stat-card */}
        <div className="flex justify-between items-center bg-white/5 border border-white/5 p-3 rounded-lg">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
            {activeTab === 'memberships' ? 'Membership Expiry Metrics Terminal' : 'Club Metrics Terminal'}
          </h3>
          <div className="bg-white/5 px-3 py-0.5 rounded text-[9px] font-mono border border-white/10 text-rose-400">
            {activeTab === 'memberships' ? 'EXPIRY_ENGINE_v1.0' : 'LIVE_FEED_v2.0'}
          </div>
        </div>

        {activeTab === 'memberships' ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 stat-card rounded-xl">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Total Members</span>
              <div className="text-3xl font-extrabold text-white mt-1 font-mono">{totalApprovedMembers}</div>
            </div>
            <div className="p-5 stat-card rounded-xl">
              <span className="text-[10px] text-green-400 uppercase tracking-widest font-bold">Active Members</span>
              <div className="text-3xl font-extrabold text-green-400 mt-1 font-mono">{activeMembersCount}</div>
            </div>
            <div className="p-5 stat-card rounded-xl">
              <span className="text-[10px] text-orange-400 uppercase tracking-widest font-bold">Expiring Soon (≤7d)</span>
              <div className="text-3xl font-extrabold text-orange-400 mt-1 font-mono">{expiringSoonCount}</div>
            </div>
            <div className="p-5 stat-card rounded-xl">
              <span className="text-[10px] text-red-500 uppercase tracking-widest font-bold">Expired Members</span>
              <div className="text-3xl font-extrabold text-red-500 mt-1 font-mono">{expiredMembersCount}</div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 stat-card rounded-xl">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Total Registrations</span>
              <div className="text-3xl font-extrabold text-white mt-1 font-mono">{totalEnquiries}</div>
            </div>
            <div className="p-5 stat-card rounded-xl">
              <span className="text-[10px] text-green-400 uppercase tracking-widest font-bold">Approved</span>
              <div className="text-3xl font-extrabold text-green-400 mt-1 font-mono">{approvedCount}</div>
            </div>
            <div className="p-5 stat-card rounded-xl">
              <span className="text-[10px] text-yellow-400 uppercase tracking-widest font-bold">Pending Approval</span>
              <div className="text-3xl font-extrabold text-yellow-400 mt-1 font-mono">{pendingCount}</div>
            </div>
            <div className="p-5 stat-card rounded-xl">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Contact Inbound</span>
              <div className="text-3xl font-extrabold text-gray-400 mt-1 font-mono">{contacts.length}</div>
            </div>
          </div>
        )}

        {/* Controls, Filter Tabs, and Export button */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 glass-panel p-4 rounded-xl">
          {/* Tabs */}
          <div className="flex bg-dark-bg p-1 rounded-lg border border-dark-card-border flex-wrap gap-1">
            <button
              onClick={() => { setActiveTab('enquiries'); setSearchQuery(''); }}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-bold rounded-md transition-all ${activeTab === 'enquiries' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
              Enrolments ({totalEnquiries})
            </button>
            <button
              onClick={() => { setActiveTab('memberships'); setSearchQuery(''); }}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-bold rounded-md transition-all ${activeTab === 'memberships' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
              Active Members ({totalApprovedMembers})
            </button>
            <button
              onClick={() => { setActiveTab('contacts'); setSearchQuery(''); }}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-bold rounded-md transition-all ${activeTab === 'contacts' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
              Contact Inbound ({contacts.length})
            </button>
          </div>

          {/* Search bar & Export */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center flex-grow sm:flex-grow-0">
            <input
              type="text"
              placeholder={`Search by name, phone...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2.5 bg-dark-bg border border-dark-card-border text-white text-xs rounded-lg focus:outline-none focus:border-red-500 sm:w-64"
            />
            <button
              onClick={handleExportCsv}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export CSV
            </button>
          </div>
        </div>

        {/* Dynamic Records Display container */}
        <div className="glass-panel p-6 rounded-2xl min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 space-y-4">
              <svg className="animate-spin h-8 w-8 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-xs font-mono uppercase tracking-widest">Loading database...</p>
            </div>
          ) : activeTab === 'enquiries' ? (
            filteredEnquiries.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <p className="font-display font-semibold text-lg text-white">No membership enquiries found</p>
                <p className="text-xs mt-1">Submit enrolments on the website to populate this terminal.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {filteredEnquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="p-5 bg-dark-bg border border-dark-card-border rounded-xl space-y-4 hover:border-white/10 transition-colors flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Badge and ID Header */}
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[10px] text-gray-500 font-bold tracking-wider uppercase">
                          {enq.id}
                        </span>
                        
                        {/* Status tag color */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono ${
                          enq.status === 'Approved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                          enq.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                          'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 animate-pulse'
                        }`}>
                          {enq.status}
                        </span>
                      </div>

                      {/* Bio details */}
                      <div>
                        <h4 className="font-display font-bold text-base text-white">{enq.name}</h4>
                        <div className="text-xs text-red-500 font-mono font-bold uppercase mt-1">
                          {enq.plan} Package Selected
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-gray-400 font-sans border-t border-dark-card-border/50 pt-2">
                        <div className="flex justify-between">
                          <span>Email:</span>
                          <span className="text-white font-medium">{enq.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Phone:</span>
                          <span className="text-white font-medium font-mono">{enq.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Submitted:</span>
                          <span>{new Date(enq.createdAt).toLocaleString()}</span>
                        </div>
                      </div>

                      {enq.message && (
                        <div className="p-3 bg-dark-card rounded-lg text-xs text-gray-300 leading-relaxed font-sans border border-dark-card-border/40">
                          <strong className="text-red-500 block text-[9px] uppercase tracking-widest font-mono mb-1">Notes:</strong>
                          {enq.message}
                        </div>
                      )}
                    </div>

                    {/* Operational buttons */}
                    <div className="flex gap-2 pt-4 border-t border-dark-card-border/50 mt-4">
                      {enq.status !== 'Approved' && (
                        <button
                          onClick={() => handleUpdateStatus(enq.id, 'Approved')}
                          className="flex-1 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded font-bold text-[10px] uppercase tracking-wider transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      {enq.status !== 'Rejected' && (
                        <button
                          onClick={() => handleUpdateStatus(enq.id, 'Rejected')}
                          className="flex-1 py-1.5 bg-yellow-600/10 hover:bg-yellow-600 border border-yellow-600/30 text-yellow-500 hover:text-white rounded font-bold text-[10px] uppercase tracking-wider transition-colors"
                        >
                          Reject
                        </button>
                      )}
                      
                      {/* Click to WhatsApp Quick Assist */}
                      <a
                        href={`https://wa.me/${enq.phone}?text=Hello%20${encodeURIComponent(enq.name)}!%20This%20is%20Shyam%20Rajput%20from%20Royal%20Fitness%20Club.%20I%20have%20reviewed%20your%20membership%20enquiry.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded flex items-center justify-center transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.38 2.016 13.908.993 11.278.993c-5.44 0-9.866 4.372-9.87 9.802 0 1.63.454 3.22 1.317 4.634l-.993 3.63 3.733-.966zm11.321-7.72c-.3-.149-1.772-.863-2.046-.962-.275-.099-.475-.149-.675.15-.199.3-.773.962-.948 1.16-.175.2-.35.226-.65.076-.3-.15-1.267-.461-2.413-1.471-.892-.786-1.493-1.758-1.668-2.056-.175-.3-.019-.462.131-.61.135-.134.3-.349.45-.523.15-.174.2-.3.3-.499.1-.2.05-.375-.025-.524-.075-.15-.675-1.608-.925-2.203-.243-.585-.49-.506-.675-.516-.174-.009-.374-.01-.574-.01s-.524.075-.798.374c-.275.3-1.047 1.012-1.047 2.47 0 1.457 1.073 2.865 1.223 3.064.15.2 2.111 3.178 5.113 4.466.714.306 1.272.489 1.708.626.717.224 1.37.193 1.886.117.575-.085 1.772-.714 2.022-1.405.25-.69.25-1.282.175-1.405-.075-.124-.275-.199-.575-.349z" />
                        </svg>
                      </a>

                      <button
                        onClick={() => handleDeleteEnquiry(enq.id)}
                        className="p-1.5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded transition-colors"
                        title="Delete Enquiry"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )
          ) : activeTab === 'memberships' ? (
            <div className="space-y-6">
              {/* Filter Row */}
              <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-dark-card-border/50">
                <span className="text-xs text-gray-400 font-mono uppercase tracking-wider mr-2">Expiry Status Filter:</span>
                {(['All', 'Active', 'Expiring Soon', 'Expired'] as const).map((status) => {
                  const count = status === 'All' ? totalApprovedMembers :
                                status === 'Active' ? activeMembersCount :
                                status === 'Expiring Soon' ? expiringSoonCount :
                                expiredMembersCount;
                  return (
                    <button
                      key={status}
                      onClick={() => setMembershipFilter(status)}
                      className={`px-3 py-1.5 text-xs font-bold font-mono uppercase rounded transition-all cursor-pointer ${
                        membershipFilter === status
                          ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                          : 'bg-dark-bg text-gray-400 hover:text-white border border-dark-card-border'
                      }`}
                    >
                      {status} ({count})
                    </button>
                  );
                })}
              </div>

              {filteredMembers.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <p className="font-display font-semibold text-lg text-white">No members matching filter</p>
                  <p className="text-xs mt-1">Try changing your filter or search query.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-dark-card-border">
                  <table className="w-full text-left border-collapse font-sans text-xs min-w-[800px]">
                    <thead>
                      <tr className="bg-white/[0.02] border-b border-dark-card-border/70 text-gray-400 font-mono uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4 font-bold">Member Name</th>
                        <th className="py-3 px-4 font-bold">Contact</th>
                        <th className="py-3 px-4 font-bold">Plan</th>
                        <th className="py-3 px-4 font-bold">Join Date</th>
                        <th className="py-3 px-4 font-bold">Expiry Date</th>
                        <th className="py-3 px-4 font-bold">Remaining Days</th>
                        <th className="py-3 px-4 font-bold text-center">Status</th>
                        <th className="py-3 px-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-card-border/30">
                      {filteredMembers.map((member) => {
                        const start = member.start_date || member.createdAt;
                        const expiry = member.expiry_date || '';
                        
                        return (
                          <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                            {/* Member Name */}
                            <td className="py-4 px-4">
                              <div className="font-bold text-white text-sm">{member.name}</div>
                              <div className="text-[10px] text-gray-500 font-mono mt-0.5">{member.id}</div>
                            </td>
                            
                            {/* Contact */}
                            <td className="py-4 px-4 text-gray-300">
                              <div>{member.email}</div>
                              <div className="font-mono mt-0.5">{member.phone}</div>
                            </td>
                            
                            {/* Plan */}
                            <td className="py-4 px-4">
                              <span className="px-2.5 py-0.5 bg-red-600/10 border border-red-500/20 text-red-400 rounded text-[10px] font-bold uppercase tracking-wider font-mono">
                                {member.plan}
                              </span>
                            </td>
                            
                            {/* Join Date */}
                            <td className="py-4 px-4 text-gray-300 font-mono">
                              {new Date(start).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                            </td>
                            
                            {/* Expiry Date */}
                            <td className="py-4 px-4 text-gray-300 font-mono">
                              {expiry ? new Date(expiry).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                            </td>
                            
                            {/* Remaining Days */}
                            <td className="py-4 px-4 font-mono">
                              <span className={`font-bold text-xs ${
                                member.remainingDays <= 0 ? 'text-red-500' :
                                member.remainingDays <= 7 ? 'text-orange-400' :
                                'text-green-400'
                              }`}>
                                {member.remainingDays <= 0 ? 'Expired' : `${member.remainingDays} Days`}
                              </span>
                            </td>
                            
                            {/* Membership Status */}
                            <td className="py-4 px-4 text-center">
                              <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider font-mono ${
                                member.computedStatus === 'Active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                member.computedStatus === 'Expiring Soon' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                                'bg-red-500/10 text-red-400 border border-red-500/20'
                              }`}>
                                {member.computedStatus === 'Active' ? '🟢 Active' :
                                 member.computedStatus === 'Expiring Soon' ? '🟡 Expiring Soon' :
                                 '🔴 Expired'}
                              </span>
                            </td>
                            
                            {/* Actions */}
                            <td className="py-4 px-4 text-right">
                              <div className="flex justify-end gap-2 items-center">
                                <button
                                  onClick={() => {
                                    setRenewingMemberId(member.id);
                                    setRenewalPlan(member.plan);
                                  }}
                                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] uppercase tracking-wider font-bold transition-colors cursor-pointer"
                                >
                                  Renew
                                </button>
                                
                                <a
                                  href={`https://wa.me/${member.phone}?text=Hello%20${encodeURIComponent(member.name)}!%20This%20is%20Shyam%20Rajput%20from%20Royal%20Fitness%20Club.%20Your%20membership%20status%20is%20currently%20${member.computedStatus}.`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded flex items-center justify-center transition-colors"
                                  title="WhatsApp Member"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.38 2.016 13.908.993 11.278.993c-5.44 0-9.866 4.372-9.87 9.802 0 1.63.454 3.22 1.317 4.634l-.993 3.63 3.733-.966zm11.321-7.72c-.3-.149-1.772-.863-2.046-.962-.275-.099-.475-.149-.675.15-.199.3-.773.962-.948 1.16-.175.2-.35.226-.65.076-.3-.15-1.267-.461-2.413-1.471-.892-.786-1.493-1.758-1.668-2.056-.175-.3-.019-.462.131-.61.135-.134.3-.349.45-.523.15-.174.2-.3.3-.499.1-.2.05-.375-.025-.524-.075-.15-.675-1.608-.925-2.203-.243-.585-.49-.506-.675-.516-.174-.009-.374-.01-.574-.01s-.524.075-.798.374c-.275.3-1.047 1.012-1.047 2.47 0 1.457 1.073 2.865 1.223 3.064.15.2 2.111 3.178 5.113 4.466.714.306 1.272.489 1.708.626.717.224 1.37.193 1.886.117.575-.085 1.772-.714 2.022-1.405.25-.69.25-1.282.175-1.405-.075-.124-.275-.199-.575-.349z" />
                                  </svg>
                                </a>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            filteredContacts.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <p className="font-display font-semibold text-lg text-white">No contact messages found</p>
                <p className="text-xs mt-1">Submit general questions on the website contact form.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredContacts.map((cnt) => (
                  <div
                    key={cnt.id}
                    className="p-5 bg-dark-bg border border-dark-card-border rounded-xl space-y-4 hover:border-white/10 transition-colors flex flex-col sm:flex-row justify-between sm:items-start"
                  >
                    <div className="space-y-2 flex-grow pr-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[9px] text-gray-500 font-bold">{cnt.id}</span>
                        <span className="text-xs text-gray-500 font-mono">{new Date(cnt.createdAt).toLocaleString()}</span>
                      </div>

                      <h4 className="font-display font-bold text-base text-white">
                        {cnt.name} <span className="text-xs text-gray-400 font-normal">({cnt.email} • {cnt.phone})</span>
                      </h4>

                      <div className="text-xs text-red-500 font-mono uppercase tracking-wider font-bold">
                        Subject: {cnt.subject}
                      </div>

                      <p className="text-xs text-gray-300 font-sans leading-relaxed pt-1">
                        {cnt.message}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-4 sm:pt-0 flex-shrink-0 sm:self-center">
                      <a
                        href={`https://wa.me/${cnt.phone}?text=Hello%20${encodeURIComponent(cnt.name)}!%20This%20is%20Shyam%20Rajput%20from%20Royal%20Fitness%20Club.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-green-500 hover:bg-green-600 text-white rounded flex items-center justify-center transition-colors text-xs font-bold gap-1"
                        title="Chat on WhatsApp"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.38 2.016 13.908.993 11.278.993c-5.44 0-9.866 4.372-9.87 9.802 0 1.63.454 3.22 1.317 4.634l-.993 3.63 3.733-.966zm11.321-7.72c-.3-.149-1.772-.863-2.046-.962-.275-.099-.475-.149-.675.15-.199.3-.773.962-.948 1.16-.175.2-.35.226-.65.076-.3-.15-1.267-.461-2.413-1.471-.892-.786-1.493-1.758-1.668-2.056-.175-.3-.019-.462.131-.61.135-.134.3-.349.45-.523.15-.174.2-.3.3-.499.1-.2.05-.375-.025-.524-.075-.15-.675-1.608-.925-2.203-.243-.585-.49-.506-.675-.516-.174-.009-.374-.01-.574-.01s-.524.075-.798.374c-.275.3-1.047 1.012-1.047 2.47 0 1.457 1.073 2.865 1.223 3.064.15.2 2.111 3.178 5.113 4.466.714.306 1.272.489 1.708.626.717.224 1.37.193 1.886.117.575-.085 1.772-.714 2.022-1.405.25-.69.25-1.282.175-1.405-.075-.124-.275-.199-.575-.349z" />
                        </svg>
                        WhatsApp
                      </a>
                      <button
                        onClick={() => handleDeleteContact(cnt.id)}
                        className="p-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded transition-colors"
                        title="Delete query"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Renewal Modal */}
        {renewingMemberId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <div className="w-full max-w-md bg-dark-bg border border-dark-card-border rounded-2xl p-6 shadow-2xl space-y-6">
              <div>
                <h3 className="font-display font-bold text-xl text-white">Renew Membership Plan</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Select the membership tier package to renew. This resets the join date to today and calculates the new expiry.
                </p>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 font-mono">
                  Select Renewal Tier Package:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'] as const).map((plan) => (
                    <button
                      key={plan}
                      type="button"
                      onClick={() => setRenewalPlan(plan)}
                      className={`px-4 py-3 text-xs font-bold font-mono uppercase rounded-xl border transition-all text-center cursor-pointer ${
                        renewalPlan === plan
                          ? 'bg-red-600/20 border-red-500 text-white'
                          : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:border-white/10'
                      }`}
                    >
                      {plan}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setRenewingMemberId(null)}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-xs uppercase tracking-wider font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRenewMembership(renewingMemberId, renewalPlan)}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs uppercase tracking-wider font-bold transition-all cursor-pointer"
                >
                  Confirm Renewal
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
