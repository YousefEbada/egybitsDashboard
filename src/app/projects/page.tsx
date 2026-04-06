'use client';

import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Plus, Pencil, Trash2, X, Check, ExternalLink, Star } from 'lucide-react';
import { Github } from '@/components/BrandIcons';
import type { Project } from '@/data/siteData';

type ProjectForm = Omit<Project, 'id' | 'mainImage' | 'galleryImages'>;

const EMPTY: ProjectForm = {
  slug: '',
  title: '',
  titleAr: '',
  category: '',
  categoryAr: '',
  desc: '',
  descAr: '',
  tech: [],
  color: '#00cfbf',
  projectLink: '',
  githubUrl: '',
  client: '',
  clientAr: '',
  duration: '',
  challenge: '',
  challengeAr: '',
  solution: '',
  solutionAr: '',
  results: [],
  resultsAr: [],
  featured: false,
};

export default function AdminProjects() {
  const { projects, addProject, updateProject, deleteProject } = useData();
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<ProjectForm>(EMPTY);
  const [techInput, setTechInput] = useState('');
  const [resultInput, setResultInput] = useState('');
  const [resultInputAr, setResultInputAr] = useState('');
  
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([]);

  const openCreate = () => {
    setForm(EMPTY);
    setTechInput('');
    setResultInput('');
    setMainImageFile(null);
    setGalleryImageFiles([]);
    setCreating(true);
    setEditing(null);
  };

  const openEdit = (p: Project) => {
    setForm({
      slug: p.slug, title: p.title, titleAr: p.titleAr,
      category: p.category, categoryAr: p.categoryAr,
      desc: p.desc, descAr: p.descAr, tech: p.tech ? [...p.tech] : [],
      color: p.color,
      projectLink: p.projectLink ?? '', githubUrl: p.githubUrl ?? '',
      client: p.client ?? '', clientAr: p.clientAr ?? '',
      duration: p.duration ?? '',
      challenge: p.challenge ?? '', challengeAr: p.challengeAr ?? '',
      solution: p.solution ?? '', solutionAr: p.solutionAr ?? '',
      results: [...(p.results ?? [])], resultsAr: [...(p.resultsAr ?? [])],
      featured: p.featured ?? false,
    });
    setTechInput('');
    setResultInput('');
    setMainImageFile(null);
    setGalleryImageFiles([]);
    setEditing(p);
    setCreating(false);
  };

  const close = () => { setEditing(null); setCreating(false); };

  const save = async () => {
    if (!form.title?.trim() || !form.slug?.trim() || !form.desc?.trim() || !form.category?.trim() || !form.client?.trim() || !form.duration?.trim()) {
      alert('Please fill all required fields: Title, Slug, Description, Category, Client, Duration');
      return;
    }
    
    if (creating && (!mainImageFile || galleryImageFiles.length < 5)) {
      alert('Please select a main image and at least 5 gallery images.');
      return;
    }

    if (galleryImageFiles.length > 0 && galleryImageFiles.length < 5) {
      alert('Gallery must have at least 5 images if you are providing new ones.');
      return;
    }

    const fd = new FormData();
    Object.keys(form).forEach((k) => {
      const val = (form as any)[k];
      if (k === 'tech' || k === 'results' || k === 'resultsAr') {
         if (Array.isArray(val) && val.length > 0) {
           fd.append(k, val.join(','));
         }
      } else if (val !== null && val !== undefined && val !== '') {
         fd.append(k, val as string);
      }
    });

    if (mainImageFile) {
      fd.append('mainImage', mainImageFile);
    }
    if (galleryImageFiles.length > 0) {
      galleryImageFiles.forEach(f => fd.append('galleryImages', f));
    }
    
    let success = false;
    if (creating) {
      success = await addProject(fd as any);
    } else if (editing) {
      success = await updateProject(editing.id, fd as any);
    }
    
    if (success) {
      close();
    } else {
      alert('Failed to save project. Please check backend logs.');
    }
  };

  const addTech = () => {
    const val = techInput.trim();
    if (val && !(form.tech || []).includes(val)) {
      setForm(f => ({ ...f, tech: [...(f.tech || []), val] }));
      setTechInput('');
    }
  };

  const addResult = () => {
    const val = resultInput.trim();
    if (val) {
      setForm(f => ({ ...f, results: [...(f.results ?? []), val] }));
      setResultInput('');
    }
  };

  const addResultAr = () => {
    const val = resultInputAr.trim();
    if (val) {
      setForm(f => ({ ...f, resultsAr: [...(f.resultsAr ?? []), val] }));
      setResultInputAr('');
    }
  };

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
            Projects
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontFamily: "'DM Sans', sans-serif" }}>
            {projects.length} total projects
          </p>
        </div>
        <button onClick={openCreate} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '10px 18px', background: 'var(--teal)', border: 'none',
          borderRadius: '10px', cursor: 'pointer',
          color: 'white', fontFamily: "'DM Sans', sans-serif",
          fontSize: '14px', fontWeight: '600',
        }}>
          <Plus size={16} /> Add Project
        </button>
      </div>

      {/* Project list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {projects.map(p => (
          <div key={p.id} style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
            borderRadius: '12px', padding: '16px 20px',
          }}>
            {/* Color indicator */}
            <div style={{ width: '10px', height: '40px', borderRadius: '4px', background: p.color, flexShrink: 0 }} />
            {p.mainImage && (
              <img src={p.mainImage} alt={p.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
            )}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {p.title}
                </div>
                {p.featured && <Star size={13} fill="currentColor" color="#f59e0b" />}
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'var(--text-muted)' }}>
                {p.category} · {(p.tech || []).slice(0, 3).join(', ')}
              </div>
            </div>
            {p.projectLink && <a href={p.projectLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }}><ExternalLink size={15} /></a>}
            {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }}><Github size={15} /></a>}
            <button onClick={() => openEdit(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <Pencil size={15} />
            </button>
            <button onClick={() => { if (confirm('Delete this project?')) deleteProject(p.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171' }}>
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {(creating || editing) && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px',
        }}>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
            borderRadius: '20px', width: '100%', maxWidth: '700px',
            maxHeight: '85vh', overflowY: 'auto', padding: '28px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                {creating ? 'New Project' : 'Edit Project'}
              </h2>
              <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Row 1: Title & Arabic Title */}
              <div>
                <label style={labelStyle}>Title (English) *</label>
                <input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Project title" />
              </div>
              <div>
                <label style={labelStyle}>Title (Arabic)</label>
                <input style={{ ...inputStyle, direction: 'rtl' }} value={form.titleAr || ''} onChange={e => setForm(f => ({ ...f, titleAr: e.target.value }))} placeholder="عنوان المشروع" />
              </div>

              {/* Row 2: Slug & Category */}
              <div>
                <label style={labelStyle}>Slug</label>
                <input style={inputStyle} value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="project-slug" />
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <input style={inputStyle} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="FinTech · Web App" />
              </div>

              {/* Media Uploads */}
              <div style={{ gridColumn: '1 / -1', padding: '16px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Main Image {creating ? '*' : '(Leave empty to keep current)'}</label>
                  <input type="file" accept="image/*" onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setMainImageFile(e.target.files[0]);
                    }
                  }} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Gallery Images {creating ? '(Min 5)*' : '(Min 5. Leave empty to keep current)'}</label>
                  <input type="file" accept="image/*" multiple onChange={e => {
                    if (e.target.files) {
                      setGalleryImageFiles(Array.from(e.target.files));
                    }
                  }} style={inputStyle} />
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {galleryImageFiles.length} files selected
                  </p>
                </div>
              </div>

              {/* Row 3: Category Arabic & Color */}
              <div>
                <label style={labelStyle}>Category (Arabic)</label>
                <input style={{ ...inputStyle, direction: 'rtl' }} value={form.categoryAr || ''} onChange={e => setForm(f => ({ ...f, categoryAr: e.target.value }))} placeholder="التصنيف" />
              </div>
              <div>
                <label style={labelStyle}>Accent Color</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} style={{ width: '44px', height: '40px', borderRadius: '8px', border: '1px solid var(--border-subtle)', cursor: 'pointer', background: 'none' }} />
                  <input style={{ ...inputStyle }} value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} />
                </div>
              </div>

              {/* Row 4: Descriptions */}
              <div>
                <label style={labelStyle}>Description (English)</label>
                <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '60px' }} value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="Brief project description..." />
              </div>
              <div>
                <label style={labelStyle}>Description (Arabic)</label>
                <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '60px', direction: 'rtl' }} value={form.descAr || ''} onChange={e => setForm(f => ({ ...f, descAr: e.target.value }))} placeholder="وصف المشروع..." />
              </div>

              {/* Row 5: URLs */}
              <div>
                <label style={labelStyle}>Project Live URL</label>
                <input style={inputStyle} value={form.projectLink ?? ''} onChange={e => setForm(f => ({ ...f, projectLink: e.target.value }))} placeholder="https://..." />
              </div>
              <div>
                <label style={labelStyle}>GitHub URL</label>
                <input style={inputStyle} value={form.githubUrl ?? ''} onChange={e => setForm(f => ({ ...f, githubUrl: e.target.value }))} placeholder="https://github.com/..." />
              </div>

              {/* Row 6: Client & Arabic Client */}
              <div>
                <label style={labelStyle}>Client (English)</label>
                <input style={inputStyle} value={form.client ?? ''} onChange={e => setForm(f => ({ ...f, client: e.target.value }))} placeholder="Client name" />
              </div>
              <div>
                <label style={labelStyle}>Client (Arabic)</label>
                <input style={{ ...inputStyle, direction: 'rtl' }} value={form.clientAr ?? ''} onChange={e => setForm(f => ({ ...f, clientAr: e.target.value }))} placeholder="اسم العميل" />
              </div>

              {/* Row 7: Duration & Featured */}
              <div>
                <label style={labelStyle}>Duration</label>
                <input style={inputStyle} value={form.duration ?? ''} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="6 months" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.featured ?? false} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} style={{ width: '18px', height: '18px' }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: 'var(--text-secondary)' }}>Feature on homepage</span>
                </label>
              </div>

              {/* Row 8: Tech Stack (Full Width) */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Tech Stack</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input style={{ ...inputStyle }} value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())} placeholder="Next.js, React, ..." />
                  <button onClick={addTech} style={{ padding: '10px 14px', background: 'var(--teal)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: 'white', flexShrink: 0 }}>
                    <Plus size={16} />
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(form.tech || []).map(t => (
                    <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: '6px', fontSize: '12px', color: 'var(--text-secondary)', fontFamily: "'DM Mono', monospace" }}>
                      {t}
                      <button onClick={() => setForm(f => ({ ...f, tech: (f.tech || []).filter(x => x !== t) }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', padding: 0 }}><X size={12} /></button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Row 9: Challenge & Arabic Challenge */}
              <div>
                <label style={labelStyle}>Challenge (English)</label>
                <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '60px' }} value={form.challenge ?? ''} onChange={e => setForm(f => ({ ...f, challenge: e.target.value }))} placeholder="What was the challenge?" />
              </div>
              <div>
                <label style={labelStyle}>Challenge (Arabic)</label>
                <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '60px', direction: 'rtl' }} value={form.challengeAr ?? ''} onChange={e => setForm(f => ({ ...f, challengeAr: e.target.value }))} placeholder="التحدي..." />
              </div>

              {/* Row 10: Solution & Arabic Solution */}
              <div>
                <label style={labelStyle}>Solution (English)</label>
                <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '60px' }} value={form.solution ?? ''} onChange={e => setForm(f => ({ ...f, solution: e.target.value }))} placeholder="What was our solution?" />
              </div>
              <div>
                <label style={labelStyle}>Solution (Arabic)</label>
                <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '60px', direction: 'rtl' }} value={form.solutionAr ?? ''} onChange={e => setForm(f => ({ ...f, solutionAr: e.target.value }))} placeholder="الحل..." />
              </div>

              {/* Row 11: Results (English & Arabic sub-sections) */}
              <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                <div>
                  <label style={labelStyle}>Measurable Results (English)</label>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input style={{ ...inputStyle }} value={resultInput} onChange={e => setResultInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addResult())} placeholder="Add a measurable result..." />
                    <button onClick={addResult} style={{ padding: '10px 14px', background: 'var(--teal)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: 'white', flexShrink: 0 }}><Plus size={16} /></button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {(form.results ?? []).map((r, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
                        <span style={{ flex: 1, fontSize: '13px', color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" }}>{r}</span>
                        <button onClick={() => setForm(f => ({ ...f, results: (f.results ?? []).filter((_, j) => j !== i) }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', padding: 0 }}><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Measurable Results (Arabic)</label>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input style={{ ...inputStyle, direction: 'rtl' }} value={resultInputAr} onChange={e => setResultInputAr(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addResultAr())} placeholder="أضف نتيجة قابلة للقياس..." />
                    <button onClick={addResultAr} style={{ padding: '10px 14px', background: 'var(--teal)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: 'white', flexShrink: 0 }}><Plus size={16} /></button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {(form.resultsAr ?? []).map((r, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: '8px', direction: 'rtl' }}>
                        <span style={{ flex: 1, fontSize: '13px', color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" }}>{r}</span>
                        <button onClick={() => setForm(f => ({ ...f, resultsAr: (f.resultsAr ?? []).filter((_, j) => j !== i) }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', padding: 0 }}><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                </div>
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
                <Check size={16} /> Save Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
