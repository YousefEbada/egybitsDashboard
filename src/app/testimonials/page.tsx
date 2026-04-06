'use client';

import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Plus, Pencil, Trash2, X, Check, Star } from 'lucide-react';
import type { Testimonial } from '@/data/siteData';

const EMPTY: Omit<Testimonial, 'id'> = { name: '', nameAr: '', role: '', roleAr: '', content: '', contentAr: '', avatar: '', rating: 5, featured: false, country: '' };

export default function AdminTestimonials() {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useData();
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Omit<Testimonial, 'id'>>(EMPTY);

  const openCreate = () => { setForm(EMPTY); setCreating(true); setEditing(null); };
  const openEdit = (t: Testimonial) => { setForm({ ...t }); setEditing(t); setCreating(false); };
  const close = () => { setEditing(null); setCreating(false); };
  const save = async () => {
    if (!form.name?.trim() || !form.content?.trim() || !form.role?.trim()) {
      alert('Please fill Name, Role, and Content');
      return;
    }
    
    let success = false;
    if (creating) {
      success = await addTestimonial(form);
    } else if (editing) {
      success = await updateTestimonial(editing.id, form);
    }
    
    if (success) {
      close();
    } else {
      alert('Failed to save testimonial.');
    }
  };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: '8px', color: 'var(--text-primary)', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', outline: 'none' };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif", marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>Testimonials</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontFamily: "'DM Sans', sans-serif" }}>{testimonials.length} reviews</p>
        </div>
        <button onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: 'var(--teal)', border: 'none', borderRadius: '10px', cursor: 'pointer', color: 'white', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '600' }}>
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {testimonials.map(t => (
          <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '20px' }}>
            <div>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill={i < (t.rating || 5) ? '#00cfbf' : 'none'} color={i < (t.rating || 5) ? '#00cfbf' : 'var(--border-subtle)'} />)}
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '10px' }}>"{t.content}"</p>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>{t.name}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: 'var(--teal)' }}>{t.role}</div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <button onClick={() => openEdit(t)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><Pencil size={15} /></button>
              <button onClick={() => { if (confirm('Delete?')) deleteTestimonial(t.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171' }}><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>

      {(creating || editing) && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: '20px', width: '100%', maxWidth: '520px', maxHeight: '85vh', overflowY: 'auto', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>{creating ? 'New Testimonial' : 'Edit Testimonial'}</h2>
              <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><label style={labelStyle}>Name (English) *</label><input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                <div><label style={labelStyle}>Name (Arabic)</label><input style={{ ...inputStyle, direction: 'rtl' }} value={form.nameAr || ''} onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><label style={labelStyle}>Role (English)</label><input style={inputStyle} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} /></div>
                <div><label style={labelStyle}>Role (Arabic)</label><input style={{ ...inputStyle, direction: 'rtl' }} value={form.roleAr || ''} onChange={e => setForm(f => ({ ...f, roleAr: e.target.value }))} /></div>
              </div>
              <div><label style={labelStyle}>Avatar URL</label><input style={inputStyle} value={form.avatar || ''} onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))} /></div>
              <div><label style={labelStyle}>Testimonial Text (English) *</label><textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} /></div>
              <div><label style={labelStyle}>Testimonial Text (Arabic)</label><textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical', direction: 'rtl' }} value={form.contentAr || ''} onChange={e => setForm(f => ({ ...f, contentAr: e.target.value }))} /></div>
              <div>
                <label style={labelStyle}>Rating</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} onClick={() => setForm(f => ({ ...f, rating: n }))} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      <Star size={22} fill={n <= (form.rating || 5) ? '#00cfbf' : 'none'} color={n <= (form.rating || 5) ? '#00cfbf' : 'var(--border-subtle)'} />
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                <label style={{ ...labelStyle, margin: 0, textTransform: 'none', letterSpacing: 0 }}>Featured on homepage</label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button onClick={close} style={{ padding: '10px 20px', background: 'none', border: '1px solid var(--border-subtle)', borderRadius: '10px', cursor: 'pointer', color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif", fontSize: '14px' }}>Cancel</button>
              <button onClick={save} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 24px', background: 'var(--teal)', border: 'none', borderRadius: '10px', cursor: 'pointer', color: 'white', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '600' }}>
                <Check size={16} /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
