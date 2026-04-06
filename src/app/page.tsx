'use client';

import { useData } from '@/context/DataContext';
import { FolderKanban, Users, MessageSquareQuote, Mail, TrendingUp } from 'lucide-react';
import Link from 'next/link';

function StatCard({ label, value, icon: Icon, color, href }: {
  label: string; value: number; icon: React.ElementType; color: string; href: string;
}) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '24px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = `${color}40`;
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        }}
      >
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '2px', background: `linear-gradient(90deg, ${color}, transparent)`,
        }} />
        <div style={{
          width: '44px', height: '44px',
          background: `${color}15`,
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '16px',
        }}>
          <Icon size={20} color={color} />
        </div>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '36px',
          fontWeight: '800',
          color,
          marginBottom: '4px',
        }}>{value}</div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '14px',
          color: 'var(--text-muted)',
        }}>{label}</div>
      </div>
    </Link>
  );
}

export default function AdminDashboard() {
  const { projects, team, testimonials, contacts } = useData();
  const unread = contacts.filter(c => !c.read).length;

  return (
    <div>
      <h1 style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: '28px', fontWeight: '800',
        color: 'var(--text-primary)',
        marginBottom: '8px',
      }}>
        Dashboard
      </h1>
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '15px', color: 'var(--text-secondary)',
        marginBottom: '32px',
      }}>
        Master control for everything on the EgyBits website.
      </p>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '40px',
      }}>
        <StatCard label="Projects" value={projects.length} icon={FolderKanban} color="#00cfbf" href="/projects" />
        <StatCard label="Team Members" value={team.length} icon={Users} color="#a78bfa" href="/team" />
        <StatCard label="Testimonials" value={testimonials.length} icon={MessageSquareQuote} color="#fb923c" href="/testimonials" />
        <StatCard label={`Messages${unread ? ` (${unread} new)` : ''}`} value={contacts.length} icon={Mail} color="#60a5fa" href="/contacts" />
      </div>

      {/* Recent contacts */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '24px',
      }}>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '18px', fontWeight: '700',
          color: 'var(--text-primary)',
          marginBottom: '20px',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <TrendingUp size={18} color="var(--teal)" /> Recent Messages
        </h2>
        {contacts.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif", fontSize: '14px' }}>
            No messages yet.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {contacts.slice(0, 5).map(c => (
              <div key={c.id} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px',
                background: c.read ? 'transparent' : 'rgba(0,207,191,0.05)',
                borderRadius: '10px',
                border: `1px solid ${c.read ? 'transparent' : 'rgba(0,207,191,0.15)'}`,
              }}>
                <div style={{
                  width: '36px', height: '36px',
                  background: 'var(--border-subtle)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: '700',
                  fontSize: '14px',
                  color: 'var(--teal)',
                  flexShrink: 0,
                }}>
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '14px', fontWeight: '600',
                    color: 'var(--text-primary)',
                  }}>
                    {c.name}
                    {!c.read && (
                      <span style={{
                        marginLeft: '8px',
                        padding: '2px 8px',
                        background: 'rgba(0,207,191,0.15)',
                        borderRadius: '4px',
                        fontSize: '11px', color: 'var(--teal)',
                      }}>New</span>
                    )}
                  </div>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '13px', color: 'var(--text-muted)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {c.message}
                  </div>
                </div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '12px', color: 'var(--text-muted)',
                  flexShrink: 0,
                }}>
                  {c.date ? new Date(c.date).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
