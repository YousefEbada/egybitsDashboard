'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import type { Project, TeamMember, Testimonial, ContactMessage, SiteSettings, Service } from '@/data/siteData';
import { defaultProjects, defaultTeam, defaultTestimonials, defaultSettings } from '@/data/siteData';

export type ContextProject = Project & { _id?: string };
export type ContextTeamMember = TeamMember & { _id?: string };
export type ContextTestimonial = Testimonial & { _id?: string };
export type ContextContactMessage = ContactMessage & { _id?: string };
export type ContextService = Service & { _id?: string };

export interface ContextAdmin {
  _id: string;
  username: string;
  role: string;
}

interface DataContextType {
  projects: ContextProject[];
  team: ContextTeamMember[];
  testimonials: ContextTestimonial[];
  services: ContextService[];
  contacts: ContextContactMessage[];
  settings: SiteSettings;

  token: string | null;
  role: string | null;
  login: (token: string, role?: string) => void;
  logout: () => void;
  
  admins: ContextAdmin[];
  fetchAdmins: () => Promise<void>;
  addAdmin: (a: Partial<ContextAdmin> & { password?: string }) => Promise<boolean>;
  updateAdmin: (id: string, a: Partial<ContextAdmin> & { password?: string }) => Promise<boolean>;
  deleteAdmin: (id: string) => Promise<void>;
  addProject: (p: FormData | Partial<Project>) => Promise<boolean>;
  updateProject: (id: string, p: FormData | Partial<Project>) => Promise<boolean>;
  deleteProject: (id: string) => Promise<void>;
  addTeamMember: (m: FormData | Partial<TeamMember>) => Promise<boolean>;
  updateTeamMember: (id: string, m: FormData | Partial<TeamMember>) => Promise<boolean>;
  deleteTeamMember: (id: string) => Promise<void>;
  addTestimonial: (t: FormData | Partial<Testimonial>) => Promise<boolean>;
  updateTestimonial: (id: string, t: FormData | Partial<Testimonial>) => Promise<boolean>;
  deleteTestimonial: (id: string) => Promise<void>;
  addService: (s: Partial<Service>) => Promise<boolean>;
  updateService: (id: string, s: Partial<Service>) => Promise<boolean>;
  deleteService: (id: string) => Promise<void>;
  addContact: (c: Partial<ContactMessage>) => Promise<boolean>;
  markContactRead: (id: string) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  updateSettings: (s: Partial<SiteSettings>) => Promise<void>;
  loading: boolean;
}


