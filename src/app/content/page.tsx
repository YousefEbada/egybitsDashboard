'use client';

import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Palette, Type, Sun, Moon, RotateCcw, Save, CheckCircle } from 'lucide-react';

interface ColorSwatch {
  key: keyof typeof defaultColors;
  label: string;
  cssVar: string;
}

const defaultColors = {
  teal: '#00cfbf',
  tealLight: '#4dded4',
  tealDark: '#008f87',
  navy: '#1e2e8a',
  navyDark: '#060c50',
  navyDeeper: '#030820',
};

const colorSwatches: ColorSwatch[] = [
  { key: 'teal', label: 'Primary Teal', cssVar: '--teal' },
  { key: 'tealLight', label: 'Teal Light', cssVar: '--teal-light' },
  { key: 'tealDark', label: 'Teal Dark', cssVar: '--teal-dark' },
  { key: 'navy', label: 'Primary Navy', cssVar: '--navy' },
  { key: 'navyDark', label: 'Navy Dark', cssVar: '--navy-dark' },
  { key: 'navyDeeper', label: 'Navy Deeper', cssVar: '--navy-deeper' },
];

export default function AdminContentPage() {
  const { settings, updateSettings, services, addService, updateService, deleteService } = useData();
  const [activeTab, setActiveTab] = useState<'branding' | 'about' | 'services'>('branding');
  
  // Branding States
  const [colors, setColors] = useState({ ...settings.colors });
  const [logoText, setLogoText] = useState(settings.logoText);
  const [defaultTheme, setDefaultTheme] = useState(settings.defaultTheme);

  // About States
  const [about, setAbout] = useState(settings.about || { 
    badge: '', badgeAr: '', 
    headline: '', headlineAr: '', 
    headlineAccent: '', headlineAccentAr: '', 
    body: '', bodyAr: '', 
    values: [] 
  });

  // Services General States
  const [servicesGeneral, setServicesGeneral] = useState(settings.services_general || {
    badge: '', badgeAr: '', 
    headline: '', headlineAr: '', 
    headlineAccent: '', headlineAccentAr: ''
  });

  // Service form states for Adding/Editing Item
  const [isEditingService, setIsEditingService] = useState<string | null>(null); // service ID or 'new'
  const [serviceForm, setServiceForm] = useState({
    title: '', titleAr: '',
    desc: '', descAr: '',
    icon: 'Code', weight: 0
  });

  const [saved, setSaved] = useState(false);

  const handleSaveBranding = () => {
    updateSettings({ colors, logoText, defaultTheme });
    const root = document.documentElement;
    root.style.setProperty('--teal', colors.teal);
    root.style.setProperty('--teal-light', colors.tealLight);
    root.style.setProperty('--teal-dark', colors.tealDark);
    root.style.setProperty('--navy', colors.navy);
    root.style.setProperty('--navy-dark', colors.navyDark);
    root.style.setProperty('--navy-deeper', colors.navyDeeper);
    triggerSaved();
  };

  const handleSaveAbout = () => {
    updateSettings({ about });
    triggerSaved();
  };

  const handleSaveServicesGeneral = () => {
    updateSettings({ services_general: servicesGeneral });
    triggerSaved();
  };

  const triggerSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleResetColors = () => {
    setColors({ ...defaultColors });
    setLogoText('EgyBits');
    setDefaultTheme('dark');
  };

  const handleAddValueItem = () => {
    setAbout(prev => ({
      ...prev,
      values: [...(prev.values || []), { title: '', titleAr: '', desc: '', descAr: '' }]
    }));
  };

  const handleRemoveValueItem = (index: number) => {
    setAbout(prev => ({
      ...prev,
      values: (prev.values || []).filter((_, i: number) => i !== index)
    }));
  };

  const handleValueChange = (index: number, field: string, value: string) => {
    setAbout(prev => {
      const newValues = [...(prev.values || [])];
      newValues[index] = { ...newValues[index], [field]: value };
      return { ...prev, values: newValues };
    });
  };

  const handleAddOrUpdateService = async () => {
    if (!serviceForm.title?.trim() || !serviceForm.desc?.trim()) {
      alert('Please fill Title and Description');
      return;
    }

    let success = false;
    if (isEditingService === 'new') {
      success = await addService(serviceForm);
    } else if (isEditingService) {
      success = await updateService(isEditingService, serviceForm);
    }

    if (success) {
      setIsEditingService(null);
      setServiceForm({ title: '', titleAr: '', desc: '', descAr: '', icon: 'Code', weight: 0 });
      triggerSaved();
    } else {
      alert('Failed to save service. Please check backend response.');
    }
  };

  const handleSeedServices = async () => {
    const defaults = [
      { icon: '🌐', title: 'Web Development', titleAr: 'تطوير الويب', desc: 'From landing pages to complex SaaS platforms built with Next.js, React, and modern stacks.', descAr: 'من الصفحات المقصودة إلى منصات SaaS المعقدة بـ Next.js وReact.', weight: 1 },
      { icon: '📱', title: 'Mobile Applications', titleAr: 'تطبيقات الجوال', desc: 'Native and cross-platform apps for iOS and Android with stunning UX.', descAr: 'تطبيقات أصلية ومتعددة المنصات لنظامي iOS وAndroid.', weight: 2 },
      { icon: '🎨', title: 'UI/UX Design', titleAr: 'تصميم UI/UX', desc: 'Research-driven design systems and interfaces that users love and businesses trust.', descAr: 'أنظمة تصميم تعتمد البحث وواجهات يحبها المستخدمون.', weight: 3 },
      { icon: '☁️', title: 'Cloud & DevOps', titleAr: 'السحابة وDevOps', desc: 'Scalable infrastructure on AWS, GCP, and Azure with CI/CD pipelines.', descAr: 'بنية تحتية قابلة للتوسع على AWS وGCP وAzure.', weight: 4 },
      { icon: '🤖', title: 'AI Integration', titleAr: 'الذكاء الاصطناعي', desc: 'LLM-powered features, computer vision, and ML pipelines for next-gen products.', descAr: 'ميزات مدعومة بالنماذج اللغوية الكبيرة ورؤية الحاسوب.', weight: 5 },
      { icon: '🔒', title: 'Cybersecurity', titleAr: 'الأمن السيبراني', desc: 'Penetration testing, security audits, and compliance-ready architectures.', descAr: 'اختبار الاختراق ومراجعات الأمان والبنى المتوافقة.', weight: 6 }
    ];
    for (const s of defaults) {
      await addService(s);
    }
    triggerSaved();
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
    padding: '12px 14px',
    borderRadius: '10px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-subtle)',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '16px',
  };

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 18px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: '600',
    background: active ? 'rgba(0,207,191,0.1)' : 'transparent',
    color: active ? 'var(--teal)' : 'var(--text-secondary)',
    border: active ? '1px solid var(--teal)' : '1px solid transparent',
    transition: 'all 0.2s',
  });

  return (
    <div style={{ maxWidth: '850px' }}>
      {/* Header with Global Save/Status */}
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            Site Management
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: 'var(--text-muted)', marginTop: '6px' }}>
            Manage colors, About sections, and Services lists transparently.
          </p>
        </div>
        {saved && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#22c55e', fontSize: '14px', fontWeight: '600' }}>
            <CheckCircle size={18} /> Settings Synchronized!
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
        <button onClick={() => setActiveTab('branding')} style={tabStyle(activeTab === 'branding')}>Branding</button>
        <button onClick={() => setActiveTab('about')} style={tabStyle(activeTab === 'about')}>About Section</button>
        <button onClick={() => setActiveTab('services')} style={tabStyle(activeTab === 'services')}>Services</button>
      </div>

      {/* BRANDING TAB */}
      {activeTab === 'branding' && (
        <>
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Palette size={20} color="var(--teal)" />
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>Brand Colors</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
              {colorSwatches.map(({ key, label }) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input type="color" value={colors[key]} onChange={e => setColors(prev => ({ ...prev, [key]: e.target.value }))} style={{ width: '42px', height: '42px', borderRadius: '10px', border: 'none', cursor: 'pointer' }} />
                    <input type="text" value={colors[key]} onChange={e => setColors(prev => ({ ...prev, [key]: e.target.value }))} style={{ ...inputStyle, marginBottom: 0, fontFamily: "'DM Mono', monospace", fontSize: '12px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={cardStyle}>
            <label style={labelStyle}>Logo Text</label>
            <input type="text" value={logoText} onChange={e => setLogoText(e.target.value)} style={inputStyle} />
          </div>
          <button onClick={handleSaveBranding} style={{ padding: '12px 24px', background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Save Branding</button>
        </>
      )}

      {/* ABOUT TAB */}
      {activeTab === 'about' && (
        <>
          <div style={cardStyle}>
            <h3 style={{ marginBottom: '16px' }}>General About Info</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Badge (English)</label>
                <input type="text" value={about.badge} onChange={e => setAbout(p => ({ ...p, badge: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Badge (Arabic)</label>
                <input type="text" value={about.badgeAr} onChange={e => setAbout(p => ({ ...p, badgeAr: e.target.value }))} style={inputStyle} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Headline (English)</label>
                <input type="text" value={about.headline} onChange={e => setAbout(p => ({ ...p, headline: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Headline (Arabic)</label>
                <input type="text" value={about.headlineAr} onChange={e => setAbout(p => ({ ...p, headlineAr: e.target.value }))} style={inputStyle} />
              </div>
            </div>
            <label style={labelStyle}>Body (English)</label>
            <textarea value={about.body} onChange={e => setAbout(p => ({ ...p, body: e.target.value }))} style={{ ...inputStyle, height: '100px' }} />
            <label style={labelStyle}>Body (Arabic)</label>
            <textarea value={about.bodyAr} onChange={e => setAbout(p => ({ ...p, bodyAr: e.target.value }))} style={{ ...inputStyle, height: '100px' }} />
          </div>
          
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Company Values Card list</h3>
              <button onClick={handleAddValueItem} style={{ padding: '6px 12px', background: 'rgba(0,207,191,0.1)', border: '1px solid var(--teal)', color: 'var(--teal)', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>+ Add Value</button>
            </div>
            {about.values?.map((v: any, i: number) => (
              <div key={i} style={{ border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: '12px', marginBottom: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input placeholder="Title EN" value={v.title} onChange={e => handleValueChange(i, 'title', e.target.value)} style={inputStyle} />
                  <input placeholder="Title AR" value={v.titleAr} onChange={e => handleValueChange(i, 'titleAr', e.target.value)} style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input placeholder="Desc EN" value={v.desc} onChange={e => handleValueChange(i, 'desc', e.target.value)} style={inputStyle} />
                  <input placeholder="Desc AR" value={v.descAr} onChange={e => handleValueChange(i, 'descAr', e.target.value)} style={inputStyle} />
                </div>
                <button onClick={() => handleRemoveValueItem(i)} style={{ color: '#ef4444', fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Remove</button>
              </div>
            ))}
          </div>
          <button onClick={handleSaveAbout} style={{ padding: '12px 24px', background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>Save About Data</button>
        </>
      )}

      {/* SERVICES TAB */}
      {activeTab === 'services' && (
        <>
          <div style={cardStyle}>
            <h3>General Services Header</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Headline (English)</label>
                <input type="text" value={servicesGeneral.headline} onChange={e => setServicesGeneral(p => ({ ...p, headline: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Headline (Arabic)</label>
                <input type="text" value={servicesGeneral.headlineAr} onChange={e => setServicesGeneral(p => ({ ...p, headlineAr: e.target.value }))} style={inputStyle} />
              </div>
            </div>
            <button onClick={handleSaveServicesGeneral} style={{ padding: '10px 18px', background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Update Header</button>
          </div>

          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Cards Items Management</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                {services.length === 0 && (
                  <button onClick={handleSeedServices} style={{ padding: '6px 12px', background: 'rgba(59,130,246,0.1)', border: '1px solid #3b82f6', color: '#3b82f6', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    🌱 Seed Default Items
                  </button>
                )}
                <button onClick={() => { setIsEditingService('new'); setServiceForm({ title: '', titleAr: '', desc: '', descAr: '', icon: 'Code', weight: 0 }); }} style={{ padding: '6px 12px', background: 'rgba(0,207,191,0.1)', border: '1px solid var(--teal)', color: 'var(--teal)', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                  + Add Service
                </button>
              </div>
            </div>

            {isEditingService && (
              <div style={{ border: '2px solid var(--teal)', padding: '20px', borderRadius: '12px', marginBottom: '24px', background: 'rgba(0, 0, 0, 0.1)' }}>
                <h4 style={{ marginTop: 0 }}>{isEditingService === 'new' ? 'New Service' : 'Edit Service'}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input placeholder="Title EN" value={serviceForm.title} onChange={e => setServiceForm(p => ({ ...p, title: e.target.value }))} style={inputStyle} />
                  <input placeholder="Title AR" value={serviceForm.titleAr} onChange={e => setServiceForm(p => ({ ...p, titleAr: e.target.value }))} style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <textarea placeholder="Desc EN" value={serviceForm.desc} onChange={e => setServiceForm(p => ({ ...p, desc: e.target.value }))} style={inputStyle} />
                  <textarea placeholder="Desc AR" value={serviceForm.descAr} onChange={e => setServiceForm(p => ({ ...p, descAr: e.target.value }))} style={inputStyle} />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={handleAddOrUpdateService} style={{ padding: '8px 16px', background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Save Card</button>
                  <button onClick={() => setIsEditingService(null)} style={{ padding: '8px 16px', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {services.map((s: any) => (
                <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', borderRadius: '10px', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)' }}>
                  <div>
                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{s.title}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block' }}>{s.desc?.substring(0, 40)}...</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => { setIsEditingService(s._id); setServiceForm({ title: s.title || '', titleAr: s.titleAr || '', desc: s.desc || '', descAr: s.descAr || '', icon: s.icon || 'Code', weight: s.weight || 0 }); }} style={{ padding: '4px 8px', fontSize: '12px', background: 'none', border: '1px solid var(--teal)', color: 'var(--teal)', borderRadius: '6px', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => deleteService(s._id)} style={{ padding: '4px 8px', fontSize: '12px', background: 'none', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

