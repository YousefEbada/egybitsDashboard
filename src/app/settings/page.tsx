'use client';

import { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { Settings, Globe, Shield, Bell, Database, CheckCircle, Save, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function AdminSettingsPage() {
  const { settings, updateSettings, projects, team, testimonials, contacts } = useData();
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'hero' | 'about'>('general');
  
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    if (settings) {
      setForm(settings);
    }
  }, [settings]);

  const handleSave = async () => {
    await updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const updateField = (section: string, field: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const cardStyle: React.CSSProperties = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '24px',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    marginBottom: '8px',
    display: 'block',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '15px',
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-subtle)',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const toggleStyle = (on: boolean): React.CSSProperties => ({
    width: '44px',
    height: '24px',
    borderRadius: '12px',
    background: on ? 'var(--teal)' : 'var(--border-subtle)',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background 0.2s',
    flexShrink: 0,
  });

  const thumbStyle = (on: boolean): React.CSSProperties => ({
    position: 'absolute',
    top: '3px',
    left: on ? '23px' : '3px',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    background: '#fff',
    transition: 'left 0.2s',
    boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
  });

  const stats = [
    { label: 'Projects', value: projects.length, link: '/projects', color: 'var(--teal)' },
    { label: 'Team', value: team.length, link: '/team', color: '#6366f1' },
    { label: 'Testimonials', value: testimonials.length, link: '/testimonials', color: '#f59e0b' },
    { label: 'Messages', value: contacts.length, link: '/contacts', color: '#ec4899' },
  ];

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    fontWeight: '600',
    background: active ? 'var(--teal)' : 'transparent',
    color: active ? '#fff' : 'var(--text-secondary)',
    transition: 'all 0.2s',
  });

  return (
    <div style={{ maxWidth: '800px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            Settings
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: 'var(--text-muted)', marginTop: '6px' }}>
            Configure global site settings, landing page sections, and preferences.
          </p>
        </div>
        <button onClick={handleSave} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px',
          fontFamily: "'DM Sans', sans-serif", fontWeight: '600',
          background: saved ? '#22c55e' : 'var(--teal)', border: 'none', color: '#fff',
          transition: 'background 0.3s',
        }}>
          {saved ? <><CheckCircle size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
        </button>
      </div>

      {/* Stats Quick Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {stats.map(s => (
          <Link key={s.label} href={s.link} style={{ textDecoration: 'none' }}>
            <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '800', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', padding: '6px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
        <button onClick={() => setActiveTab('general')} style={tabStyle(activeTab === 'general')}>General</button>
        <button onClick={() => setActiveTab('hero')} style={tabStyle(activeTab === 'hero')}>Hero Section</button>
        <button onClick={() => setActiveTab('about')} style={tabStyle(activeTab === 'about')}>Who We Are</button>
      </div>

      {/* Tab Content */}
      {activeTab === 'general' && (
        <>
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Globe size={20} color="var(--teal)" />
              <h2 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>Site Metadata</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Site Title (EN)</label>
                  <input type="text" value={form.siteTitle || ''} onChange={e => setForm({ ...form, siteTitle: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Site Title (AR)</label>
                  <input type="text" value={form.siteTitleAr || ''} onChange={e => setForm({ ...form, siteTitleAr: e.target.value })} style={{ ...inputStyle, direction: 'rtl' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Meta Description (EN)</label>
                  <textarea value={form.siteDesc || ''} onChange={e => setForm({ ...form, siteDesc: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                </div>
                <div>
                  <label style={labelStyle}>Meta Description (AR)</label>
                  <textarea value={form.siteDescAr || ''} onChange={e => setForm({ ...form, siteDescAr: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical', direction: 'rtl' }} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Contact Email</label>
                <input type="email" value={form.contactEmail || ''} onChange={e => setForm({ ...form, contactEmail: e.target.value })} style={inputStyle} />
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Settings size={20} color="var(--teal)" />
              <h2 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>Preferences</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-primary)', borderRadius: '10px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Maintenance Mode</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Closes visible site access.</div>
                </div>
                <button onClick={() => setForm({ ...form, maintenanceMode: !form.maintenanceMode })} style={toggleStyle(form.maintenanceMode)}>
                  <span style={thumbStyle(form.maintenanceMode)} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'hero' && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Settings size={20} color="var(--teal)" />
            <h2 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>Hero Section</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Badge (EN)</label>
                <input value={form.hero?.badge || ''} onChange={e => updateField('hero', 'badge', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Badge (AR)</label>
                <input value={form.hero?.badgeAr || ''} onChange={e => updateField('hero', 'badgeAr', e.target.value)} style={{ ...inputStyle, direction: 'rtl' }} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Headline (English)</label>
              <textarea value={form.hero?.headline1 || ''} onChange={e => updateField('hero', 'headline1', e.target.value)} rows={2} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Headline (Arabic)</label>
              <textarea value={form.hero?.headline1Ar || ''} onChange={e => updateField('hero', 'headline1Ar', e.target.value)} rows={2} style={{ ...inputStyle, direction: 'rtl' }} />
            </div>

            <div>
              <label style={labelStyle}>Subheadline (English)</label>
              <textarea value={form.hero?.subheadline || ''} onChange={e => updateField('hero', 'subheadline', e.target.value)} rows={2} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Subheadline (Arabic)</label>
              <textarea value={form.hero?.subheadlineAr || ''} onChange={e => updateField('hero', 'subheadlineAr', e.target.value)} rows={2} style={{ ...inputStyle, direction: 'rtl' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>CTA 1 text (EN)</label>
                <input value={form.hero?.cta1 || ''} onChange={e => updateField('hero', 'cta1', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>CTA 1 text (AR)</label>
                <input value={form.hero?.cta1Ar || ''} onChange={e => updateField('hero', 'cta1Ar', e.target.value)} style={{ ...inputStyle, direction: 'rtl' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'about' && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Settings size={20} color="var(--teal)" />
            <h2 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>Who We Are</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Badge (EN)</label>
                <input value={form.about?.badge || ''} onChange={e => updateField('about', 'badge', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Badge (AR)</label>
                <input value={form.about?.badgeAr || ''} onChange={e => updateField('about', 'badgeAr', e.target.value)} style={{ ...inputStyle, direction: 'rtl' }} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Headline (English)</label>
              <textarea value={form.about?.headline || ''} onChange={e => updateField('about', 'headline', e.target.value)} rows={2} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Headline (Arabic)</label>
              <textarea value={form.about?.headlineAr || ''} onChange={e => updateField('about', 'headlineAr', e.target.value)} rows={2} style={{ ...inputStyle, direction: 'rtl' }} />
            </div>

            <div>
              <label style={labelStyle}>Body Content (English)</label>
              <textarea value={form.about?.body || ''} onChange={e => updateField('about', 'body', e.target.value)} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div>
              <label style={labelStyle}>Body Content (Arabic)</label>
              <textarea value={form.about?.bodyAr || ''} onChange={e => updateField('about', 'bodyAr', e.target.value)} rows={4} style={{ ...inputStyle, resize: 'vertical', direction: 'rtl' }} />
            </div>
          </div>
        </div>
      )}

      {/* Security Info */}
      <div style={{ ...cardStyle, background: 'rgba(99,102,241,0.05)', borderColor: 'rgba(99,102,241,0.2)' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Shield size={20} color="#6366f1" />
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#6366f1' }}>Security Configured</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Changes populate to live environment correctly across controllers securely.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
