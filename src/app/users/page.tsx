'use client';

import { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { Plus, Pencil, Trash2, X, Check, Shield } from 'lucide-react';

export default function AdminUsers() {
  const { admins, fetchAdmins, addAdmin, updateAdmin, deleteAdmin, role } = useData();
  const [editing, setEditing] = useState<any>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', role: 'admin' });

  useEffect(() => {
    fetchAdmins();
  }, [role]);

  const openCreate = () => {
    setForm({ username: '', password: '', role: 'admin' });
    setCreating(true);
    setEditing(null);
  };

  const openEdit = (u: any) => {
    setForm({ username: u.username, password: '', role: u.role });
    setEditing(u);
    setCreating(false);
  };

  const close = () => { setEditing(null); setCreating(false); };

  const save = async () => {
    if (!form.username.trim() || (!editing && !form.password)) {
      alert('Username and password are required for new users.');
      return;
    }
    
    let success = false;
    if (creating) {
      success = await addAdmin(form);
    } else if (editing) {
      // Don't send empty password if not changing
      const toSend: any = { ...form };
      if (!toSend.password) delete toSend.password;
      success = await updateAdmin(editing._id, toSend);
    }
    
    if (success) {
      close();
    } else {
      alert('Failed to save user. Check backend logs.');
    }
  };

  const isManager = role === 'manager';

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px',
    background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)',
    borderRadius: '8px', color: 'var(--text-primary)',
    fontFamily: "'DM Sans', sans-serif", fontSize: '14px',
    outline: 'none', boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '12px', color: 'var(--text-muted)',
    fontFamily: "'DM Sans', sans-serif", marginBottom: '6px', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: '0.04em',
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            User Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontFamily: "'DM Sans', sans-serif" }}>
            {admins.length} users registered
          </p>
        </div>
        
        {isManager && (
          <button onClick={openCreate} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '10px 18px', background: 'var(--teal)', border: 'none',
            borderRadius: '10px', cursor: 'pointer',
            color: 'white', fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px', fontWeight: '600',
          }}>
            <Plus size={16} /> Add User
          </button>
        )}
      </div>

      {!isManager && (
        <div style={{ padding: '16px', background: 'rgba(248, 113, 113, 0.1)', color: '#f87171', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontFamily: "'DM Sans', sans-serif" }}>
          <Shield size={18} />
          You do not have permission to manage users. This area is restricted to Managers.
        </div>
      )}

      {/* User list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {admins.map(u => (
          <div key={u._id} style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
            borderRadius: '12px', padding: '16px 20px',
            opacity: isManager ? 1 : 0.6
          }}>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {u.username}
                </div>
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'var(--text-muted)' }}>
                Role: {u.role.toUpperCase()}
              </div>
            </div>
            
            {isManager && (
              <>
                <button onClick={() => openEdit(u)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <Pencil size={15} />
                </button>
                <button onClick={() => { if (confirm('Delete this user?')) deleteAdmin(u._id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171' }}>
                  <Trash2 size={15} />
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {(creating || editing) && isManager && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px',
        }}>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
            borderRadius: '20px', width: '100%', maxWidth: '500px',
            padding: '28px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                {creating ? 'New User' : 'Edit User'}
              </h2>
              <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Username</label>
                <input style={inputStyle} value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} placeholder="johndoe" />
              </div>
              
              <div>
                <label style={labelStyle}>Password {editing && '(Leave blank to keep unchanged)'}</label>
                <input type="password" style={inputStyle} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="********" />
              </div>
              
              <div>
                <label style={labelStyle}>Role</label>
                <select style={inputStyle} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button onClick={close} style={{
                padding: '10px 20px', background: 'none', border: '1px solid var(--border-subtle)',
                borderRadius: '10px', cursor: 'pointer', color: 'var(--text-secondary)',
                fontFamily: "'DM Sans', sans-serif", fontSize: '14px',
              }}>
                Cancel
              </button>
              <button onClick={save} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 24px', background: 'var(--teal)', border: 'none',
                borderRadius: '10px', cursor: 'pointer', color: 'white',
                fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '600',
              }}>
                <Check size={16} /> Save User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