const API_URL = process.env.NEXT_PUBLIC_API_URL;

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [projects, setProjects] = useState<ContextProject[]>(defaultProjects as ContextProject[]);
  const [team, setTeam] = useState<ContextTeamMember[]>(defaultTeam as ContextTeamMember[]);
  const [testimonials, setTestimonials] = useState<ContextTestimonial[]>(defaultTestimonials as ContextTestimonial[]);
  const [services, setServices] = useState<ContextService[]>([]);
  const [contacts, setContacts] = useState<ContextContactMessage[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [admins, setAdmins] = useState<ContextAdmin[]>([]);
  const [loading, setLoading] = useState(true);



  // Initialize
  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    const storedRole = localStorage.getItem('adminRole');
    if (storedToken) setToken(storedToken);
    if (storedRole) setRole(storedRole);

    fetchData();
  }, [token]); // re-fetch if token changes so we can get protected data (like contacts)

  const fetchData = async () => {
    setLoading(true);
    try {
      const hdrs: any = {};
      if (token) hdrs['Authorization'] = `Bearer ${token}`;

      const [pRes, tRes, testRes, sRes, servRes] = await Promise.all([
        fetch(`${API_URL}/projects`),
        fetch(`${API_URL}/team`),
        fetch(`${API_URL}/testimonials`),
        fetch(`${API_URL}/settings`),
        fetch(`${API_URL}/services`)
      ]);

      if (pRes.ok) {
        const data = await pRes.json();
        if (data && data.length > 0) setProjects(data);
      }
      if (tRes.ok) {
        const data = await tRes.json();
        if (data && data.length > 0) setTeam(data);
      }
      if (testRes.ok) {
        const data = await testRes.json();
        if (data && data.length > 0) setTestimonials(data);
      }
      if (sRes.ok) setSettings(await sRes.json());
      if (servRes.ok) setServices(await servRes.json());


      // Contacts are protected
      if (token) {
        const cRes = await fetch(`${API_URL}/contacts`, { headers: hdrs });
        if (cRes.ok) setContacts(await cRes.json());
      }
    } catch (e) {
      console.error('Failed to fetch initial data', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    if (!token || role !== 'manager') return;
    try {
      const res = await fetch(`${API_URL}/auth/users`, { headers: authHeaders() });
      if (res.ok) setAdmins(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const login = (newToken: string, newRole?: string) => {
    localStorage.setItem('adminToken', newToken);
    if (newRole) localStorage.setItem('adminRole', newRole);
    setToken(newToken);
    if (newRole) setRole(newRole);
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRole');
    setToken(null);
    setRole(null);
    router.push('/login');
  };

  const authHeaders = () => ({
    'Authorization': `Bearer ${token}`
  });

  // Projects
  const addProject = async (p: FormData | Partial<Project>) => {
    const isFD = p instanceof FormData;
    const res = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: isFD ? authHeaders() : { 'Content-Type': 'application/json', ...authHeaders() },
      body: isFD ? p : JSON.stringify(p)
    });
    if (res.ok) {
      const data = await res.json();
      setProjects(prev => [{ ...data, id: data._id }, ...prev]);
      return true;
    }
    return false;
  };

  const updateProject = async (id: string, p: FormData | Partial<Project>) => {
    const isFD = p instanceof FormData;
    const res = await fetch(`${API_URL}/projects/${id}`, {
      method: 'PUT',
      headers: isFD ? authHeaders() : { 'Content-Type': 'application/json', ...authHeaders() },
      body: isFD ? p : JSON.stringify(p)
    });
    if (res.ok) {
      const data = await res.json();
      setProjects(prev => prev.map(x => x._id === id || x.id === id ? { ...data, id: data._id } : x));
      return true;
    }
    return false;
  };

  const deleteProject = async (id: string) => {
    const res = await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (res.ok) setProjects(prev => prev.filter(x => x._id !== id && x.id !== id));
  };

  // Admins
  const addAdmin = async (a: Partial<ContextAdmin> & { password?: string }) => {
    const res = await fetch(`${API_URL}/auth/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(a)
    });
    if (res.ok) {
      const data = await res.json();
      setAdmins(prev => [...prev, data]);
      return true;
    }
    return false;
  };

  const updateAdmin = async (id: string, a: Partial<ContextAdmin> & { password?: string }) => {
    const res = await fetch(`${API_URL}/auth/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(a)
    });
    if (res.ok) {
      const data = await res.json();
      setAdmins(prev => prev.map(x => x._id === id ? data : x));
      return true;
    }
    return false;
  };

  const deleteAdmin = async (id: string) => {
    const res = await fetch(`${API_URL}/auth/users/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (res.ok) setAdmins(prev => prev.filter(x => x._id !== id));
  };

  // Team
  const addTeamMember = async (m: FormData | Partial<TeamMember>) => {
    const isFD = m instanceof FormData;
    const res = await fetch(`${API_URL}/team`, {
      method: 'POST',
      headers: isFD ? authHeaders() : { 'Content-Type': 'application/json', ...authHeaders() },
      body: isFD ? m : JSON.stringify(m)
    });
    if (res.ok) {
      const data = await res.json();
      setTeam(prev => [{ ...data, id: data._id }, ...prev]);
      return true;
    }
    return false;
  };

  const updateTeamMember = async (id: string, m: FormData | Partial<TeamMember>) => {
    const isFD = m instanceof FormData;
    const res = await fetch(`${API_URL}/team/${id}`, {
      method: 'PUT',
      headers: isFD ? authHeaders() : { 'Content-Type': 'application/json', ...authHeaders() },
      body: isFD ? m : JSON.stringify(m)
    });
    if (res.ok) {
      const data = await res.json();
      setTeam(prev => prev.map(x => x._id === id || x.id === id ? { ...data, id: data._id } : x));
      return true;
    }
    return false;
  };

  const deleteTeamMember = async (id: string) => {
    const res = await fetch(`${API_URL}/team/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (res.ok) setTeam(prev => prev.filter(x => x._id !== id && x.id !== id));
  };

  // Testimonials
  const addTestimonial = async (t: FormData | Partial<Testimonial>) => {
    const isFD = t instanceof FormData;
    const res = await fetch(`${API_URL}/testimonials`, {
      method: 'POST',
      headers: isFD ? authHeaders() : { 'Content-Type': 'application/json', ...authHeaders() },
      body: isFD ? t : JSON.stringify(t)
    });
    if (res.ok) {
      const data = await res.json();
      setTestimonials(prev => [{ ...data, id: data._id }, ...prev]);
      return true;
    }
    return false;
  };

  const updateTestimonial = async (id: string, t: FormData | Partial<Testimonial>) => {
    const isFD = t instanceof FormData;
    const res = await fetch(`${API_URL}/testimonials/${id}`, {
      method: 'PUT',
      headers: isFD ? authHeaders() : { 'Content-Type': 'application/json', ...authHeaders() },
      body: isFD ? t : JSON.stringify(t)
    });
    if (res.ok) {
      const data = await res.json();
      setTestimonials(prev => prev.map(x => x._id === id || x.id === id ? { ...data, id: data._id } : x));
      return true;
    }
    return false;
  };

  const deleteTestimonial = async (id: string) => {
    const res = await fetch(`${API_URL}/testimonials/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (res.ok) setTestimonials(prev => prev.filter(x => x._id !== id && x.id !== id));
  };

  // Services
  const addService = async (s: Partial<Service>) => {
    const res = await fetch(`${API_URL}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(s)
    });
    if (res.ok) {
      const data = await res.json();
      setServices(prev => [...prev, { ...data, id: data._id }]);
      return true;
    }
    return false;
  };

  const updateService = async (id: string, s: Partial<Service>) => {
    const res = await fetch(`${API_URL}/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(s)
    });
    if (res.ok) {
      const data = await res.json();
      setServices(prev => prev.map(x => x._id === id || x.id === id ? { ...data, id: data._id } : x));
      return true;
    }
    return false;
  };

  const deleteService = async (id: string) => {
    const res = await fetch(`${API_URL}/services/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (res.ok) setServices(prev => prev.filter(x => x._id !== id && x.id !== id));
  };


  // Contacts
  const addContact = async (c: Partial<ContactMessage>) => {
    const res = await fetch(`${API_URL}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...c, date: new Date().toISOString() })
    });
    if (res.ok) {
      const data = await res.json();
      setContacts(prev => [{ ...data, id: data._id }, ...prev]);
      return true;
    }
    return false;
  };

  const markContactRead = async (id: string) => {
    const res = await fetch(`${API_URL}/contacts/${id}`, { method: 'PUT', headers: authHeaders() });
    if (res.ok) {
      setContacts(prev => prev.map(x => x._id === id || x.id === id ? { ...x, read: true } : x));
    }
  };

  const deleteContact = async (id: string) => {
    const res = await fetch(`${API_URL}/contacts/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (res.ok) setContacts(prev => prev.filter(x => x._id !== id && x.id !== id));
  };

  // Settings
  const updateSettings = async (s: Partial<SiteSettings>) => {
    const res = await fetch(`${API_URL}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(s)
    });
    if (res.ok) {
      const data = await res.json();
      setSettings({...data});
    }
  };

  return (
    <DataContext.Provider value={{
      projects, team, testimonials, services, contacts, settings,
      token, role, login, logout, loading,
      admins, fetchAdmins, addAdmin, updateAdmin, deleteAdmin,
      addProject, updateProject, deleteProject,
      addTeamMember, updateTeamMember, deleteTeamMember,
      addTestimonial, updateTestimonial, deleteTestimonial,
      addService, updateService, deleteService,
      addContact, markContactRead, deleteContact,
      updateSettings,
    }}>
      {children}
    </DataContext.Provider>
  );

}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside DataProvider');
  return ctx;
}
