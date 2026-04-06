// 'use client';

// import { useState } from 'react';
// import { useData } from '@/context/DataContext';
// import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

// import type { TeamMember } from '@/data/siteData';
// import { Github, Linkedin } from '@/components/BrandIcons';

// const EMPTY: Omit<TeamMember, 'id' | 'image'> = {
//   name: '', role: '', bio: '', skills: [],
//   nameAr: '', roleAr: '', bioAr: '', emoji: '',
//   linkedin: '', github: '', twitter: ''
// };

// export default function AdminTeam() {
//   const { team, addTeamMember, updateTeamMember, deleteTeamMember } = useData();
//   const [editing, setEditing] = useState<TeamMember | null>(null);
//   const [creating, setCreating] = useState(false);
//   const [form, setForm] = useState<Omit<TeamMember, 'id' | 'image'>>(EMPTY);
//   const [skillInput, setSkillInput] = useState('');
  
//   const [imageFile, setImageFile] = useState<File | null>(null);

//   const openCreate = () => { 
//     setForm(EMPTY); 
//     setSkillInput(''); 
//     setImageFile(null);
//     setCreating(true); 
//     setEditing(null); 
//   };
  
//   const openEdit = (m: TeamMember) => { 
//     setForm({ 
//       name: m.name, role: m.role, bio: m.bio, skills: m.skills ? [...m.skills] : [],
//       nameAr: m.nameAr || '', roleAr: m.roleAr || '', bioAr: m.bioAr || '', emoji: m.emoji || '',
//       linkedin: m.linkedin || '', github: m.github || '', twitter: m.twitter || ''
//     }); 
//     setSkillInput(''); 
//     setImageFile(null);
//     setEditing(m); 
//     setCreating(false); 
//   };
  
//   const close = () => { setEditing(null); setCreating(false); };

//   const save = async () => {
//     if (!form.name?.trim() || !form.role?.trim()) {
//       alert('Please fill Name and Role');
//       return;
//     }
    
//     if (creating && !imageFile) {
//       alert('Please select an image for the team member.');
//       return;
//     }

//     const fd = new FormData();
//     Object.keys(form).forEach((k) => {
//       const val = (form as any)[k];
//       if (k === 'skills') {
//          if (Array.isArray(val) && val.length > 0) fd.append(k, val.join(','));
//       } else if (val !== null && val !== undefined && val !== '') {
//          fd.append(k, val as string);
//       }
//     });

//     if (imageFile) {
//       fd.append('image', imageFile);
//     }
    
//     let success = false;
//     if (creating) {
//       success = await addTeamMember(fd as any);
//     } else if (editing) {
//       success = await updateTeamMember(editing.id, fd as any);
//     }
    
//     if (success) {
//       close();
//     } else {
//       alert('Failed to save team member.');
//     }
//   };

//   const inputStyle: React.CSSProperties = {
//     width: '100%', padding: '10px 12px',
//     background: 'var(--input-bg)', border: '1px solid var(--input-border)',
//     borderRadius: '8px', color: 'var(--text-primary)',
//     fontFamily: "'DM Sans', sans-serif", fontSize: '14px', outline: 'none',
//   };
//   const labelStyle: React.CSSProperties = {
//     display: 'block', fontSize: '12px', color: 'var(--text-muted)',
//     fontFamily: "'DM Sans', sans-serif", marginBottom: '6px', fontWeight: '600',
//     textTransform: 'uppercase', letterSpacing: '0.04em',
//   };

//   return (
//     <div>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
//         <div>
//           <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>Team</h1>
//           <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontFamily: "'DM Sans', sans-serif" }}>{team.length} members</p>
//         </div>
//         <button onClick={openCreate} style={{
//           display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px',
//           background: 'var(--teal)', border: 'none', borderRadius: '10px', cursor: 'pointer',
//           color: 'white', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '600',
//         }}>
//           <Plus size={16} /> Add Member
//         </button>
//       </div>

//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
//         {team.map(m => (
//           <div key={m.id} style={{
//             background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
//             borderRadius: '16px', padding: '20px', position: 'relative'
//           }}>
//             <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '12px' }}>
//               <button onClick={() => openEdit(m)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><Pencil size={15} /></button>
//               <button onClick={() => { if (confirm('Delete member?')) deleteTeamMember(m.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171' }}><Trash2 size={15} /></button>
//             </div>

//             <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
//               <div style={{
//                 width: '72px', height: '72px', borderRadius: '50%',
//                 background: 'linear-gradient(135deg, var(--teal), #1e2e8a)',
//                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 fontFamily: "'Syne', sans-serif", fontWeight: '700', fontSize: '24px',
//                 color: 'white', overflow: 'hidden'
//               }}>
//                 {m.image ? <img src={m.image} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : m.name.charAt(0).toUpperCase()}
//               </div>
//             </div>

