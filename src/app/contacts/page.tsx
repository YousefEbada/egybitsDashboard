'use client';

import { useData } from '@/context/DataContext';
import { Mail, CheckCircle, Trash2, ExternalLink } from 'lucide-react';

export default function AdminContacts() {
  const { contacts, markContactRead, deleteContact } = useData();
  const unread = contacts.filter(c => !c.read).length;

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
          Contact Messages
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontFamily: "'DM Sans', sans-serif" }}>
          {contacts.length} total · {unread} unread
        </p>
      </div>

      {contacts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <Mail size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px' }}>No messages yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {contacts.map(c => (
            <div key={c.id} style={{
              background: c.read ? 'var(--bg-card)' : 'rgba(0,207,191,0.04)',
              border: `1px solid ${c.read ? 'var(--border-subtle)' : 'rgba(0,207,191,0.2)'}`,
              borderRadius: '14px',
              padding: '20px 24px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, var(--teal), #1e2e8a)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne', sans-serif", fontWeight: '700', fontSize: '14px', color: 'white', flexShrink: 0 }}>
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>{c.name}
                      {!c.read && <span style={{ marginLeft: '8px', padding: '2px 8px', background: 'rgba(0,207,191,0.15)', borderRadius: '4px', fontSize: '11px', color: 'var(--teal)' }}>New</span>}
                    </span>
                    <a href={`mailto:${c.email}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--teal)', fontSize: '13px', fontFamily: "'DM Sans', sans-serif", textDecoration: 'none' }}>
                      {c.email} <ExternalLink size={12} />
                    </a>
                    {c.service && (
                      <span style={{ padding: '3px 8px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '6px', fontSize: '12px', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                        {c.service}
                      </span>
                    )}
                  </div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{c.message}</p>
                  <div style={{ marginTop: '10px', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: 'var(--text-muted)' }}>
                    {c.date ? new Date(c.date).toLocaleString() : 'N/A'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  {!c.read && (
                    <button onClick={() => markContactRead(c.id)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', background: 'rgba(0,207,191,0.1)', border: '1px solid rgba(0,207,191,0.2)', borderRadius: '8px', cursor: 'pointer', color: 'var(--teal)', fontSize: '12px', fontFamily: "'DM Sans', sans-serif", fontWeight: '600' }}>
                      <CheckCircle size={14} /> Mark Read
                    </button>
                  )}
                  <button onClick={() => { if (confirm('Delete?')) deleteContact(c.id); }} style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', borderRadius: '8px' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
