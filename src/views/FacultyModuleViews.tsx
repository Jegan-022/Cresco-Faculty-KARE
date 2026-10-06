import React, { useState } from 'react';
import {
  Search,
  Download,
  Plus,
  Save,
} from 'lucide-react';
import type { FacultyUser, FacultyViewType } from '../types';

interface FacultyModuleViewsProps {
  activeView: FacultyViewType;
  user: FacultyUser;
  onNavigate: (view: FacultyViewType) => void;
}

export const FacultyModuleViews: React.FC<FacultyModuleViewsProps> = ({
  activeView,
  user,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState('All');

  // Sample student cohort
  const students = [
    { regNo: '9921004128', name: 'Sai Varun K.', section: 'CSE-A', mastery: 94, level: 'Level 4 (Transport)', status: 'Active', submissions: 14 },
    { regNo: '9921004189', name: 'Ananya Rao M.', section: 'CSE-A', mastery: 88, level: 'Level 3 (Routing)', status: 'Active', submissions: 12 },
    { regNo: '9921004204', name: 'Vignesh R.', section: 'CSE-B', mastery: 96, level: 'Level 4 (Transport)', status: 'Active', submissions: 15 },
    { regNo: '9921004245', name: 'Sneha P.', section: 'CSE-B', mastery: 72, level: 'Level 2 (Subnetting)', status: 'Needs Review', submissions: 9 },
    { regNo: '9921004312', name: 'Gokul Krishna', section: 'CSE-C', mastery: 81, level: 'Level 3 (Routing)', status: 'Active', submissions: 11 },
    { regNo: '9921004356', name: 'Deepika S.', section: 'CSE-C', mastery: 91, level: 'Level 4 (Transport)', status: 'Active', submissions: 13 },
    { regNo: '9921004401', name: 'Rahul M.', section: 'CSE-D', mastery: 65, level: 'Level 2 (Subnetting)', status: 'Pending Lab', submissions: 7 },
  ];

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.regNo.includes(searchTerm);
    const matchesSection = selectedSection === 'All' || s.section === selectedSection;
    return matchesSearch && matchesSection;
  });

  if (activeView === 'Students') {
    return (
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 20px 60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Student Cohort Roster
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              452 Students enrolled in CS-4200 Computer Networks (KARE 2026-27).
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => alert('Exporting cohort telemetry CSV...')}
              className="btn-outline"
              style={{ fontSize: '12.5px' }}
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={() => alert('Add student dialog opened.')}
              className="btn-tactile-primary"
              style={{ fontSize: '12.5px' }}
            >
              <Plus size={14} />
              <span>Enroll Student</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="card-standard" style={{ padding: '16px 20px', marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by name or Reg No (e.g. 9921004128)..."
              className="input-base input-mono"
              style={{ paddingLeft: '34px', fontSize: '12.5px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontFamily: 'var(--font-headline)', fontWeight: 700, color: 'var(--text-secondary)' }}>Section:</span>
            {['All', 'CSE-A', 'CSE-B', 'CSE-C', 'CSE-D'].map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setSelectedSection(sec)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: selectedSection === sec ? '1px solid var(--primary)' : '1px solid var(--border)',
                  backgroundColor: selectedSection === sec ? 'var(--surface-container-high)' : 'transparent',
                  color: selectedSection === sec ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        {/* Student Table */}
        <div className="card-standard" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--surface-container-low)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>REG NO</th>
                  <th style={{ padding: '14px 18px', fontFamily: 'var(--font-headline)', fontWeight: 700, color: 'var(--text-primary)' }}>STUDENT NAME</th>
                  <th style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>SECTION</th>
                  <th style={{ padding: '14px 18px', fontFamily: 'var(--font-headline)', fontWeight: 700, color: 'var(--text-primary)' }}>MASTERY %</th>
                  <th style={{ padding: '14px 18px', fontFamily: 'var(--font-headline)', fontWeight: 700, color: 'var(--text-primary)' }}>ACTIVE LEVEL</th>
                  <th style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>STATUS</th>
                  <th style={{ padding: '14px 18px', fontFamily: 'var(--font-headline)', fontWeight: 700, color: 'var(--text-primary)' }}>LABS</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => (
                  <tr key={s.regNo} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background-color 150ms ease' }}>
                    <td style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)' }}>{s.regNo}</td>
                    <td style={{ padding: '14px 18px', fontFamily: 'var(--font-headline)', fontWeight: 700, color: 'var(--text-primary)' }}>{s.name}</td>
                    <td style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{s.section}</td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '60px', height: '6px', borderRadius: '9999px', backgroundColor: 'var(--surface-container)', overflow: 'hidden' }}>
                          <div style={{ width: `${s.mastery}%`, height: '100%', backgroundColor: s.mastery >= 90 ? 'var(--primary)' : s.mastery >= 75 ? 'var(--accent)' : 'var(--warning)' }} />
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '11.5px', color: 'var(--text-primary)' }}>{s.mastery}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px', fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>{s.level}</td>
                    <td style={{ padding: '14px 18px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '9999px',
                          backgroundColor: s.status === 'Active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: s.status === 'Active' ? 'var(--success)' : 'var(--warning)',
                          border: `1px solid ${s.status === 'Active' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                        }}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{s.submissions} submitted</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (activeView === 'Courses') {
    return (
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 20px 60px' }}>
        <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Course Architecture & Syllabi
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Course Code: CS-4200 (Computer Networks) • Department of Computer Science & Engineering
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {[
            { code: 'CS-4200-A', section: 'Section A (Morning)', students: 114, lead: user.name, room: 'Lab Complex 302', schedule: 'Mon, Wed 09:00 - 10:45 AM' },
            { code: 'CS-4200-B', section: 'Section B (Morning)', students: 112, lead: 'Dr. S. Sudha', room: 'Lab Complex 304', schedule: 'Tue, Thu 09:00 - 10:45 AM' },
            { code: 'CS-4200-C', section: 'Section C (Afternoon)', students: 115, lead: user.name, room: 'Lab Complex 302', schedule: 'Mon, Wed 01:30 - 03:15 PM' },
            { code: 'CS-4200-D', section: 'Section D (Afternoon)', students: 111, lead: 'Dr. M. Prakash', room: 'Network Lab 201', schedule: 'Tue, Thu 01:30 - 03:15 PM' },
          ].map((c) => (
            <div key={c.code} className="card-standard" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent)' }}>{c.code}</span>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{c.students} Students</span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {c.section}
                </h2>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Instructor: <strong>{c.lead}</strong>
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>📍 Location: {c.room}</div>
                  <div>🕒 Timing: {c.schedule}</div>
                </div>
              </div>

              <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => alert(`Opening roster for ${c.code}`)} className="btn-tactile-primary" style={{ flex: 1, fontSize: '12px', padding: '8px' }}>
                  View Roster
                </button>
                <button type="button" onClick={() => alert(`Opening curriculum sync for ${c.code}`)} className="btn-outline" style={{ fontSize: '12px', padding: '8px 12px' }}>
                  Syllabus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeView === 'Learning Levels') {
    return (
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 20px 60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Interactive Learning Levels
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Configure quest progression, simulator packet requirements, and unlock gates.
            </p>
          </div>
          <button type="button" onClick={() => alert('New level builder launched')} className="btn-tactile-purple" style={{ fontSize: '13px' }}>
            <Plus size={15} />
            <span>Create New Level</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { lvl: '01', title: 'Layer 1 & 2: Physical & Frame Encoding', badge: 'Active in Student Portal', desc: 'Manchester encoding, NRZ, CSMA/CD, MAC address headers.', passRate: '91% Pass Rate' },
            { lvl: '02', title: 'Layer 3A: IPv4 / IPv6 Subnetting & CIDR', badge: 'Active in Student Portal', desc: 'VLSM calculations, broadcast domains, subnet mask breakdown.', passRate: '86% Pass Rate' },
            { lvl: '03', title: 'Layer 3B: Interior Gateway Routing (OSPF & RIP)', badge: 'Active in Student Portal', desc: 'Dijkstra shortest path algorithm, packet forwarding, hop counts.', passRate: '71% Pass Rate' },
            { lvl: '04', title: 'Layer 4: TCP 3-Way Handshake & Sliding Window', badge: 'In Review', desc: 'SYN-ACK sequences, sequence number math, congestion control.', passRate: '48% Pass Rate' },
            { lvl: '05', title: 'Layer 7: DNS Resolution & Modern HTTP/3', badge: 'Drafting', desc: 'Recursive queries, TLS 1.3 handshakes, QUIC protocol stream multiplexing.', passRate: 'Draft' },
          ].map((l) => (
            <div key={l.lvl} className="card-standard" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 900, color: 'var(--primary)', width: '36px' }}>
                  {l.lvl}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {l.title}
                    </h2>
                    <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', backgroundColor: 'var(--surface-container)', color: 'var(--accent)' }}>
                      {l.badge}
                    </span>
                  </div>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {l.desc}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>
                  {l.passRate}
                </span>
                <button type="button" onClick={() => alert(`Configuring ${l.title}`)} className="btn-outline" style={{ fontSize: '12px', padding: '6px 14px' }}>
                  Edit Unit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeView === 'Analytics') {
    return (
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 20px 60px' }}>
        <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Curriculum Analytics & Telemetry
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Cohort learning trajectories across Kalasalingam Academy of Research and Education network curriculum.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div className="card-standard" style={{ padding: '24px' }}>
            <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px' }}>
              Layer-by-Layer Cohort Mastery
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { layer: 'Layer 1: Physical', score: 94, color: '#10b981' },
                { layer: 'Layer 2: Data Link', score: 88, color: '#10b981' },
                { layer: 'Layer 3: Network / IP', score: 76, color: '#06b6d4' },
                { layer: 'Layer 4: Transport (TCP)', score: 62, color: '#f59e0b' },
                { layer: 'Layer 7: Application', score: 54, color: '#8b5cf6' },
              ].map((row) => (
                <div key={row.layer}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-primary)' }}>{row.layer}</span>
                    <span style={{ fontWeight: 700, color: row.color }}>{row.score}%</span>
                  </div>
                  <div style={{ height: '8px', borderRadius: '9999px', backgroundColor: 'var(--surface-container)', overflow: 'hidden' }}>
                    <div style={{ width: `${row.score}%`, height: '100%', backgroundColor: row.color, borderRadius: '9999px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-standard" style={{ padding: '24px' }}>
            <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px' }}>
              Common Conceptual Bottlenecks
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { topic: 'Subnet Mask Borrowing bits in CIDR /27 vs /28', failed: '38% Incorrect on first trial' },
                { topic: 'TCP Windowing Acknowledgement Calculation', failed: '42% Incorrect on first trial' },
                { topic: 'ARP Cache Poisoning packet inspection', failed: '29% Incorrect on first trial' },
                { topic: 'Split Horizon rule in distance vector', failed: '31% Incorrect on first trial' },
              ].map((b, i) => (
                <div key={i} style={{ padding: '10px 12px', borderRadius: '10px', backgroundColor: 'var(--surface-container-low)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '12.5px', fontFamily: 'var(--font-headline)', fontWeight: 700, color: 'var(--text-primary)' }}>{b.topic}</div>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--warning)', marginTop: '2px' }}>⚠️ {b.failed}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Settings
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px 60px' }}>
      <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
        Faculty Account & Portal Preferences
      </h1>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
        Institutional configuration for Kalasalingam Academy of Research and Education faculty credentials.
      </p>

      <div className="card-standard" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Instructor Full Name</label>
          <input type="text" defaultValue={user.name} className="input-base" />
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Institutional Email</label>
          <input type="email" defaultValue={user.email} className="input-base input-mono" disabled style={{ opacity: 0.7 }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Staff ID / Employee Code</label>
            <input type="text" defaultValue={user.staffId} className="input-base input-mono" disabled style={{ opacity: 0.7 }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Academic Designation</label>
            <input type="text" defaultValue={user.designation} className="input-base" />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>Department</label>
          <input type="text" defaultValue={user.department} className="input-base" />
        </div>

        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" onClick={() => alert('Faculty profile updated successfully.')} className="btn-tactile-primary">
            <Save size={15} />
            <span>Save Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