//             <div style={{ textAlign: 'center', marginBottom: '12px' }}>
//               <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>{m.name}</div>
//               <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'var(--teal)' }}>{m.role}</div>
//             </div>
            
//             <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
//               {m.linkedin && <a href={m.linkedin} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }}><Linkedin size={16} /></a>}
//               {m.github && <a href={m.github} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }}><Github size={16} /></a>}
//             </div>

//             {m.skills && m.skills.length > 0 && (
//               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center' }}>
//                 {m.skills.slice(0, 4).map(s => (
//                   <span key={s} style={{ padding: '2px 8px', background: 'var(--bg-secondary, rgba(0,0,0,0.15))', borderRadius: '4px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>{s}</span>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {(creating || editing) && (
//         <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
//           <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: '20px', width: '100%', maxWidth: '560px', maxHeight: '85vh', overflowY: 'auto', padding: '28px' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
//               <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>
//                 {creating ? 'New Member' : 'Edit Member'}
//               </h2>
//               <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
//             </div>

//             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//               {/* Image Upload */}
//               <div style={{ padding: '16px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
//                 <label style={labelStyle}>Profile Image {creating ? '*' : '(Leave empty to keep current)'}</label>
//                 <input type="file" accept="image/*" onChange={e => {
//                   if (e.target.files && e.target.files[0]) {
//                     setImageFile(e.target.files[0]);
//                   }
//                 }} style={inputStyle} />
//               </div>

//               <div><label style={labelStyle}>Name (English) *</label><input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name" /></div>
//               <div><label style={labelStyle}>Name (Arabic)</label><input style={{ ...inputStyle, direction: 'rtl' }} value={form.nameAr || ''} onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))} placeholder="الاسم بالكامل" /></div>
              
//               <div><label style={labelStyle}>Role (English) *</label><input style={inputStyle} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="Senior Developer" /></div>
//               <div><label style={labelStyle}>Role (Arabic)</label><input style={{ ...inputStyle, direction: 'rtl' }} value={form.roleAr || ''} onChange={e => setForm(f => ({ ...f, roleAr: e.target.value }))} placeholder="المسمى الوظيفي" /></div>
              
//               <div><label style={labelStyle}>Bio (English)</label><textarea style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Short bio..." /></div>
//               <div><label style={labelStyle}>Bio (Arabic)</label><textarea style={{ ...inputStyle, minHeight: '60px', resize: 'vertical', direction: 'rtl' }} value={form.bioAr || ''} onChange={e => setForm(f => ({ ...f, bioAr: e.target.value }))} placeholder="نبذة مختصرة..." /></div>
              
//               <div>
//                 <label style={labelStyle}>Skills</label>
//                 <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
//                   <input style={inputStyle} value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && skillInput.trim()) { setForm(f => ({ ...f, skills: [...(f.skills || []), skillInput.trim()] })); setSkillInput(''); e.preventDefault(); } }} placeholder="React, TypeScript..." />
//                   <button type="button" onClick={() => { if (skillInput.trim()) { setForm(f => ({ ...f, skills: [...(f.skills || []), skillInput.trim()] })); setSkillInput(''); } }} style={{ padding: '10px 14px', background: 'var(--teal)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: 'white' }}><Plus size={16} /></button>
//                 </div>
//                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
//                   {(form.skills || []).map(s => (
//                     <span key={s} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '6px', fontSize: '12px', color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace" }}>
//                       {s}
//                       <button type="button" onClick={() => setForm(f => ({ ...f, skills: (f.skills || []).filter(x => x !== s) }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', padding: 0 }}><X size={12} /></button>
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               <div><label style={labelStyle}>LinkedIn URL</label><input style={inputStyle} value={form.linkedin || ''} onChange={e => setForm(f => ({ ...f, linkedin: e.target.value }))} placeholder="https://linkedin.com/in/..." /></div>
//               <div><label style={labelStyle}>GitHub URL</label><input style={inputStyle} value={form.github || ''} onChange={e => setForm(f => ({ ...f, github: e.target.value }))} placeholder="https://github.com/..." /></div>
//             </div>
            
//             <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
//               <button type="button" onClick={close} style={{ padding: '10px 20px', background: 'none', border: '1px solid var(--border-subtle)', borderRadius: '10px', cursor: 'pointer', color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif", fontSize: '14px' }}>Cancel</button>
//               <button type="button" onClick={save} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 24px', background: 'var(--teal)', border: 'none', borderRadius: '10px', cursor: 'pointer', color: 'white', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '600' }}>
//                 <Check size={16} /> Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
