'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, FolderKanban, Users, MessageSquareQuote,
  Mail, Settings, Palette, Menu, X, LogOut
} from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { useData } from '@/context/DataContext';

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Home' },
  { href: '/projects', icon: FolderKanban, label: 'Projects' },
  { href: '/team', icon: Users, label: 'Team' },
  { href: '/testimonials', icon: MessageSquareQuote, label: 'Testimonials' },
  { href: '/contacts', icon: Mail, label: 'Contacts' },
  { href: '/content', icon: Palette, label: 'Content' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export default function ClientLayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [checking, setChecking] = useState(true);
  const { token, logout } = useData();

  useEffect(() => {
    const t = localStorage.getItem('adminToken');

    if (pathname === '/login') {
       if (t || token) {
         router.push('/');
       } else {
         setChecking(false);
       }
       return;
    }

    if (!t && !token) {
      router.push('/login');
    } else {
      setChecking(false);
    }
  }, [pathname, token, router]);

  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (checking) return <div className="min-h-screen flex items-center justify-center text-white bg-[var(--bg-primary)]">Loading...</div>;

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
    }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '240px' : '64px',
        flexShrink: 0,
        background: 'var(--bg-card)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.16,1,0.3,1)',
        overflow: 'hidden',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 100,
      }}>
        {/* Sidebar header */}
        <div style={{
          padding: '16px 12px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}>
          {sidebarOpen && (
            <span style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '16px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #4dded4, #1e2e8a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              whiteSpace: 'nowrap',
            }}>
              EgyBits Admin
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '4px',
              borderRadius: '6px',
              display: 'flex',
              flexShrink: 0,
            }}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto'}}>
          {navItems.map(item => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <div
                  title={!sidebarOpen ? item.label : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    marginBottom: '4px',
                    background: isActive ? 'rgba(0,207,191,0.1)' : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(0,207,191,0.2)' : 'transparent'}`,
                    color: isActive ? 'var(--teal)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}
                >
                  <item.icon size={18} style={{ flexShrink: 0 }} />
                  {sidebarOpen && (
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '14px',
                      fontWeight: isActive ? '600' : '400',
                    }}>
                      {item.label}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div style={{
          padding: '12px 8px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          <div style={{ display: 'flex', justifyContent: sidebarOpen ? 'space-between' : 'center', alignItems: 'center' }}>
            {sidebarOpen && (
              <button onClick={logout} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none',
                background: 'none', border: 'none', cursor: 'pointer', outline: 'none'
              }}>
                <LogOut size={15} /> Logout
              </button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <div style={{
          padding: '16px 28px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-card)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px',
            color: 'var(--text-muted)',
          }}>
            {navItems.find(n => n.href === pathname || (n.href !== '/' && pathname.startsWith(n.href)))?.label ?? 'Dashboard'}
          </span>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, padding: '28px' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
