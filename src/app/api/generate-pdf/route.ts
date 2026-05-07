import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import type { ResumeData } from '@/lib/types';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function generateClassicHTML(data: ResumeData): string {
  const { personalInfo, education, skills, experience, projects, certifications, achievements } = data;
  const skillGroups = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4; margin: 12mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; color: #1a1a1a; font-size: 9.5pt; line-height: 1.5; }
  .page { width: 100%; }
  .header { border-bottom: 3px double #333; padding-bottom: 12px; margin-bottom: 16px; }
  .name { font-size: 22pt; font-weight: bold; color: #000; letter-spacing: 1px; }
  .title { font-size: 11pt; color: #555; margin-top: 2px; font-style: italic; }
  .contact { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 6px; font-size: 8.5pt; color: #666; }
  .contact span { white-space: nowrap; }
  .two-col { display: flex; gap: 20px; }
  .sidebar { width: 35%; }
  .main { width: 65%; }
  .section-title { font-size: 10pt; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1.5px solid #333; padding-bottom: 4px; margin-bottom: 10px; color: #000; }
  .sidebar .section-title { font-size: 9pt; }
  .entry { margin-bottom: 12px; }
  .entry-title { font-weight: bold; font-size: 9.5pt; }
  .entry-subtitle { font-size: 8.5pt; color: #555; }
  .entry-date { font-size: 8pt; color: #888; font-style: italic; }
  .entry-desc { font-size: 8.5pt; color: #444; margin-top: 3px; }
  .skill-item { margin-bottom: 3px; font-size: 8.5pt; }
  .skill-level { color: #888; font-size: 8pt; }
  ul.bullets { padding-left: 14px; }
  ul.bullets li { font-size: 8.5pt; color: #444; margin-bottom: 2px; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="name">${escapeHtml(personalInfo.fullName || 'Your Name')}</div>
    <div class="title">${escapeHtml(personalInfo.jobTitle || 'Professional Title')}</div>
    <div class="contact">
      ${personalInfo.email ? `<span>${escapeHtml(personalInfo.email)}</span>` : ''}
      ${personalInfo.phone ? `<span>${escapeHtml(personalInfo.phone)}</span>` : ''}
      ${personalInfo.location ? `<span>${escapeHtml(personalInfo.location)}</span>` : ''}
      ${personalInfo.website ? `<span>${escapeHtml(personalInfo.website)}</span>` : ''}
      ${personalInfo.linkedin ? `<span>${escapeHtml(personalInfo.linkedin)}</span>` : ''}
      ${personalInfo.github ? `<span>${escapeHtml(personalInfo.github)}</span>` : ''}
    </div>
  </div>

  <div class="two-col">
    <div class="sidebar">
      ${personalInfo.summary ? `<div style="margin-bottom:16px;">
        <div class="section-title">Summary</div>
        <p style="font-size:8.5pt;color:#444;">${escapeHtml(personalInfo.summary)}</p>
      </div>` : ''}

      ${Object.keys(skillGroups).length > 0 ? `<div style="margin-bottom:16px;">
        <div class="section-title">Skills</div>
        ${Object.entries(skillGroups).map(([cat, sk]) => `
          <div style="margin-bottom:8px;">
            <div style="font-weight:bold;font-size:8.5pt;color:#333;margin-bottom:3px;">${escapeHtml(cat)}</div>
            ${sk.map(s => `<div class="skill-item">${escapeHtml(s.name)} <span class="skill-level">(${s.level})</span></div>`).join('')}
          </div>
        `).join('')}
      </div>` : ''}

      ${certifications.length > 0 ? `<div style="margin-bottom:16px;">
        <div class="section-title">Certifications</div>
        ${certifications.map(c => `<div class="entry">
          <div class="entry-title">${escapeHtml(c.name)}</div>
          <div class="entry-subtitle">${escapeHtml(c.issuer)}</div>
          <div class="entry-date">${formatDate(c.date)}${c.credentialId ? ` | ID: ${escapeHtml(c.credentialId)}` : ''}</div>
        </div>`).join('')}
      </div>` : ''}

      ${achievements.length > 0 ? `<div style="margin-bottom:16px;">
        <div class="section-title">Achievements</div>
        ${achievements.map(a => `<div class="entry">
          <div class="entry-title">${escapeHtml(a.title)}</div>
          <div class="entry-date">${formatDate(a.date)}${a.category ? ` | ${escapeHtml(a.category)}` : ''}</div>
          ${a.description ? `<div class="entry-desc">${escapeHtml(a.description)}</div>` : ''}
        </div>`).join('')}
      </div>` : ''}
    </div>

    <div class="main">
      ${experience.length > 0 ? `<div style="margin-bottom:16px;">
        <div class="section-title">Experience</div>
        ${experience.map(e => `<div class="entry">
          <div class="entry-title">${escapeHtml(e.position)}</div>
          <div class="entry-subtitle">${escapeHtml(e.company)}${e.location ? `, ${escapeHtml(e.location)}` : ''}</div>
          <div class="entry-date">${formatDate(e.startDate)} - ${e.current ? 'Present' : formatDate(e.endDate)}</div>
          ${e.description ? `<div class="entry-desc">${escapeHtml(e.description)}</div>` : ''}
        </div>`).join('')}
      </div>` : ''}

      ${education.length > 0 ? `<div style="margin-bottom:16px;">
        <div class="section-title">Education</div>
        ${education.map(ed => `<div class="entry">
          <div class="entry-title">${escapeHtml(ed.degree)}</div>
          <div class="entry-subtitle">${escapeHtml(ed.institution)}${ed.location ? `, ${escapeHtml(ed.location)}` : ''}</div>
          <div class="entry-date">${formatDate(ed.startDate)} - ${formatDate(ed.endDate)}${ed.gpa ? ` | GPA: ${escapeHtml(ed.gpa)}` : ''}</div>
          ${ed.description ? `<div class="entry-desc">${escapeHtml(ed.description)}</div>` : ''}
        </div>`).join('')}
      </div>` : ''}

      ${projects.length > 0 ? `<div style="margin-bottom:16px;">
        <div class="section-title">Projects</div>
        ${projects.map(p => `<div class="entry">
          <div class="entry-title">${escapeHtml(p.name)}</div>
          <div class="entry-date">${formatDate(p.startDate)}${p.endDate ? ` - ${formatDate(p.endDate)}` : ''}${p.link ? ` | ${escapeHtml(p.link)}` : ''}</div>
          ${p.description ? `<div class="entry-desc">${escapeHtml(p.description)}</div>` : ''}
          ${p.technologies ? `<div style="font-size:8pt;color:#888;margin-top:2px;">Technologies: ${escapeHtml(p.technologies)}</div>` : ''}
        </div>`).join('')}
      </div>` : ''}
    </div>
  </div>
</div>
</body>
</html>`;
}

function generateModernHTML(data: ResumeData): string {
  const { personalInfo, education, skills, experience, projects, certifications, achievements } = data;
  const skillGroups = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4; margin: 12mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #1f2937; font-size: 9.5pt; line-height: 1.55; }
  .page { width: 100%; }
  .header { margin-bottom: 20px; }
  .name { font-size: 24pt; font-weight: 700; color: #064e3b; letter-spacing: -0.5px; }
  .title { font-size: 11pt; color: #059669; margin-top: 2px; font-weight: 500; }
  .contact { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 8px; font-size: 8.5pt; color: #6b7280; }
  .summary { color: #374151; font-size: 9pt; margin-bottom: 18px; padding: 10px 0; border-top: 2px solid #059669; }
  .section { margin-bottom: 18px; }
  .section-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
  .section-icon { width: 4px; height: 18px; background: linear-gradient(to bottom, #059669, #0d9488); border-radius: 2px; }
  .section-title { font-size: 10.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #064e3b; }
  .entry { margin-bottom: 12px; padding-left: 12px; border-left: 2px solid #d1fae5; }
  .entry-header { display: flex; justify-content: space-between; align-items: baseline; }
  .entry-title { font-weight: 600; font-size: 9.5pt; color: #111827; }
  .entry-date { font-size: 8pt; color: #059669; font-weight: 500; white-space: nowrap; }
  .entry-subtitle { font-size: 8.5pt; color: #6b7280; margin-top: 1px; }
  .entry-desc { font-size: 8.5pt; color: #4b5563; margin-top: 3px; }
  .skill-group { margin-bottom: 8px; }
  .skill-group-title { font-weight: 600; font-size: 8.5pt; color: #374151; margin-bottom: 4px; }
  .skills-row { display: flex; flex-wrap: wrap; gap: 4px; }
  .skill-badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 7.5pt; font-weight: 500; }
  .skill-beginner { background: #ecfdf5; color: #065f46; }
  .skill-intermediate { background: #d1fae5; color: #065f46; }
  .skill-advanced { background: #a7f3d0; color: #064e3b; }
  .skill-expert { background: #059669; color: #fff; }
  .project-card { margin-bottom: 10px; padding: 8px 10px; background: #f0fdf4; border-radius: 6px; border-left: 3px solid #059669; }
  .cert-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .cert-item { padding: 6px 8px; border: 1px solid #d1fae5; border-radius: 6px; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="name">${escapeHtml(personalInfo.fullName || 'Your Name')}</div>
    <div class="title">${escapeHtml(personalInfo.jobTitle || 'Professional Title')}</div>
    <div class="contact">
      ${personalInfo.email ? `<span>${escapeHtml(personalInfo.email)}</span>` : ''}
      ${personalInfo.phone ? `<span>${escapeHtml(personalInfo.phone)}</span>` : ''}
      ${personalInfo.location ? `<span>${escapeHtml(personalInfo.location)}</span>` : ''}
      ${personalInfo.website ? `<span>${escapeHtml(personalInfo.website)}</span>` : ''}
      ${personalInfo.linkedin ? `<span>${escapeHtml(personalInfo.linkedin)}</span>` : ''}
      ${personalInfo.github ? `<span>${escapeHtml(personalInfo.github)}</span>` : ''}
    </div>
  </div>

  ${personalInfo.summary ? `<div class="summary">${escapeHtml(personalInfo.summary)}</div>` : ''}

  ${experience.length > 0 ? `<div class="section">
    <div class="section-header"><div class="section-icon"></div><div class="section-title">Experience</div></div>
    ${experience.map(e => `<div class="entry">
      <div class="entry-header"><div class="entry-title">${escapeHtml(e.position)} at ${escapeHtml(e.company)}</div><div class="entry-date">${formatDate(e.startDate)} - ${e.current ? 'Present' : formatDate(e.endDate)}</div></div>
      ${e.location ? `<div class="entry-subtitle">${escapeHtml(e.location)}</div>` : ''}
      ${e.description ? `<div class="entry-desc">${escapeHtml(e.description)}</div>` : ''}
    </div>`).join('')}
  </div>` : ''}

  ${education.length > 0 ? `<div class="section">
    <div class="section-header"><div class="section-icon"></div><div class="section-title">Education</div></div>
    ${education.map(ed => `<div class="entry">
      <div class="entry-header"><div class="entry-title">${escapeHtml(ed.degree)}</div><div class="entry-date">${formatDate(ed.startDate)} - ${formatDate(ed.endDate)}</div></div>
      <div class="entry-subtitle">${escapeHtml(ed.institution)}${ed.location ? `, ${escapeHtml(ed.location)}` : ''}${ed.gpa ? ` | GPA: ${escapeHtml(ed.gpa)}` : ''}</div>
      ${ed.description ? `<div class="entry-desc">${escapeHtml(ed.description)}</div>` : ''}
    </div>`).join('')}
  </div>` : ''}

  ${Object.keys(skillGroups).length > 0 ? `<div class="section">
    <div class="section-header"><div class="section-icon"></div><div class="section-title">Skills</div></div>
    ${Object.entries(skillGroups).map(([cat, sk]) => `<div class="skill-group">
      <div class="skill-group-title">${escapeHtml(cat)}</div>
      <div class="skills-row">${sk.map(s => `<span class="skill-badge skill-${s.level}">${escapeHtml(s.name)}</span>`).join('')}</div>
    </div>`).join('')}
  </div>` : ''}

  ${projects.length > 0 ? `<div class="section">
    <div class="section-header"><div class="section-icon"></div><div class="section-title">Projects</div></div>
    ${projects.map(p => `<div class="project-card">
      <div style="font-weight:600;font-size:9.5pt;color:#064e3b;">${escapeHtml(p.name)}</div>
      ${p.description ? `<div class="entry-desc">${escapeHtml(p.description)}</div>` : ''}
      ${p.technologies ? `<div class="skills-row" style="margin-top:4px;">${p.technologies.split(',').map(t => `<span class="skill-badge skill-intermediate">${escapeHtml(t.trim())}</span>`).join('')}</div>` : ''}
    </div>`).join('')}
  </div>` : ''}

  ${certifications.length > 0 ? `<div class="section">
    <div class="section-header"><div class="section-icon"></div><div class="section-title">Certifications</div></div>
    <div class="cert-grid">
      ${certifications.map(c => `<div class="cert-item">
        <div style="font-weight:600;font-size:8.5pt;">${escapeHtml(c.name)}</div>
        <div class="entry-subtitle">${escapeHtml(c.issuer)} | ${formatDate(c.date)}</div>
      </div>`).join('')}
    </div>
  </div>` : ''}

  ${achievements.length > 0 ? `<div class="section">
    <div class="section-header"><div class="section-icon"></div><div class="section-title">Achievements</div></div>
    ${achievements.map(a => `<div class="entry">
      <div class="entry-title">${escapeHtml(a.title)} <span class="entry-date">${formatDate(a.date)}</span></div>
      ${a.description ? `<div class="entry-desc">${escapeHtml(a.description)}</div>` : ''}
    </div>`).join('')}
  </div>` : ''}
</div>
</body>
</html>`;
}

function generateCreativeHTML(data: ResumeData): string {
  const { personalInfo, education, skills, experience, projects, certifications, achievements } = data;
  const skillGroups = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #e2e8f0; font-size: 9pt; line-height: 1.5; background: #0f172a; }
  .page { width: 100%; }
  .header { background: linear-gradient(135deg, #0f172a 0%, #064e3b 50%, #0d9488 100%); padding: 28px 24px 20px; position: relative; overflow: hidden; }
  .header::before { content: ''; position: absolute; top: -30px; right: -30px; width: 120px; height: 120px; border-radius: 50%; background: rgba(16, 185, 129, 0.15); }
  .header::after { content: ''; position: absolute; bottom: -20px; right: 60px; width: 80px; height: 80px; border-radius: 50%; background: rgba(13, 148, 136, 0.1); }
  .name { font-size: 26pt; font-weight: 800; color: #ffffff; letter-spacing: -1px; position: relative; z-index: 1; }
  .title { font-size: 11pt; color: #5eead4; margin-top: 3px; font-weight: 500; position: relative; z-index: 1; }
  .contact { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; font-size: 8pt; color: #94a3b8; position: relative; z-index: 1; }
  .contact-chip { background: rgba(255,255,255,0.08); padding: 3px 10px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); }
  .body { display: flex; padding: 20px 24px; gap: 20px; }
  .main { width: 62%; }
  .sidebar { width: 38%; }
  .section { margin-bottom: 18px; }
  .section-title { font-size: 10pt; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #5eead4; margin-bottom: 10px; padding-bottom: 4px; border-bottom: 2px solid rgba(16, 185, 129, 0.3); }
  .entry { margin-bottom: 12px; }
  .card { background: rgba(30, 41, 59, 0.7); border-radius: 8px; padding: 10px 12px; border: 1px solid rgba(255,255,255,0.05); }
  .entry-title { font-weight: 600; font-size: 9.5pt; color: #f1f5f9; }
  .entry-subtitle { font-size: 8pt; color: #5eead4; margin-top: 1px; }
  .entry-date { font-size: 7.5pt; color: #64748b; display: inline-block; padding: 1px 8px; background: rgba(16, 185, 129, 0.1); border-radius: 10px; margin-top: 4px; }
  .entry-desc { font-size: 8.5pt; color: #94a3b8; margin-top: 4px; }
  .skill-item { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .skill-name { font-size: 8.5pt; color: #cbd5e1; width: 80px; flex-shrink: 0; }
  .skill-bar { flex: 1; height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden; }
  .skill-fill { height: 100%; border-radius: 3px; }
  .fill-beginner { width: 25%; background: #fbbf24; }
  .fill-intermediate { width: 50%; background: #38bdf8; }
  .fill-advanced { width: 75%; background: #a78bfa; }
  .fill-expert { width: 100%; background: #f472b6; }
  .skill-group-title { font-size: 8pt; color: #5eead4; font-weight: 600; margin-bottom: 6px; margin-top: 10px; }
  .dark-card { background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 8px 10px; margin-bottom: 8px; }
  .achievement-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: linear-gradient(135deg, #10b981, #06b6d4); margin-right: 6px; }
  .summary-text { font-size: 8.5pt; color: #94a3b8; padding: 8px 0; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="name">${escapeHtml(personalInfo.fullName || 'Your Name')}</div>
    <div class="title">${escapeHtml(personalInfo.jobTitle || 'Professional Title')}</div>
    <div class="contact">
      ${personalInfo.email ? `<span class="contact-chip">${escapeHtml(personalInfo.email)}</span>` : ''}
      ${personalInfo.phone ? `<span class="contact-chip">${escapeHtml(personalInfo.phone)}</span>` : ''}
      ${personalInfo.location ? `<span class="contact-chip">${escapeHtml(personalInfo.location)}</span>` : ''}
      ${personalInfo.website ? `<span class="contact-chip">${escapeHtml(personalInfo.website)}</span>` : ''}
      ${personalInfo.linkedin ? `<span class="contact-chip">${escapeHtml(personalInfo.linkedin)}</span>` : ''}
      ${personalInfo.github ? `<span class="contact-chip">${escapeHtml(personalInfo.github)}</span>` : ''}
    </div>
  </div>

  <div class="body">
    <div class="main">
      ${personalInfo.summary ? `<div class="summary-text">${escapeHtml(personalInfo.summary)}</div>` : ''}

      ${experience.length > 0 ? `<div class="section">
        <div class="section-title">Experience</div>
        ${experience.map(e => `<div class="entry">
          <div class="card">
            <div class="entry-title">${escapeHtml(e.position)}</div>
            <div class="entry-subtitle">${escapeHtml(e.company)}${e.location ? ` | ${escapeHtml(e.location)}` : ''}</div>
            <div class="entry-date">${formatDate(e.startDate)} - ${e.current ? 'Present' : formatDate(e.endDate)}</div>
            ${e.description ? `<div class="entry-desc">${escapeHtml(e.description)}</div>` : ''}
          </div>
        </div>`).join('')}
      </div>` : ''}

      ${education.length > 0 ? `<div class="section">
        <div class="section-title">Education</div>
        ${education.map(ed => `<div class="entry">
          <div class="card">
            <div class="entry-title">${escapeHtml(ed.degree)}</div>
            <div class="entry-subtitle">${escapeHtml(ed.institution)}${ed.location ? `, ${escapeHtml(ed.location)}` : ''}</div>
            <div class="entry-date">${formatDate(ed.startDate)} - ${formatDate(ed.endDate)}${ed.gpa ? ` | GPA: ${escapeHtml(ed.gpa)}` : ''}</div>
          </div>
        </div>`).join('')}
      </div>` : ''}

      ${projects.length > 0 ? `<div class="section">
        <div class="section-title">Projects</div>
        ${projects.map(p => `<div class="entry">
          <div class="card">
            <div class="entry-title">${escapeHtml(p.name)}</div>
            ${p.description ? `<div class="entry-desc">${escapeHtml(p.description)}</div>` : ''}
            ${p.technologies ? `<div class="entry-desc" style="color:#5eead4;">${escapeHtml(p.technologies)}</div>` : ''}
          </div>
        </div>`).join('')}
      </div>` : ''}
    </div>

    <div class="sidebar">
      ${Object.keys(skillGroups).length > 0 ? `<div class="section">
        <div class="section-title">Skills</div>
        ${Object.entries(skillGroups).map(([cat, sk]) => `<div class="skill-group-title">${escapeHtml(cat)}</div>
          ${sk.map(s => `<div class="skill-item">
            <span class="skill-name">${escapeHtml(s.name)}</span>
            <div class="skill-bar"><div class="skill-fill fill-${s.level}"></div></div>
          </div>`).join('')}`).join('')}
      </div>` : ''}

      ${certifications.length > 0 ? `<div class="section">
        <div class="section-title">Certifications</div>
        ${certifications.map(c => `<div class="dark-card">
          <div class="entry-title">${escapeHtml(c.name)}</div>
          <div class="entry-subtitle">${escapeHtml(c.issuer)}</div>
          <div class="entry-date">${formatDate(c.date)}</div>
        </div>`).join('')}
      </div>` : ''}

      ${achievements.length > 0 ? `<div class="section">
        <div class="section-title">Achievements</div>
        ${achievements.map(a => `<div class="dark-card">
          <div><span class="achievement-dot"></span><span style="font-weight:600;font-size:8.5pt;">${escapeHtml(a.title)}</span></div>
          ${a.description ? `<div class="entry-desc" style="margin-top:2px;">${escapeHtml(a.description)}</div>` : ''}
          <div class="entry-date">${formatDate(a.date)}</div>
        </div>`).join('')}
      </div>` : ''}
    </div>
  </div>
</div>
</body>
</html>`;
}

function generateInfographicHTML(data: ResumeData): string {
  const { personalInfo, education, skills, experience, projects, certifications, achievements } = data;

  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  function getInitials(name: string): string {
    return name.split(' ').map((p) => p.charAt(0)).join('').toUpperCase().slice(0, 2);
  }

  function computeYearsOfExperience(): number {
    let totalYears = 0;
    for (const exp of experience) {
      const start = exp.startDate ? new Date(exp.startDate) : null;
      const end = exp.current ? new Date() : exp.endDate ? new Date(exp.endDate) : null;
      if (start && end && !isNaN(start.getTime()) && !isNaN(end.getTime())) {
        totalYears += Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
      }
    }
    return Math.round(totalYears);
  }

  const yearsOfExp = computeYearsOfExperience();
  const projectCount = projects.length;
  const skillCount = skills.length;
  const certCount = certifications.length;

  const levelWidth: Record<string, string> = {
    beginner: '25%', intermediate: '50%', advanced: '75%', expert: '100%',
  };

  const techColors = [
    'background:#f0fdfa;color:#0f766e;border:1px solid #99f6e4;',
    'background:#ecfeff;color:#0e7490;border:1px solid #a5f3fc;',
    'background:#ecfdf5;color:#047857;border:1px solid #a7f3d0;',
    'background:#f0f9ff;color:#0369a1;border:1px solid #bae6fd;',
    'background:#fffbeb;color:#b45309;border:1px solid #fde68a;',
    'background:#fff1f2;color:#be123c;border:1px solid #fecdd3;',
    'background:#f5f3ff;color:#7c3aed;border:1px solid #ddd6fe;',
    'background:#fff7ed;color:#c2410c;border:1px solid #fed7aa;',
  ];

  function getTechColor(index: number): string {
    return techColors[index % techColors.length];
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4; margin: 12mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #1f2937; font-size: 9pt; line-height: 1.5; }
  .page { display: flex; width: 100%; min-height: 100vh; overflow: hidden; }
  .sidebar { width: 35%; flex-shrink: 0; background: linear-gradient(to bottom, #0d9488, #14b8a6); color: #fff; padding: 20px 16px; position: relative; }
  .sidebar::before { content: ''; position: absolute; top: 0; left: 0; width: 100px; height: 100px; border-radius: 50%; background: rgba(255,255,255,0.05); transform: translate(-50%, -50%); }
  .sidebar::after { content: ''; position: absolute; bottom: 48px; right: 0; width: 72px; height: 72px; border-radius: 50%; background: rgba(255,255,255,0.05); transform: translateX(33%); }
  .avatar { width: 72px; height: 72px; border-radius: 50%; background: rgba(255,255,255,0.2); border: 2px solid rgba(255,255,255,0.4); display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; }
  .avatar-text { font-size: 22px; font-weight: 700; color: #fff; }
  .sidebar-name { text-align: center; font-size: 15px; font-weight: 800; letter-spacing: -0.3px; line-height: 1.2; }
  .sidebar-title { text-align: center; font-size: 10px; color: rgba(255,255,255,0.8); margin-top: 2px; }
  .sidebar-divider { width: 100%; height: 1px; background: rgba(255,255,255,0.2); margin: 14px 0; }
  .sidebar-section-title { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 3px; color: rgba(255,255,255,0.6); margin-bottom: 10px; }
  .contact-row { margin-bottom: 8px; }
  .contact-label { font-size: 7.5px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.4); font-weight: 600; }
  .contact-value { font-size: 9.5px; color: #fff; word-break: break-all; }
  .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 14px; }
  .stat-card { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 6px 10px; text-align: center; }
  .stat-value { font-size: 18px; font-weight: 800; color: #fff; line-height: 1; }
  .stat-label { font-size: 7.5px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.5); font-weight: 600; margin-top: 2px; }
  .skill-category-title { font-size: 8px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.5); margin-bottom: 6px; margin-top: 10px; }
  .skill-row { margin-bottom: 6px; }
  .skill-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; }
  .skill-name { font-size: 9.5px; color: #fff; font-weight: 500; }
  .skill-level { font-size: 7.5px; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.5); }
  .skill-bar-track { height: 6px; background: rgba(255,255,255,0.15); border-radius: 3px; overflow: hidden; }
  .skill-bar-fill { height: 100%; border-radius: 3px; background: rgba(255,255,255,0.9); }
  .main { width: 65%; flex-shrink: 0; padding: 20px; overflow: hidden; }
  .main-section { margin-bottom: 16px; }
  .main-section-title { display: flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #111827; margin-bottom: 8px; padding-bottom: 5px; border-bottom: 2px solid #0d9488; }
  .main-section-dot { width: 7px; height: 7px; border-radius: 50%; background: #0d9488; flex-shrink: 0; }
  .profile-text { font-size: 9.5px; color: #4b5563; line-height: 1.6; }
  .timeline { position: relative; margin-left: 6px; }
  .timeline-line { position: absolute; left: 6px; top: 6px; bottom: 6px; width: 2px; background: #99f6e4; border-radius: 1px; }
  .timeline-item { position: relative; padding-left: 22px; margin-bottom: 12px; }
  .timeline-dot { position: absolute; left: 0; top: 5px; width: 13px; height: 13px; border-radius: 50%; border: 3px solid #14b8a6; background: #f0fdfa; z-index: 1; }
  .timeline-dot-current { border-color: #0d9488; background: #ccfbf1; }
  .content-card { background: #f9fafb; border-radius: 10px; padding: 10px; border: 1px solid #f3f4f6; }
  .card-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
  .card-title { font-size: 11px; font-weight: 700; color: #111827; line-height: 1.3; }
  .card-subtitle { font-size: 9px; color: #6b7280; margin-top: 1px; }
  .card-date { font-size: 8.5px; font-weight: 500; color: #0f766e; background: #f0fdfa; padding: 2px 7px; border-radius: 10px; white-space: nowrap; border: 1px solid #99f6e4; }
  .card-desc { font-size: 9px; color: #6b7280; margin-top: 6px; line-height: 1.5; }
  .edu-card { background: #f9fafb; border-radius: 10px; padding: 10px; border: 1px solid #f3f4f6; margin-bottom: 10px; }
  .tech-badge { display: inline-block; font-size: 8.5px; padding: 2px 7px; border-radius: 10px; font-weight: 500; margin: 1px 2px; }
  .cert-card { background: #f9fafb; border-radius: 10px; padding: 8px 10px; border: 1px solid #f3f4f6; margin-bottom: 8px; }
  .cert-title { font-size: 10px; font-weight: 700; color: #111827; }
  .cert-subtitle { font-size: 9px; color: #6b7280; margin-top: 1px; }
  .cert-date { font-size: 8.5px; color: #9ca3af; }
  .cert-meta { font-size: 8px; color: #9ca3af; margin-top: 2px; }
  .ach-item { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px; }
  .ach-dot { width: 7px; height: 7px; border-radius: 50%; background: linear-gradient(135deg, #2dd4bf, #22d3ee); flex-shrink: 0; margin-top: 4px; }
  .ach-title { font-size: 10px; font-weight: 700; color: #111827; }
  .ach-date { font-size: 8.5px; color: #9ca3af; }
  .ach-category { font-size: 7.5px; text-transform: uppercase; letter-spacing: 1px; color: #0f766e; font-weight: 600; background: #f0fdfa; padding: 1px 5px; border-radius: 10px; border: 1px solid #99f6e4; }
  .ach-desc { font-size: 9px; color: #6b7280; margin-top: 2px; line-height: 1.5; }
  .z10 { position: relative; z-index: 10; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="page">
  <div class="sidebar">
    <div class="avatar z10">${personalInfo.fullName ? `<span class="avatar-text">${escapeHtml(getInitials(personalInfo.fullName))}</span>` : '<span class="avatar-text" style="opacity:0.6">?</span>'}</div>
    ${personalInfo.fullName ? `<div class="sidebar-name z10">${escapeHtml(personalInfo.fullName)}</div>` : ''}
    ${personalInfo.jobTitle ? `<div class="sidebar-title z10">${escapeHtml(personalInfo.jobTitle)}</div>` : ''}
    <div class="sidebar-divider z10" />
    ${(personalInfo.email || personalInfo.phone || personalInfo.location || personalInfo.website || personalInfo.linkedin || personalInfo.github) ? `<div class="z10" style="margin-bottom:14px;">
      <div class="sidebar-section-title">Contact</div>
      ${personalInfo.email ? `<div class="contact-row"><div class="contact-label">Email</div><div class="contact-value">${escapeHtml(personalInfo.email)}</div></div>` : ''}
      ${personalInfo.phone ? `<div class="contact-row"><div class="contact-label">Phone</div><div class="contact-value">${escapeHtml(personalInfo.phone)}</div></div>` : ''}
      ${personalInfo.location ? `<div class="contact-row"><div class="contact-label">Location</div><div class="contact-value">${escapeHtml(personalInfo.location)}</div></div>` : ''}
      ${personalInfo.website ? `<div class="contact-row"><div class="contact-label">Website</div><div class="contact-value">${escapeHtml(personalInfo.website)}</div></div>` : ''}
      ${personalInfo.linkedin ? `<div class="contact-row"><div class="contact-label">LinkedIn</div><div class="contact-value">${escapeHtml(personalInfo.linkedin)}</div></div>` : ''}
      ${personalInfo.github ? `<div class="contact-row"><div class="contact-label">GitHub</div><div class="contact-value">${escapeHtml(personalInfo.github)}</div></div>` : ''}
    </div>` : ''}
    <div class="stats-grid z10">
      ${yearsOfExp > 0 ? `<div class="stat-card"><div class="stat-value">${yearsOfExp}</div><div class="stat-label">Years Exp.</div></div>` : ''}
      ${projectCount > 0 ? `<div class="stat-card"><div class="stat-value">${projectCount}</div><div class="stat-label">Projects</div></div>` : ''}
      ${skillCount > 0 ? `<div class="stat-card"><div class="stat-value">${skillCount}</div><div class="stat-label">Skills</div></div>` : ''}
      ${certCount > 0 ? `<div class="stat-card"><div class="stat-value">${certCount}</div><div class="stat-label">Certs</div></div>` : ''}
    </div>
    ${skills.length > 0 ? `<div class="z10">
      <div class="sidebar-section-title">Skills</div>
      ${Object.entries(skillsByCategory).map(([category, items]) => `
        <div class="skill-category-title">${escapeHtml(category)}</div>
        ${items.map(s => `<div class="skill-row">
          <div class="skill-header"><span class="skill-name">${escapeHtml(s.name)}</span><span class="skill-level">${s.level}</span></div>
          <div class="skill-bar-track"><div class="skill-bar-fill" style="width:${levelWidth[s.level] || '50%'};"></div></div>
        </div>`).join('')}
      `).join('')}
    </div>` : ''}
  </div>

  <div class="main">
    ${personalInfo.summary ? `<div class="main-section">
      <div class="main-section-title"><span class="main-section-dot"></span>Profile</div>
      <p class="profile-text">${escapeHtml(personalInfo.summary)}</p>
    </div>` : ''}

    ${experience.length > 0 ? `<div class="main-section">
      <div class="main-section-title"><span class="main-section-dot"></span>Experience</div>
      <div class="timeline">
        <div class="timeline-line"></div>
        ${experience.map(e => `<div class="timeline-item">
          <div class="timeline-dot${e.current ? ' timeline-dot-current' : ''}"></div>
          <div class="content-card">
            <div class="card-header">
              <div><div class="card-title">${escapeHtml(e.position)}</div><div class="card-subtitle">${escapeHtml(e.company)}${e.location ? ` &middot; ${escapeHtml(e.location)}` : ''}</div></div>
              <span class="card-date">${formatDate(e.startDate)} - ${e.current ? 'Present' : formatDate(e.endDate)}</span>
            </div>
            ${e.description ? `<div class="card-desc">${escapeHtml(e.description)}</div>` : ''}
          </div>
        </div>`).join('')}
      </div>
    </div>` : ''}

    ${education.length > 0 ? `<div class="main-section">
      <div class="main-section-title"><span class="main-section-dot"></span>Education</div>
      ${education.map(ed => `<div class="edu-card">
        <div class="card-header">
          <div><div class="card-title">${escapeHtml(ed.degree)}</div><div class="card-subtitle">${escapeHtml(ed.institution)}${ed.location ? ` &middot; ${escapeHtml(ed.location)}` : ''}</div></div>
          <div style="text-align:right;flex-shrink:0;"><div style="font-size:8.5px;color:#6b7280;white-space:nowrap;">${formatDate(ed.startDate)} - ${formatDate(ed.endDate)}</div>${ed.gpa ? `<div style="font-size:8.5px;color:#0d9488;font-weight:600;margin-top:1px;">GPA: ${escapeHtml(ed.gpa)}</div>` : ''}</div>
        </div>
        ${ed.description ? `<div class="card-desc">${escapeHtml(ed.description)}</div>` : ''}
      </div>`).join('')}
    </div>` : ''}

    ${projects.length > 0 ? `<div class="main-section">
      <div class="main-section-title"><span class="main-section-dot"></span>Projects</div>
      ${projects.map(p => `<div class="content-card" style="margin-bottom:10px;">
        <div class="card-header">
          <div class="card-title">${escapeHtml(p.name)}${p.link ? `<span style="font-weight:400;font-size:9px;color:#0d9488;margin-left:5px;">${escapeHtml(p.link)}</span>` : ''}</div>
          <div style="font-size:8.5px;color:#9ca3af;white-space:nowrap;flex-shrink:0;">${formatDate(p.startDate)}${p.endDate ? ` - ${formatDate(p.endDate)}` : ''}</div>
        </div>
        ${p.technologies ? `<div style="margin-top:4px;">${p.technologies.split(',').map((t, i) => `<span class="tech-badge" style="${getTechColor(i)}">${escapeHtml(t.trim())}</span>`).join('')}</div>` : ''}
        ${p.description ? `<div class="card-desc">${escapeHtml(p.description)}</div>` : ''}
        ${p.highlights ? `<div class="card-desc">${escapeHtml(p.highlights)}</div>` : ''}
      </div>`).join('')}
    </div>` : ''}

    ${certifications.length > 0 ? `<div class="main-section">
      <div class="main-section-title"><span class="main-section-dot"></span>Certifications</div>
      ${certifications.map(c => `<div class="cert-card">
        <div class="card-header">
          <div><div class="cert-title">${escapeHtml(c.name)}</div><div class="cert-subtitle">${escapeHtml(c.issuer)}</div></div>
          ${c.date ? `<span class="cert-date">${formatDate(c.date)}</span>` : ''}
        </div>
        <div class="cert-meta">${c.credentialId ? `ID: ${escapeHtml(c.credentialId)}` : ''}${c.url ? ` ${escapeHtml(c.url)}` : ''}</div>
      </div>`).join('')}
    </div>` : ''}

    ${achievements.length > 0 ? `<div class="main-section">
      <div class="main-section-title"><span class="main-section-dot"></span>Achievements</div>
      ${achievements.map(a => `<div class="ach-item">
        <span class="ach-dot"></span>
        <div>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
            <span class="ach-title">${escapeHtml(a.title)}</span>
            <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">${a.date ? `<span class="ach-date">${formatDate(a.date)}</span>` : ''}${a.category ? `<span class="ach-category">${escapeHtml(a.category)}</span>` : ''}</div>
          </div>
          ${a.description ? `<div class="ach-desc">${escapeHtml(a.description)}</div>` : ''}
        </div>
      </div>`).join('')}
    </div>` : ''}
  </div>
</div>
</body>
</html>`;
}

function generateAcademicHTML(data: ResumeData): string {
  const { personalInfo, education, skills, projects, experience, certifications, achievements } = data;

  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4; margin: 12mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Times New Roman', Georgia, 'Palatino Linotype', serif; color: #111827; font-size: 10pt; line-height: 1.55; }
  .page { width: 100%; }
  .header { text-align: center; margin-bottom: 16px; }
  .header-name { font-size: 20px; font-weight: bold; color: #6B1D2A; letter-spacing: 0.5px; line-height: 1.3; }
  .header-title { font-size: 11px; color: #4b5563; margin-top: 3px; font-style: italic; }
  .contact-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 8px; margin-top: 10px; font-size: 9.5px; color: #6b7280; }
  .contact-sep { color: #d1d5db; }
  .hr-burgundy { border: none; border-top: 1.5px solid #6B1D2A; margin-bottom: 16px; }
  .hr-light { border: none; border-top: 1px solid #e5e7eb; margin-bottom: 16px; }
  .section { margin-bottom: 16px; }
  .section-title { font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 3px; color: #6B1D2A; margin-bottom: 10px; }
  .entry { margin-bottom: 14px; }
  .entry-header { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
  .entry-title { font-size: 12px; font-weight: bold; color: #111827; line-height: 1.3; }
  .entry-subtitle { font-size: 11px; color: #4b5563; margin-top: 1px; }
  .entry-date { font-size: 9.5px; color: #6b7280; white-space: nowrap; flex-shrink: 0; font-style: italic; }
  .entry-desc { font-size: 10px; color: #4b5563; margin-top: 3px; line-height: 1.55; }
  .summary-text { font-size: 11px; color: #374151; line-height: 1.65; text-align: justify; }
  .gpa-text { font-size: 9.5px; color: #6b7280; margin-top: 2px; }
  .skill-category { margin-bottom: 6px; }
  .skill-cat-title { font-size: 9.5px; font-weight: 600; color: #4b5563; margin-bottom: 4px; }
  .skill-tag { display: inline-block; font-size: 8.5px; padding: 2px 7px; border: 1px solid rgba(107,29,42,0.3); color: #6B1D2A; background: rgba(107,29,42,0.04); border-radius: 2px; margin: 1px 2px; }
  .pub-item { margin-bottom: 12px; display: flex; align-items: baseline; gap: 6px; }
  .pub-number { font-size: 9.5px; color: #9ca3af; flex-shrink: 0; }
  .pub-title { font-size: 11px; font-weight: bold; color: #111827; line-height: 1.3; }
  .pub-desc { font-size: 9.5px; color: #4b5563; margin-top: 2px; line-height: 1.5; }
  .pub-tech { font-size: 9.5px; color: #6b7280; margin-top: 2px; font-style: italic; }
  .pub-link { font-size: 8.5px; color: #6B1D2A; margin-top: 2px; word-break: break-all; }
  .pub-date { font-size: 8.5px; color: #9ca3af; margin-top: 2px; font-style: italic; }
  .cert-item { margin-bottom: 10px; }
  .cert-title { font-size: 11px; font-weight: bold; color: #111827; }
  .cert-subtitle { font-size: 9.5px; color: #4b5563; }
  .cert-credential { font-size: 8.5px; color: #6b7280; }
  .ach-item { margin-bottom: 10px; }
  .ach-header { display: flex; align-items: baseline; gap: 6px; }
  .ach-title { font-size: 11px; font-weight: bold; color: #111827; }
  .ach-date { font-size: 8.5px; color: #9ca3af; white-space: nowrap; flex-shrink: 0; font-style: italic; }
  .ach-desc { font-size: 9.5px; color: #4b5563; margin-top: 2px; }
  .ach-category { display: inline-block; font-size: 7.5px; text-transform: uppercase; letter-spacing: 1px; color: #6B1D2A; border: 1px solid rgba(107,29,42,0.3); background: rgba(107,29,42,0.04); padding: 1px 5px; border-radius: 2px; margin-top: 2px; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    ${personalInfo.fullName ? `<div class="header-name">${escapeHtml(personalInfo.fullName)}</div>` : ''}
    ${personalInfo.jobTitle ? `<div class="header-title">${escapeHtml(personalInfo.jobTitle)}</div>` : ''}
    ${(personalInfo.email || personalInfo.phone || personalInfo.location || personalInfo.website) ? `<div class="contact-row">
      ${personalInfo.email ? `<span>${escapeHtml(personalInfo.email)}</span>` : ''}
      ${personalInfo.email && personalInfo.phone ? '<span class="contact-sep">|</span>' : ''}
      ${personalInfo.phone ? `<span>${escapeHtml(personalInfo.phone)}</span>` : ''}
      ${personalInfo.phone && personalInfo.location ? '<span class="contact-sep">|</span>' : ''}
      ${personalInfo.location ? `<span>${escapeHtml(personalInfo.location)}</span>` : ''}
      ${personalInfo.location && personalInfo.website ? '<span class="contact-sep">|</span>' : ''}
      ${personalInfo.website ? `<span style="word-break:break-all;">${escapeHtml(personalInfo.website)}</span>` : ''}
    </div>` : ''}
    ${(personalInfo.linkedin || personalInfo.github) ? `<div class="contact-row">
      ${personalInfo.linkedin ? `<span style="word-break:break-all;">${escapeHtml(personalInfo.linkedin)}</span>` : ''}
      ${personalInfo.linkedin && personalInfo.github ? '<span class="contact-sep">|</span>' : ''}
      ${personalInfo.github ? `<span style="word-break:break-all;">${escapeHtml(personalInfo.github)}</span>` : ''}
    </div>` : ''}
  </div>

  <hr class="hr-burgundy" />

  ${personalInfo.summary ? `<div class="section"><div class="section-title">Research Summary</div><p class="summary-text">${escapeHtml(personalInfo.summary)}</p></div><hr class="hr-light" />` : ''}

  ${education.length > 0 ? `<div class="section">
    <div class="section-title">Education</div>
    ${education.map(ed => `<div class="entry">
      <div class="entry-header">
        <div><div class="entry-title">${escapeHtml(ed.degree)}</div><div class="entry-subtitle">${escapeHtml(ed.institution)}${ed.location ? `<span style="color:#9ca3af;">, ${escapeHtml(ed.location)}</span>` : ''}</div></div>
        <div class="entry-date">${formatDate(ed.startDate)} &ndash; ${formatDate(ed.endDate)}</div>
      </div>
      ${ed.gpa ? `<div class="gpa-text">GPA: ${escapeHtml(ed.gpa)}</div>` : ''}
      ${ed.description ? `<div class="entry-desc">${escapeHtml(ed.description)}</div>` : ''}
    </div>`).join('')}
  </div><hr class="hr-light" />` : ''}

  ${skills.length > 0 ? `<div class="section">
    <div class="section-title">Research Interests</div>
    ${Object.entries(skillsByCategory).map(([category, items]) => `<div class="skill-category">
      <div class="skill-cat-title">${escapeHtml(category)}</div>
      <div>${items.map(s => `<span class="skill-tag">${escapeHtml(s.name)}</span>`).join('')}</div>
    </div>`).join('')}
  </div><hr class="hr-light" />` : ''}

  ${projects.length > 0 ? `<div class="section">
    <div class="section-title">Selected Publications</div>
    ${projects.map((p, idx) => `<div class="pub-item">
      <span class="pub-number">[${idx + 1}]</span>
      <div>
        <div class="pub-title">${escapeHtml(p.name)}</div>
        ${p.description ? `<div class="pub-desc">${escapeHtml(p.description)}</div>` : ''}
        ${p.technologies ? `<div class="pub-tech">${escapeHtml(p.technologies)}</div>` : ''}
        ${p.highlights ? `<div class="pub-desc">${escapeHtml(p.highlights)}</div>` : ''}
        ${p.link ? `<div class="pub-link">${escapeHtml(p.link)}</div>` : ''}
        ${(p.startDate || p.endDate) ? `<div class="pub-date">${formatDate(p.startDate)}${p.endDate ? ` &ndash; ${formatDate(p.endDate)}` : ''}</div>` : ''}
      </div>
    </div>`).join('')}
  </div><hr class="hr-light" />` : ''}

  ${experience.length > 0 ? `<div class="section">
    <div class="section-title">Academic &amp; Professional Experience</div>
    ${experience.map(e => `<div class="entry">
      <div class="entry-header">
        <div><div class="entry-title">${escapeHtml(e.position)}</div><div class="entry-subtitle">${escapeHtml(e.company)}${e.location ? `<span style="color:#9ca3af;">, ${escapeHtml(e.location)}</span>` : ''}</div></div>
        <div class="entry-date">${formatDate(e.startDate)} &ndash; ${e.current ? 'Present' : formatDate(e.endDate)}</div>
      </div>
      ${e.description ? `<div class="entry-desc">${escapeHtml(e.description)}</div>` : ''}
    </div>`).join('')}
  </div><hr class="hr-light" />` : ''}

  ${certifications.length > 0 ? `<div class="section">
    <div class="section-title">Certifications &amp; Licenses</div>
    ${certifications.map(c => `<div class="cert-item">
      <div class="cert-title">${escapeHtml(c.name)}</div>
      <div class="cert-subtitle">${escapeHtml(c.issuer)}${c.date ? ` <span style="color:#9ca3af;">(${formatDate(c.date)})</span>` : ''}</div>
      ${c.credentialId ? `<div class="cert-credential">Credential ID: ${escapeHtml(c.credentialId)}</div>` : ''}
    </div>`).join('')}
  </div><hr class="hr-light" />` : ''}

  ${achievements.length > 0 ? `<div class="section">
    <div class="section-title">Honors &amp; Awards</div>
    ${achievements.map(a => `<div class="ach-item">
      <div class="ach-header">
        <span class="ach-title">${escapeHtml(a.title)}</span>
        ${a.date ? `<span class="ach-date">${formatDate(a.date)}</span>` : ''}
      </div>
      ${a.description ? `<div class="ach-desc">${escapeHtml(a.description)}</div>` : ''}
      ${a.category ? `<div class="ach-category">${escapeHtml(a.category)}</div>` : ''}
    </div>`).join('')}
  </div>` : ''}
</div>
</body>
</html>`;
}

function generateFreelancerHTML(data: ResumeData): string {
  const { personalInfo, education, skills, projects, experience, certifications, achievements } = data;

  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4; margin: 12mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #111827; font-size: 9pt; line-height: 1.5; }
  .page { display: flex; width: 100%; min-height: 100vh; }
  .left-col { width: 40%; flex-shrink: 0; background: #fffbeb; padding: 20px 16px; border-right: 1px solid #fde68a; }
  .right-col { width: 60%; flex-shrink: 0; padding: 20px; }
  .section-heading { font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #b45309; border-bottom: 2px solid #fbbf24; padding-bottom: 4px; margin-bottom: 12px; }
  .contact-list { list-style: none; }
  .contact-item { display: flex; align-items: flex-start; gap: 7px; margin-bottom: 8px; font-size: 9.5px; color: #374151; }
  .contact-dot { width: 14px; height: 14px; border-radius: 50%; background: #fbbf24; color: #78350f; display: flex; align-items: center; justify-content: center; font-size: 7.5px; font-weight: 700; flex-shrink: 0; margin-top: 1px; }
  .skill-cat-block { margin-bottom: 10px; }
  .skill-cat-heading { font-size: 8.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: #d97706; margin-bottom: 5px; display: flex; align-items: center; gap: 5px; }
  .skill-cat-dot { width: 5px; height: 5px; border-radius: 50%; background: #f59e0b; flex-shrink: 0; }
  .skill-pill { display: inline-block; font-size: 8.5px; color: #374151; background: #fff; border: 1px solid #fcd34d; border-radius: 12px; padding: 2px 7px; margin: 1px 2px; }
  .offer-list { list-style: none; }
  .offer-item { display: flex; align-items: flex-start; gap: 7px; margin-bottom: 8px; }
  .offer-dot { width: 7px; height: 7px; border-radius: 50%; background: #f97316; flex-shrink: 0; margin-top: 4px; }
  .offer-title { font-size: 9.5px; font-weight: 600; color: #1f2937; }
  .offer-desc { font-size: 8.5px; color: #6b7280; line-height: 1.4; }
  .cert-card { background: rgba(255,255,255,0.7); border-radius: 6px; padding: 6px 8px; border: 1px solid #fde68a; margin-bottom: 8px; }
  .cert-name { font-size: 9.5px; font-weight: 600; color: #111827; line-height: 1.3; }
  .cert-issuer { font-size: 8.5px; color: #6b7280; }
  .cert-meta { font-size: 8.5px; color: #9ca3af; }
  .avail-banner { background: linear-gradient(to right, #fbbf24, #fb923c); border-radius: 8px; padding: 10px; text-align: center; margin-bottom: 14px; }
  .avail-label { font-size: 8.5px; text-transform: uppercase; letter-spacing: 2px; color: #78350f; font-weight: 700; margin-bottom: 3px; }
  .avail-text { font-size: 9.5px; color: #fff; font-weight: 500; line-height: 1.4; }
  .right-header { margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid #fbbf24; }
  .right-name { font-size: 20px; font-weight: 700; color: #111827; letter-spacing: -0.3px; line-height: 1.2; }
  .right-title { font-size: 11px; color: #d97706; font-weight: 500; margin-top: 2px; }
  .right-summary { font-size: 9.5px; color: #4b5563; line-height: 1.55; margin-top: 6px; }
  .project-card { background: linear-gradient(to bottom right, #f9fafb, rgba(255,251,235,0.5)); border: 1px solid #fde68a; border-radius: 8px; padding: 10px; margin-bottom: 10px; position: relative; overflow: hidden; }
  .project-accent { position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: linear-gradient(to bottom, #fbbf24, #f97316); }
  .project-inner { padding-left: 6px; }
  .project-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
  .project-title { font-size: 11px; font-weight: 700; color: #111827; line-height: 1.3; }
  .project-date { font-size: 8.5px; color: #9ca3af; white-space: nowrap; flex-shrink: 0; }
  .project-desc { font-size: 9.5px; color: #4b5563; margin-top: 4px; line-height: 1.5; }
  .project-tech { display: flex; flex-wrap: wrap; gap: 3px; margin-top: 4px; }
  .project-tech-badge { font-size: 8px; background: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 10px; font-weight: 500; }
  .project-highlights { font-size: 9px; color: #6b7280; margin-top: 3px; line-height: 1.4; font-style: italic; }
  .project-link { font-size: 8.5px; color: #d97706; margin-top: 3px; }
  .exp-entry { margin-bottom: 12px; }
  .exp-header { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
  .exp-title { font-size: 11px; font-weight: 700; color: #111827; line-height: 1.3; }
  .exp-company { font-size: 9.5px; color: #4b5563; }
  .exp-date { font-size: 8.5px; color: #9ca3af; white-space: nowrap; flex-shrink: 0; }
  .exp-desc { font-size: 9.5px; color: #4b5563; margin-top: 3px; line-height: 1.55; }
  .testimonial-card { position: relative; background: #fff; border: 1px solid #fde68a; border-radius: 8px; padding: 10px 10px 10px 14px; margin-bottom: 8px; }
  .testimonial-quote { position: absolute; top: 4px; left: 6px; font-size: 20px; color: #fcd34d; font-family: Georgia, serif; line-height: 1; }
  .testimonial-inner { padding-left: 4px; }
  .testimonial-desc { font-size: 9.5px; color: #4b5563; line-height: 1.55; font-style: italic; }
  .testimonial-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 5px; }
  .testimonial-title { font-size: 9.5px; font-weight: 600; color: #1f2937; }
  .testimonial-date { font-size: 8.5px; color: #9ca3af; }
  .testimonial-category { font-size: 7.5px; text-transform: uppercase; letter-spacing: 1px; background: #fef3c7; color: #b45309; padding: 1px 5px; border-radius: 10px; font-weight: 500; }
  .edu-entry { margin-bottom: 10px; }
  .edu-header { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
  .edu-title { font-size: 11px; font-weight: 700; color: #111827; line-height: 1.3; }
  .edu-institution { font-size: 9.5px; color: #4b5563; }
  .edu-date { font-size: 8.5px; color: #9ca3af; white-space: nowrap; flex-shrink: 0; }
  .edu-gpa { font-size: 8.5px; color: #6b7280; margin-top: 2px; }
  .edu-desc { font-size: 9.5px; color: #4b5563; margin-top: 2px; line-height: 1.5; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="page">
  <div class="left-col">
    <div class="section-heading">Get in Touch</div>
    <ul class="contact-list">
      ${personalInfo.email ? `<li class="contact-item"><span class="contact-dot">@</span><span>${escapeHtml(personalInfo.email)}</span></li>` : ''}
      ${personalInfo.phone ? `<li class="contact-item"><span class="contact-dot">&#9742;</span><span>${escapeHtml(personalInfo.phone)}</span></li>` : ''}
      ${personalInfo.location ? `<li class="contact-item"><span class="contact-dot">&#9678;</span><span>${escapeHtml(personalInfo.location)}</span></li>` : ''}
      ${personalInfo.website ? `<li class="contact-item"><span class="contact-dot">&#8984;</span><span>${escapeHtml(personalInfo.website)}</span></li>` : ''}
      ${personalInfo.linkedin ? `<li class="contact-item"><span class="contact-dot">in</span><span>${escapeHtml(personalInfo.linkedin)}</span></li>` : ''}
      ${personalInfo.github ? `<li class="contact-item"><span class="contact-dot">&#8997;</span><span>${escapeHtml(personalInfo.github)}</span></li>` : ''}
    </ul>

    ${skills.length > 0 ? `<div class="section-heading" style="margin-top:16px;">Skills &amp; Services</div>
    ${Object.entries(skillsByCategory).map(([category, items]) => `<div class="skill-cat-block">
      <div class="skill-cat-heading"><span class="skill-cat-dot"></span>${escapeHtml(category)}</div>
      <div>${items.map(s => `<span class="skill-pill">${escapeHtml(s.name)}</span>`).join('')}</div>
    </div>`).join('')}` : ''}

    ${skills.length > 0 && Object.keys(skillsByCategory).length > 0 ? `<div class="section-heading" style="margin-top:16px;">What I Offer</div>
    <ul class="offer-list">
      ${Object.entries(skillsByCategory).map(([category, items]) => `<li class="offer-item">
        <span class="offer-dot"></span>
        <div><div class="offer-title">${escapeHtml(category)}</div><div class="offer-desc">${items.map(s => s.name).join(' &middot; ')}</div></div>
      </li>`).join('')}
    </ul>` : ''}

    ${certifications.length > 0 ? `<div class="section-heading" style="margin-top:16px;">Credentials</div>
    ${certifications.map(c => `<div class="cert-card">
      <div class="cert-name">${escapeHtml(c.name)}</div>
      <div class="cert-issuer">${escapeHtml(c.issuer)}</div>
      ${c.date ? `<div class="cert-meta">${formatDate(c.date)}</div>` : ''}
      ${c.credentialId ? `<div class="cert-meta">ID: ${escapeHtml(c.credentialId)}</div>` : ''}
    </div>`).join('')}` : ''}

    ${personalInfo.summary ? `<div class="avail-banner">
      <div class="avail-label">Available for Projects</div>
      <div class="avail-text">${escapeHtml(personalInfo.summary.length > 120 ? personalInfo.summary.slice(0, 120) + '\u2026' : personalInfo.summary)}</div>
    </div>` : ''}
  </div>

  <div class="right-col">
    <div class="right-header">
      ${personalInfo.fullName ? `<div class="right-name">${escapeHtml(personalInfo.fullName)}</div>` : ''}
      ${personalInfo.jobTitle ? `<div class="right-title">${escapeHtml(personalInfo.jobTitle)}</div>` : ''}
      ${personalInfo.summary ? `<div class="right-summary">${escapeHtml(personalInfo.summary)}</div>` : ''}
    </div>

    ${projects.length > 0 ? `<div style="margin-bottom:16px;">
      <div class="section-heading">Featured Work</div>
      ${projects.map((p, idx) => `<div class="project-card">
        <div class="project-accent"${idx > 0 ? ` style="opacity:${1 - idx * 0.15}"` : ''}></div>
        <div class="project-inner">
          <div class="project-header">
            <div class="project-title">${escapeHtml(p.name)}</div>
            <div class="project-date">${formatDate(p.startDate)}${p.endDate ? ` &ndash; ${formatDate(p.endDate)}` : ''}</div>
          </div>
          ${p.description ? `<div class="project-desc">${escapeHtml(p.description)}</div>` : ''}
          ${p.technologies ? `<div class="project-tech">${p.technologies.split(/[,;\u00b7]/).map(t => `<span class="project-tech-badge">${escapeHtml(t.trim())}</span>`).join('')}</div>` : ''}
          ${p.highlights ? `<div class="project-highlights">${escapeHtml(p.highlights)}</div>` : ''}
          ${p.link ? `<div class="project-link">${escapeHtml(p.link)}</div>` : ''}
        </div>
      </div>`).join('')}
    </div>` : ''}

    ${experience.length > 0 ? `<div style="margin-bottom:16px;">
      <div class="section-heading">Work History</div>
      ${experience.map(e => `<div class="exp-entry">
        <div class="exp-header">
          <div><div class="exp-title">${escapeHtml(e.position)}</div><div class="exp-company">${escapeHtml(e.company)}${e.location ? ` <span style="color:#9ca3af;">&middot; ${escapeHtml(e.location)}</span>` : ''}</div></div>
          <div class="exp-date">${formatDate(e.startDate)} &ndash; ${e.current ? 'Present' : formatDate(e.endDate)}</div>
        </div>
        ${e.description ? `<div class="exp-desc">${escapeHtml(e.description)}</div>` : ''}
      </div>`).join('')}
    </div>` : ''}

    ${achievements.length > 0 ? `<div style="margin-bottom:16px;">
      <div class="section-heading">Testimonials &amp; Highlights</div>
      ${achievements.map(a => `<div class="testimonial-card">
        <span class="testimonial-quote">&ldquo;</span>
        <div class="testimonial-inner">
          ${a.description ? `<div class="testimonial-desc">${escapeHtml(a.description)}</div>` : ''}
          <div class="testimonial-footer">
            <span class="testimonial-title">${escapeHtml(a.title)}</span>
            <div style="display:flex;align-items:center;gap:5px;">
              ${a.date ? `<span class="testimonial-date">${formatDate(a.date)}</span>` : ''}
              ${a.category ? `<span class="testimonial-category">${escapeHtml(a.category)}</span>` : ''}
            </div>
          </div>
        </div>
      </div>`).join('')}
    </div>` : ''}

    ${education.length > 0 ? `<div style="margin-bottom:16px;">
      <div class="section-heading">Education</div>
      ${education.map(ed => `<div class="edu-entry">
        <div class="edu-header">
          <div><div class="edu-title">${escapeHtml(ed.degree)}</div><div class="edu-institution">${escapeHtml(ed.institution)}${ed.location ? ` <span style="color:#9ca3af;">&middot; ${escapeHtml(ed.location)}</span>` : ''}</div></div>
          <div class="edu-date">${formatDate(ed.startDate)} &ndash; ${formatDate(ed.endDate)}</div>
        </div>
        ${ed.gpa ? `<div class="edu-gpa">GPA: ${escapeHtml(ed.gpa)}</div>` : ''}
        ${ed.description ? `<div class="edu-desc">${escapeHtml(ed.description)}</div>` : ''}
      </div>`).join('')}
    </div>` : ''}
  </div>
</div>
</body>
</html>`;
}

function generateExecutiveHTML(data: ResumeData): string {
  const { personalInfo, education, skills, experience, projects, certifications, achievements } = data;
  const skillGroups = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4; margin: 12mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Georgia, 'Palatino Linotype', 'Times New Roman', serif; color: #1a1a1a; font-size: 9.5pt; line-height: 1.5; }
  .page { display: flex; width: 100%; min-height: 100vh; }
  .sidebar { width: 33%; flex-shrink: 0; background: #1e3a5f; color: #e8e0d0; padding: 24px 18px; }
  .sidebar-name { font-size: 18px; font-weight: 700; color: #c9a84c; letter-spacing: 0.5px; line-height: 1.3; margin-bottom: 4px; }
  .sidebar-title { font-size: 10px; color: rgba(201,168,76,0.8); font-style: italic; margin-bottom: 16px; }
  .gold-line { height: 2px; background: #c9a84c; margin: 16px 0; }
  .sidebar-section-title { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 3px; color: #c9a84c; margin-bottom: 10px; }
  .sidebar-contact { margin-bottom: 6px; font-size: 8.5pt; color: #d0ccc4; line-height: 1.6; word-break: break-all; }
  .sidebar-skill-group { margin-bottom: 12px; }
  .sidebar-skill-cat { font-size: 8.5pt; font-weight: 600; color: #e8e0d0; margin-bottom: 4px; }
  .sidebar-skill-item { font-size: 8pt; color: #b0a898; margin-bottom: 2px; padding-left: 8px; border-left: 2px solid #c9a84c; }
  .sidebar-cert { margin-bottom: 10px; }
  .sidebar-cert-name { font-size: 8.5pt; font-weight: 600; color: #e8e0d0; line-height: 1.3; }
  .sidebar-cert-issuer { font-size: 8pt; color: #b0a898; margin-top: 1px; }
  .sidebar-cert-date { font-size: 7.5pt; color: rgba(201,168,76,0.7); margin-top: 1px; }
  .sidebar-ach { margin-bottom: 8px; }
  .sidebar-ach-title { font-size: 8.5pt; font-weight: 600; color: #e8e0d0; }
  .sidebar-ach-date { font-size: 7.5pt; color: rgba(201,168,76,0.7); margin-top: 1px; }
  .sidebar-ach-desc { font-size: 8pt; color: #b0a898; margin-top: 2px; }
  .main { width: 67%; flex-shrink: 0; padding: 24px 20px; }
  .main-summary { font-size: 9pt; color: #374151; line-height: 1.65; margin-bottom: 20px; border-left: 3px solid #c9a84c; padding-left: 12px; }
  .main-section { margin-bottom: 18px; }
  .main-section-title { font-size: 10pt; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #1e3a5f; padding-bottom: 5px; border-bottom: 2px solid #c9a84c; margin-bottom: 12px; }
  .main-entry { margin-bottom: 12px; }
  .main-entry-header { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; }
  .main-entry-title { font-size: 10pt; font-weight: 700; color: #1e3a5f; }
  .main-entry-subtitle { font-size: 9pt; color: #4b5563; margin-top: 1px; }
  .main-entry-date { font-size: 8pt; color: #c9a84c; font-weight: 600; white-space: nowrap; flex-shrink: 0; }
  .main-entry-desc { font-size: 8.5pt; color: #4b5563; margin-top: 4px; line-height: 1.55; }
  .main-entry-loc { font-size: 8pt; color: #6b7280; margin-top: 1px; }
  .main-project { margin-bottom: 10px; padding: 8px 10px; background: #faf9f7; border-left: 3px solid #c9a84c; }
  .main-project-title { font-size: 9.5pt; font-weight: 700; color: #1e3a5f; }
  .main-project-desc { font-size: 8.5pt; color: #4b5563; margin-top: 3px; }
  .main-project-tech { font-size: 8pt; color: #c9a84c; margin-top: 3px; font-weight: 600; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="page">
  <div class="sidebar">
    <div class="sidebar-name">${escapeHtml(personalInfo.fullName || 'Your Name')}</div>
    <div class="sidebar-title">${escapeHtml(personalInfo.jobTitle || 'Executive Title')}</div>
    <div class="gold-line"></div>

    ${personalInfo.email ? `<div class="sidebar-contact">${escapeHtml(personalInfo.email)}</div>` : ''}
    ${personalInfo.phone ? `<div class="sidebar-contact">${escapeHtml(personalInfo.phone)}</div>` : ''}
    ${personalInfo.location ? `<div class="sidebar-contact">${escapeHtml(personalInfo.location)}</div>` : ''}
    ${personalInfo.website ? `<div class="sidebar-contact">${escapeHtml(personalInfo.website)}</div>` : ''}
    ${personalInfo.linkedin ? `<div class="sidebar-contact">${escapeHtml(personalInfo.linkedin)}</div>` : ''}
    ${personalInfo.github ? `<div class="sidebar-contact">${escapeHtml(personalInfo.github)}</div>` : ''}

    ${Object.keys(skillGroups).length > 0 ? `<div class="gold-line"></div>
    <div class="sidebar-section-title">Core Competencies</div>
    ${Object.entries(skillGroups).map(([cat, sk]) => `<div class="sidebar-skill-group">
      <div class="sidebar-skill-cat">${escapeHtml(cat)}</div>
      ${sk.map(s => `<div class="sidebar-skill-item">${escapeHtml(s.name)}</div>`).join('')}
    </div>`).join('')}` : ''}

    ${certifications.length > 0 ? `<div class="gold-line"></div>
    <div class="sidebar-section-title">Certifications</div>
    ${certifications.map(c => `<div class="sidebar-cert">
      <div class="sidebar-cert-name">${escapeHtml(c.name)}</div>
      <div class="sidebar-cert-issuer">${escapeHtml(c.issuer)}</div>
      ${c.date ? `<div class="sidebar-cert-date">${formatDate(c.date)}</div>` : ''}
    </div>`).join('')}` : ''}

    ${achievements.length > 0 ? `<div class="gold-line"></div>
    <div class="sidebar-section-title">Achievements</div>
    ${achievements.map(a => `<div class="sidebar-ach">
      <div class="sidebar-ach-title">${escapeHtml(a.title)}</div>
      ${a.date ? `<div class="sidebar-ach-date">${formatDate(a.date)}</div>` : ''}
      ${a.description ? `<div class="sidebar-ach-desc">${escapeHtml(a.description)}</div>` : ''}
    </div>`).join('')}` : ''}
  </div>

  <div class="main">
    ${personalInfo.summary ? `<div class="main-summary">${escapeHtml(personalInfo.summary)}</div>` : ''}

    ${experience.length > 0 ? `<div class="main-section">
      <div class="main-section-title">Professional Experience</div>
      ${experience.map(e => `<div class="main-entry">
        <div class="main-entry-header">
          <div><div class="main-entry-title">${escapeHtml(e.position)}</div><div class="main-entry-subtitle">${escapeHtml(e.company)}</div></div>
          <div class="main-entry-date">${formatDate(e.startDate)} &ndash; ${e.current ? 'Present' : formatDate(e.endDate)}</div>
        </div>
        ${e.location ? `<div class="main-entry-loc">${escapeHtml(e.location)}</div>` : ''}
        ${e.description ? `<div class="main-entry-desc">${escapeHtml(e.description)}</div>` : ''}
      </div>`).join('')}
    </div>` : ''}

    ${education.length > 0 ? `<div class="main-section">
      <div class="main-section-title">Education</div>
      ${education.map(ed => `<div class="main-entry">
        <div class="main-entry-header">
          <div><div class="main-entry-title">${escapeHtml(ed.degree)}</div><div class="main-entry-subtitle">${escapeHtml(ed.institution)}</div></div>
          <div class="main-entry-date">${formatDate(ed.startDate)} &ndash; ${formatDate(ed.endDate)}</div>
        </div>
        ${ed.location ? `<div class="main-entry-loc">${escapeHtml(ed.location)}</div>` : ''}
        ${ed.gpa ? `<div style="font-size:8.5pt;color:#c9a84c;margin-top:2px;">GPA: ${escapeHtml(ed.gpa)}</div>` : ''}
        ${ed.description ? `<div class="main-entry-desc">${escapeHtml(ed.description)}</div>` : ''}
      </div>`).join('')}
    </div>` : ''}

    ${projects.length > 0 ? `<div class="main-section">
      <div class="main-section-title">Key Projects</div>
      ${projects.map(p => `<div class="main-project">
        <div class="main-project-title">${escapeHtml(p.name)}</div>
        ${p.description ? `<div class="main-project-desc">${escapeHtml(p.description)}</div>` : ''}
        ${p.technologies ? `<div class="main-project-tech">${escapeHtml(p.technologies)}</div>` : ''}
      </div>`).join('')}
    </div>` : ''}
  </div>
</div>
</body>
</html>`;
}

function generateMinimalistHTML(data: ResumeData): string {
  const { personalInfo, education, skills, experience, projects, certifications, achievements } = data;
  const skillGroups = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4; margin: 15mm 18mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Helvetica, system-ui, -apple-system, sans-serif; color: #111; font-size: 9.5pt; line-height: 1.6; }
  .page { width: 100%; }
  .header { padding-bottom: 24px; margin-bottom: 28px; border-bottom: 1px solid #ddd; }
  .name { font-size: 22pt; font-weight: 300; color: #000; letter-spacing: 2px; text-transform: uppercase; }
  .title { font-size: 10pt; color: #999; margin-top: 4px; font-weight: 400; letter-spacing: 0.5px; }
  .contact { display: flex; flex-wrap: wrap; gap: 20px; margin-top: 12px; font-size: 8.5pt; color: #888; }
  .contact span { white-space: nowrap; }
  .section { margin-bottom: 24px; }
  .section-title { font-size: 8pt; text-transform: uppercase; letter-spacing: 3px; color: #aaa; font-weight: 500; margin-bottom: 14px; padding-bottom: 6px; border-bottom: 1px solid #e5e5e5; }
  .summary { font-size: 9.5pt; color: #444; line-height: 1.7; }
  .entry { margin-bottom: 14px; }
  .entry-header { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
  .entry-title { font-size: 10pt; font-weight: 500; color: #111; }
  .entry-subtitle { font-size: 9pt; color: #888; margin-top: 1px; }
  .entry-date { font-size: 8.5pt; color: #aaa; white-space: nowrap; flex-shrink: 0; }
  .entry-desc { font-size: 9pt; color: #555; margin-top: 4px; line-height: 1.6; }
  .entry-loc { font-size: 8.5pt; color: #aaa; margin-top: 1px; }
  .skill-group { margin-bottom: 10px; }
  .skill-cat-title { font-size: 8.5pt; font-weight: 500; color: #666; margin-bottom: 4px; }
  .skill-tags { display: flex; flex-wrap: wrap; gap: 4px; }
  .skill-tag { font-size: 8pt; color: #666; padding: 2px 0; }
  .skill-tag + .skill-tag::before { content: '\\00b7'; margin-right: 6px; color: #ccc; }
  .project-entry { margin-bottom: 10px; }
  .cert-entry { margin-bottom: 8px; }
  .ach-entry { margin-bottom: 8px; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="name">${escapeHtml(personalInfo.fullName || 'Your Name')}</div>
    <div class="title">${escapeHtml(personalInfo.jobTitle || 'Professional Title')}</div>
    <div class="contact">
      ${personalInfo.email ? `<span>${escapeHtml(personalInfo.email)}</span>` : ''}
      ${personalInfo.phone ? `<span>${escapeHtml(personalInfo.phone)}</span>` : ''}
      ${personalInfo.location ? `<span>${escapeHtml(personalInfo.location)}</span>` : ''}
      ${personalInfo.website ? `<span>${escapeHtml(personalInfo.website)}</span>` : ''}
      ${personalInfo.linkedin ? `<span>${escapeHtml(personalInfo.linkedin)}</span>` : ''}
      ${personalInfo.github ? `<span>${escapeHtml(personalInfo.github)}</span>` : ''}
    </div>
  </div>

  ${personalInfo.summary ? `<div class="section">
    <div class="section-title">About</div>
    <div class="summary">${escapeHtml(personalInfo.summary)}</div>
  </div>` : ''}

  ${experience.length > 0 ? `<div class="section">
    <div class="section-title">Experience</div>
    ${experience.map(e => `<div class="entry">
      <div class="entry-header">
        <div><div class="entry-title">${escapeHtml(e.position)}</div><div class="entry-subtitle">${escapeHtml(e.company)}</div></div>
        <div class="entry-date">${formatDate(e.startDate)} &ndash; ${e.current ? 'Present' : formatDate(e.endDate)}</div>
      </div>
      ${e.location ? `<div class="entry-loc">${escapeHtml(e.location)}</div>` : ''}
      ${e.description ? `<div class="entry-desc">${escapeHtml(e.description)}</div>` : ''}
    </div>`).join('')}
  </div>` : ''}

  ${education.length > 0 ? `<div class="section">
    <div class="section-title">Education</div>
    ${education.map(ed => `<div class="entry">
      <div class="entry-header">
        <div><div class="entry-title">${escapeHtml(ed.degree)}</div><div class="entry-subtitle">${escapeHtml(ed.institution)}</div></div>
        <div class="entry-date">${formatDate(ed.startDate)} &ndash; ${formatDate(ed.endDate)}</div>
      </div>
      ${ed.location ? `<div class="entry-loc">${escapeHtml(ed.location)}</div>` : ''}
      ${ed.gpa ? `<div style="font-size:8.5pt;color:#999;margin-top:2px;">GPA: ${escapeHtml(ed.gpa)}</div>` : ''}
      ${ed.description ? `<div class="entry-desc">${escapeHtml(ed.description)}</div>` : ''}
    </div>`).join('')}
  </div>` : ''}

  ${Object.keys(skillGroups).length > 0 ? `<div class="section">
    <div class="section-title">Skills</div>
    ${Object.entries(skillGroups).map(([cat, sk]) => `<div class="skill-group">
      <div class="skill-cat-title">${escapeHtml(cat)}</div>
      <div class="skill-tags">${sk.map(s => `<span class="skill-tag">${escapeHtml(s.name)}</span>`).join('')}</div>
    </div>`).join('')}
  </div>` : ''}

  ${projects.length > 0 ? `<div class="section">
    <div class="section-title">Projects</div>
    ${projects.map(p => `<div class="project-entry">
      <div class="entry-title">${escapeHtml(p.name)}${p.link ? ` <span style="font-weight:400;font-size:8.5pt;color:#aaa;">${escapeHtml(p.link)}</span>` : ''}</div>
      ${p.description ? `<div class="entry-desc">${escapeHtml(p.description)}</div>` : ''}
      ${p.technologies ? `<div style="font-size:8pt;color:#999;margin-top:2px;">${escapeHtml(p.technologies)}</div>` : ''}
    </div>`).join('')}
  </div>` : ''}

  ${certifications.length > 0 ? `<div class="section">
    <div class="section-title">Certifications</div>
    ${certifications.map(c => `<div class="cert-entry">
      <span class="entry-title" style="font-size:9.5pt;">${escapeHtml(c.name)}</span>
      <span style="font-size:8.5pt;color:#888;"> &mdash; ${escapeHtml(c.issuer)}${c.date ? `, ${formatDate(c.date)}` : ''}</span>
    </div>`).join('')}
  </div>` : ''}

  ${achievements.length > 0 ? `<div class="section">
    <div class="section-title">Achievements</div>
    ${achievements.map(a => `<div class="ach-entry">
      <div><span class="entry-title" style="font-size:9.5pt;">${escapeHtml(a.title)}</span>${a.date ? `<span style="font-size:8.5pt;color:#aaa;margin-left:8px;">${formatDate(a.date)}</span>` : ''}</div>
      ${a.description ? `<div class="entry-desc">${escapeHtml(a.description)}</div>` : ''}
    </div>`).join('')}
  </div>` : ''}
</div>
</body>
</html>`;
}

function generateTechHTML(data: ResumeData): string {
  const { personalInfo, education, skills, experience, projects, certifications, achievements } = data;
  const skillGroups = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4; margin: 12mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #c9d1d9; font-size: 9pt; line-height: 1.55; }
  .page { width: 100%; }
  .banner { background: #0d1117; padding: 24px 22px 20px; border-bottom: 3px solid #22c55e; }
  .banner-name { font-family: 'Courier New', Courier, monospace; font-size: 20pt; font-weight: 700; color: #f0f6fc; letter-spacing: -0.5px; }
  .banner-title { font-family: 'Courier New', Courier, monospace; font-size: 10pt; color: #22c55e; margin-top: 3px; }
  .banner-contact { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 10px; font-family: 'Courier New', Courier, monospace; font-size: 8pt; color: #8b949e; }
  .banner-contact span { white-space: nowrap; }
  .cmd { color: #22c55e; }
  .str { color: #79c0ff; }
  .body-content { padding: 16px 22px; }
  .section { margin-bottom: 16px; }
  .section-title { font-family: 'Courier New', Courier, monospace; font-size: 9.5pt; font-weight: 700; color: #22c55e; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
  .section-bracket { color: #8b949e; }
  .summary-block { background: #161b22; border: 1px solid #30363d; border-radius: 6px; padding: 10px 12px; margin-bottom: 16px; font-size: 8.5pt; color: #c9d1d9; line-height: 1.6; }
  .entry { margin-bottom: 12px; padding: 8px 10px; background: #161b22; border: 1px solid #30363d; border-radius: 6px; border-left: 3px solid #22c55e; }
  .entry-header { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; }
  .entry-title { font-family: 'Courier New', Courier, monospace; font-size: 9.5pt; font-weight: 700; color: #f0f6fc; }
  .entry-subtitle { font-size: 8.5pt; color: #8b949e; margin-top: 1px; }
  .entry-date { font-size: 8pt; color: #22c55e; white-space: nowrap; flex-shrink: 0; font-family: 'Courier New', Courier, monospace; }
  .entry-desc { font-size: 8.5pt; color: #c9d1d9; margin-top: 4px; }
  .skill-group { margin-bottom: 10px; }
  .skill-cat { font-family: 'Courier New', Courier, monospace; font-size: 8.5pt; color: #58a6ff; margin-bottom: 4px; }
  .skill-items { display: flex; flex-wrap: wrap; gap: 4px; }
  .skill-badge { display: inline-block; padding: 2px 7px; border-radius: 4px; font-size: 7.5pt; font-weight: 500; font-family: 'Courier New', Courier, monospace; }
  .badge-beginner { background: rgba(34,197,94,0.1); color: #22c55e; border: 1px solid rgba(34,197,94,0.3); }
  .badge-intermediate { background: rgba(88,166,255,0.1); color: #58a6ff; border: 1px solid rgba(88,166,255,0.3); }
  .badge-advanced { background: rgba(210,153,34,0.1); color: #d29922; border: 1px solid rgba(210,153,34,0.3); }
  .badge-expert { background: rgba(34,197,94,0.2); color: #22c55e; border: 1px solid #22c55e; font-weight: 700; }
  .project-card { margin-bottom: 10px; padding: 8px 10px; background: #161b22; border: 1px solid #30363d; border-radius: 6px; }
  .project-title { font-family: 'Courier New', Courier, monospace; font-size: 9.5pt; font-weight: 700; color: #f0f6fc; }
  .project-desc { font-size: 8.5pt; color: #c9d1d9; margin-top: 3px; }
  .project-tech { font-family: 'Courier New', Courier, monospace; font-size: 8pt; color: #22c55e; margin-top: 3px; }
  .cert-item { margin-bottom: 8px; padding: 6px 8px; background: #161b22; border: 1px solid #30363d; border-radius: 6px; }
  .ach-item { margin-bottom: 8px; padding-left: 10px; border-left: 2px solid #22c55e; }
  .ach-title { font-family: 'Courier New', Courier, monospace; font-size: 9pt; font-weight: 700; color: #f0f6fc; }
  .ach-desc { font-size: 8.5pt; color: #8b949e; margin-top: 2px; }
  .ach-date { font-size: 8pt; color: #22c55e; font-family: 'Courier New', Courier, monospace; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="page">
  <div class="banner">
    <div class="banner-name">${escapeHtml(personalInfo.fullName || 'Your Name')}</div>
    <div class="banner-title">${escapeHtml(personalInfo.jobTitle || 'Software Engineer')}</div>
    <div class="banner-contact">
      ${personalInfo.email ? `<span><span class="cmd">$</span> <span class="str">${escapeHtml(personalInfo.email)}</span></span>` : ''}
      ${personalInfo.phone ? `<span><span class="cmd">$</span> <span class="str">${escapeHtml(personalInfo.phone)}</span></span>` : ''}
      ${personalInfo.location ? `<span><span class="cmd">$</span> <span class="str">${escapeHtml(personalInfo.location)}</span></span>` : ''}
      ${personalInfo.github ? `<span><span class="cmd">$</span> <span class="str">${escapeHtml(personalInfo.github)}</span></span>` : ''}
      ${personalInfo.linkedin ? `<span><span class="cmd">$</span> <span class="str">${escapeHtml(personalInfo.linkedin)}</span></span>` : ''}
      ${personalInfo.website ? `<span><span class="cmd">$</span> <span class="str">${escapeHtml(personalInfo.website)}</span></span>` : ''}
    </div>
  </div>

  <div class="body-content">
    ${personalInfo.summary ? `<div class="summary-block">${escapeHtml(personalInfo.summary)}</div>` : ''}

    ${experience.length > 0 ? `<div class="section">
      <div class="section-title"><span class="section-bracket">//</span> Experience</div>
      ${experience.map(e => `<div class="entry">
        <div class="entry-header">
          <div><div class="entry-title">${escapeHtml(e.position)}</div><div class="entry-subtitle">${escapeHtml(e.company)}${e.location ? ` &middot; ${escapeHtml(e.location)}` : ''}</div></div>
          <div class="entry-date">${formatDate(e.startDate)} &ndash; ${e.current ? 'Present' : formatDate(e.endDate)}</div>
        </div>
        ${e.description ? `<div class="entry-desc">${escapeHtml(e.description)}</div>` : ''}
      </div>`).join('')}
    </div>` : ''}

    ${education.length > 0 ? `<div class="section">
      <div class="section-title"><span class="section-bracket">//</span> Education</div>
      ${education.map(ed => `<div class="entry">
        <div class="entry-header">
          <div><div class="entry-title">${escapeHtml(ed.degree)}</div><div class="entry-subtitle">${escapeHtml(ed.institution)}${ed.location ? ` &middot; ${escapeHtml(ed.location)}` : ''}</div></div>
          <div class="entry-date">${formatDate(ed.startDate)} &ndash; ${formatDate(ed.endDate)}</div>
        </div>
        ${ed.gpa ? `<div style="font-size:8.5pt;color:#22c55e;margin-top:2px;">GPA: ${escapeHtml(ed.gpa)}</div>` : ''}
      </div>`).join('')}
    </div>` : ''}

    ${Object.keys(skillGroups).length > 0 ? `<div class="section">
      <div class="section-title"><span class="section-bracket">//</span> Skills</div>
      ${Object.entries(skillGroups).map(([cat, sk]) => `<div class="skill-group">
        <div class="skill-cat">${escapeHtml(cat)}</div>
        <div class="skill-items">${sk.map(s => `<span class="skill-badge badge-${s.level}">${escapeHtml(s.name)}</span>`).join('')}</div>
      </div>`).join('')}
    </div>` : ''}

    ${projects.length > 0 ? `<div class="section">
      <div class="section-title"><span class="section-bracket">//</span> Projects</div>
      ${projects.map(p => `<div class="project-card">
        <div class="project-title">${escapeHtml(p.name)}</div>
        ${p.description ? `<div class="project-desc">${escapeHtml(p.description)}</div>` : ''}
        ${p.technologies ? `<div class="project-tech">${escapeHtml(p.technologies)}</div>` : ''}
      </div>`).join('')}
    </div>` : ''}

    ${certifications.length > 0 ? `<div class="section">
      <div class="section-title"><span class="section-bracket">//</span> Certifications</div>
      ${certifications.map(c => `<div class="cert-item">
        <span style="font-weight:600;color:#f0f6fc;font-size:9pt;">${escapeHtml(c.name)}</span>
        <span style="color:#8b949e;font-size:8.5pt;"> &mdash; ${escapeHtml(c.issuer)}${c.date ? `, ${formatDate(c.date)}` : ''}</span>
      </div>`).join('')}
    </div>` : ''}

    ${achievements.length > 0 ? `<div class="section">
      <div class="section-title"><span class="section-bracket">//</span> Achievements</div>
      ${achievements.map(a => `<div class="ach-item">
        <div><span class="ach-title">${escapeHtml(a.title)}</span>${a.date ? ` <span class="ach-date">${formatDate(a.date)}</span>` : ''}</div>
        ${a.description ? `<div class="ach-desc">${escapeHtml(a.description)}</div>` : ''}
      </div>`).join('')}
    </div>` : ''}
  </div>
</div>
</body>
</html>`;
}

function generateCorporateHTML(data: ResumeData): string {
  const { personalInfo, education, skills, experience, projects, certifications, achievements } = data;
  const skillGroups = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4; margin: 12mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #1f2937; font-size: 9.5pt; line-height: 1.55; }
  .page { width: 100%; }
  .header { background: #374151; color: #fff; padding: 22px 24px 18px; }
  .header-name { font-size: 22pt; font-weight: 700; letter-spacing: -0.3px; }
  .header-title { font-size: 11pt; color: #93c5fd; margin-top: 2px; font-weight: 400; }
  .header-contact { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 8px; font-size: 8.5pt; color: #d1d5db; }
  .header-contact span { white-space: nowrap; }
  .two-col { display: flex; gap: 20px; padding: 16px 0; }
  .col-left { width: 50%; }
  .col-right { width: 50%; }
  .full-width { padding: 0; }
  .section { margin-bottom: 16px; }
  .section-title { font-size: 10pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #374151; padding-bottom: 4px; border-bottom: 2px solid #3b6b96; margin-bottom: 10px; }
  .summary { font-size: 9pt; color: #4b5563; line-height: 1.6; margin-bottom: 14px; }
  .entry { margin-bottom: 12px; }
  .entry-header { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
  .entry-title { font-size: 10pt; font-weight: 600; color: #111827; }
  .entry-subtitle { font-size: 9pt; color: #6b7280; margin-top: 1px; }
  .entry-date { font-size: 8pt; color: #3b6b96; font-weight: 600; white-space: nowrap; flex-shrink: 0; }
  .entry-desc { font-size: 8.5pt; color: #4b5563; margin-top: 3px; line-height: 1.55; }
  .entry-loc { font-size: 8pt; color: #9ca3af; margin-top: 1px; }
  .skill-group { margin-bottom: 8px; }
  .skill-cat-title { font-size: 8.5pt; font-weight: 600; color: #374151; margin-bottom: 3px; }
  .skill-row { display: flex; flex-wrap: wrap; gap: 4px; }
  .skill-chip { display: inline-block; padding: 2px 8px; border: 1px solid #3b6b96; color: #3b6b96; border-radius: 3px; font-size: 7.5pt; font-weight: 500; }
  .project-item { margin-bottom: 10px; padding: 6px 8px; border: 1px solid #e5e7eb; border-radius: 4px; border-left: 3px solid #3b6b96; }
  .project-title { font-size: 9.5pt; font-weight: 600; color: #111827; }
  .project-desc { font-size: 8.5pt; color: #4b5563; margin-top: 2px; }
  .project-tech { font-size: 8pt; color: #3b6b96; margin-top: 2px; }
  .cert-item { margin-bottom: 8px; }
  .ach-item { margin-bottom: 8px; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="header-name">${escapeHtml(personalInfo.fullName || 'Your Name')}</div>
    <div class="header-title">${escapeHtml(personalInfo.jobTitle || 'Professional Title')}</div>
    <div class="header-contact">
      ${personalInfo.email ? `<span>${escapeHtml(personalInfo.email)}</span>` : ''}
      ${personalInfo.phone ? `<span>${escapeHtml(personalInfo.phone)}</span>` : ''}
      ${personalInfo.location ? `<span>${escapeHtml(personalInfo.location)}</span>` : ''}
      ${personalInfo.website ? `<span>${escapeHtml(personalInfo.website)}</span>` : ''}
      ${personalInfo.linkedin ? `<span>${escapeHtml(personalInfo.linkedin)}</span>` : ''}
      ${personalInfo.github ? `<span>${escapeHtml(personalInfo.github)}</span>` : ''}
    </div>
  </div>

  ${personalInfo.summary ? `<div class="full-width" style="padding:14px 0 0;"><div class="summary">${escapeHtml(personalInfo.summary)}</div></div>` : ''}

  <div class="two-col">
    <div class="col-left">
      ${experience.length > 0 ? `<div class="section">
        <div class="section-title">Experience</div>
        ${experience.map(e => `<div class="entry">
          <div class="entry-header">
            <div><div class="entry-title">${escapeHtml(e.position)}</div><div class="entry-subtitle">${escapeHtml(e.company)}</div></div>
            <div class="entry-date">${formatDate(e.startDate)} &ndash; ${e.current ? 'Present' : formatDate(e.endDate)}</div>
          </div>
          ${e.location ? `<div class="entry-loc">${escapeHtml(e.location)}</div>` : ''}
          ${e.description ? `<div class="entry-desc">${escapeHtml(e.description)}</div>` : ''}
        </div>`).join('')}
      </div>` : ''}

      ${projects.length > 0 ? `<div class="section">
        <div class="section-title">Projects</div>
        ${projects.map(p => `<div class="project-item">
          <div class="project-title">${escapeHtml(p.name)}</div>
          ${p.description ? `<div class="project-desc">${escapeHtml(p.description)}</div>` : ''}
          ${p.technologies ? `<div class="project-tech">${escapeHtml(p.technologies)}</div>` : ''}
        </div>`).join('')}
      </div>` : ''}
    </div>

    <div class="col-right">
      ${education.length > 0 ? `<div class="section">
        <div class="section-title">Education</div>
        ${education.map(ed => `<div class="entry">
          <div class="entry-header">
            <div><div class="entry-title">${escapeHtml(ed.degree)}</div><div class="entry-subtitle">${escapeHtml(ed.institution)}</div></div>
            <div class="entry-date">${formatDate(ed.startDate)} &ndash; ${formatDate(ed.endDate)}</div>
          </div>
          ${ed.location ? `<div class="entry-loc">${escapeHtml(ed.location)}</div>` : ''}
          ${ed.gpa ? `<div style="font-size:8.5pt;color:#3b6b96;margin-top:2px;">GPA: ${escapeHtml(ed.gpa)}</div>` : ''}
        </div>`).join('')}
      </div>` : ''}

      ${Object.keys(skillGroups).length > 0 ? `<div class="section">
        <div class="section-title">Skills</div>
        ${Object.entries(skillGroups).map(([cat, sk]) => `<div class="skill-group">
          <div class="skill-cat-title">${escapeHtml(cat)}</div>
          <div class="skill-row">${sk.map(s => `<span class="skill-chip">${escapeHtml(s.name)}</span>`).join('')}</div>
        </div>`).join('')}
      </div>` : ''}

      ${certifications.length > 0 ? `<div class="section">
        <div class="section-title">Certifications</div>
        ${certifications.map(c => `<div class="cert-item">
          <span style="font-weight:600;font-size:9pt;color:#111827;">${escapeHtml(c.name)}</span>
          <span style="font-size:8.5pt;color:#6b7280;"> &mdash; ${escapeHtml(c.issuer)}${c.date ? `, ${formatDate(c.date)}` : ''}</span>
        </div>`).join('')}
      </div>` : ''}

      ${achievements.length > 0 ? `<div class="section">
        <div class="section-title">Achievements</div>
        ${achievements.map(a => `<div class="ach-item">
          <div><span style="font-weight:600;font-size:9pt;color:#111827;">${escapeHtml(a.title)}</span>${a.date ? `<span style="font-size:8pt;color:#3b6b96;margin-left:6px;">${formatDate(a.date)}</span>` : ''}</div>
          ${a.description ? `<div class="entry-desc">${escapeHtml(a.description)}</div>` : ''}
        </div>`).join('')}
      </div>` : ''}
    </div>
  </div>
</div>
</body>
</html>`;
}

function generateElegantHTML(data: ResumeData): string {
  const { personalInfo, education, skills, experience, projects, certifications, achievements } = data;
  const skillGroups = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4; margin: 12mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Georgia, 'Palatino Linotype', Palatino, serif; color: #3d2b1f; font-size: 9.5pt; line-height: 1.6; }
  .page { width: 100%; }
  .header { background: #fdf2f8; border-bottom: 2px solid #e8a0b4; padding: 20px 24px 16px; }
  .header-name { font-size: 24pt; font-weight: 700; color: #8b4c6e; letter-spacing: 0.5px; }
  .header-title { font-size: 11pt; color: #c07a8e; margin-top: 2px; font-style: italic; }
  .header-contact { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 8px; font-size: 8.5pt; color: #9b7a8a; }
  .header-contact span { white-space: nowrap; }
  .body-content { padding: 16px 24px; }
  .section { margin-bottom: 18px; }
  .section-title { font-size: 10pt; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #8b4c6e; margin-bottom: 10px; padding-bottom: 4px; border-bottom: 1px solid #e8a0b4; }
  .summary { font-size: 9pt; color: #5a3e4b; line-height: 1.7; font-style: italic; margin-bottom: 4px; }
  .timeline { position: relative; padding-left: 18px; }
  .timeline-line { position: absolute; left: 5px; top: 6px; bottom: 6px; width: 2px; background: #e8a0b4; }
  .timeline-item { position: relative; margin-bottom: 14px; }
  .timeline-dot { position: absolute; left: -18px; top: 5px; width: 10px; height: 10px; border-radius: 50%; background: #e8a0b4; border: 2px solid #fdf2f8; }
  .entry-header { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
  .entry-title { font-size: 10pt; font-weight: 700; color: #8b4c6e; }
  .entry-subtitle { font-size: 9pt; color: #9b7a8a; margin-top: 1px; }
  .entry-date { font-size: 8pt; color: #c07a8e; font-style: italic; white-space: nowrap; flex-shrink: 0; }
  .entry-desc { font-size: 9pt; color: #5a3e4b; margin-top: 3px; line-height: 1.6; }
  .entry-loc { font-size: 8pt; color: #b0909e; margin-top: 1px; }
  .edu-entry { margin-bottom: 10px; padding: 6px 8px; background: #fdf2f8; border-radius: 6px; border: 1px solid #f5d5e0; }
  .skill-group { margin-bottom: 8px; }
  .skill-cat-title { font-size: 8.5pt; font-weight: 600; color: #8b4c6e; margin-bottom: 4px; }
  .skill-pills { display: flex; flex-wrap: wrap; gap: 4px; }
  .skill-pill { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 8pt; font-weight: 500; border: 1px solid #e8a0b4; color: #8b4c6e; background: #fdf2f8; }
  .project-entry { margin-bottom: 10px; padding: 8px 10px; background: #fdf2f8; border-radius: 6px; border: 1px solid #f5d5e0; border-left: 3px solid #e8a0b4; }
  .project-title { font-size: 9.5pt; font-weight: 700; color: #8b4c6e; }
  .project-desc { font-size: 8.5pt; color: #5a3e4b; margin-top: 3px; }
  .project-tech { font-size: 8pt; color: #c07a8e; margin-top: 3px; }
  .cert-entry { margin-bottom: 8px; }
  .ach-entry { margin-bottom: 8px; padding-left: 12px; border-left: 2px solid #e8a0b4; }
  .ach-title { font-size: 9pt; font-weight: 700; color: #8b4c6e; }
  .ach-desc { font-size: 8.5pt; color: #9b7a8a; margin-top: 2px; }
  .ach-date { font-size: 8pt; color: #c07a8e; font-style: italic; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="header-name">${escapeHtml(personalInfo.fullName || 'Your Name')}</div>
    <div class="header-title">${escapeHtml(personalInfo.jobTitle || 'Professional Title')}</div>
    <div class="header-contact">
      ${personalInfo.email ? `<span>${escapeHtml(personalInfo.email)}</span>` : ''}
      ${personalInfo.phone ? `<span>${escapeHtml(personalInfo.phone)}</span>` : ''}
      ${personalInfo.location ? `<span>${escapeHtml(personalInfo.location)}</span>` : ''}
      ${personalInfo.website ? `<span>${escapeHtml(personalInfo.website)}</span>` : ''}
      ${personalInfo.linkedin ? `<span>${escapeHtml(personalInfo.linkedin)}</span>` : ''}
      ${personalInfo.github ? `<span>${escapeHtml(personalInfo.github)}</span>` : ''}
    </div>
  </div>

  <div class="body-content">
    ${personalInfo.summary ? `<div class="section">
      <div class="summary">${escapeHtml(personalInfo.summary)}</div>
    </div>` : ''}

    ${experience.length > 0 ? `<div class="section">
      <div class="section-title">Experience</div>
      <div class="timeline">
        <div class="timeline-line"></div>
        ${experience.map(e => `<div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="entry-header">
            <div><div class="entry-title">${escapeHtml(e.position)}</div><div class="entry-subtitle">${escapeHtml(e.company)}</div></div>
            <div class="entry-date">${formatDate(e.startDate)} &ndash; ${e.current ? 'Present' : formatDate(e.endDate)}</div>
          </div>
          ${e.location ? `<div class="entry-loc">${escapeHtml(e.location)}</div>` : ''}
          ${e.description ? `<div class="entry-desc">${escapeHtml(e.description)}</div>` : ''}
        </div>`).join('')}
      </div>
    </div>` : ''}

    ${education.length > 0 ? `<div class="section">
      <div class="section-title">Education</div>
      ${education.map(ed => `<div class="edu-entry">
        <div class="entry-header">
          <div><div class="entry-title">${escapeHtml(ed.degree)}</div><div class="entry-subtitle">${escapeHtml(ed.institution)}</div></div>
          <div class="entry-date">${formatDate(ed.startDate)} &ndash; ${formatDate(ed.endDate)}</div>
        </div>
        ${ed.location ? `<div class="entry-loc">${escapeHtml(ed.location)}</div>` : ''}
        ${ed.gpa ? `<div style="font-size:8.5pt;color:#c07a8e;margin-top:2px;">GPA: ${escapeHtml(ed.gpa)}</div>` : ''}
        ${ed.description ? `<div class="entry-desc">${escapeHtml(ed.description)}</div>` : ''}
      </div>`).join('')}
    </div>` : ''}

    ${Object.keys(skillGroups).length > 0 ? `<div class="section">
      <div class="section-title">Skills</div>
      ${Object.entries(skillGroups).map(([cat, sk]) => `<div class="skill-group">
        <div class="skill-cat-title">${escapeHtml(cat)}</div>
        <div class="skill-pills">${sk.map(s => `<span class="skill-pill">${escapeHtml(s.name)}</span>`).join('')}</div>
      </div>`).join('')}
    </div>` : ''}

    ${projects.length > 0 ? `<div class="section">
      <div class="section-title">Projects</div>
      ${projects.map(p => `<div class="project-entry">
        <div class="project-title">${escapeHtml(p.name)}</div>
        ${p.description ? `<div class="project-desc">${escapeHtml(p.description)}</div>` : ''}
        ${p.technologies ? `<div class="project-tech">${escapeHtml(p.technologies)}</div>` : ''}
      </div>`).join('')}
    </div>` : ''}

    ${certifications.length > 0 ? `<div class="section">
      <div class="section-title">Certifications</div>
      ${certifications.map(c => `<div class="cert-entry">
        <span style="font-weight:600;font-size:9pt;color:#8b4c6e;">${escapeHtml(c.name)}</span>
        <span style="font-size:8.5pt;color:#9b7a8a;"> &mdash; ${escapeHtml(c.issuer)}${c.date ? `, ${formatDate(c.date)}` : ''}</span>
      </div>`).join('')}
    </div>` : ''}

    ${achievements.length > 0 ? `<div class="section">
      <div class="section-title">Achievements</div>
      ${achievements.map(a => `<div class="ach-entry">
        <div><span class="ach-title">${escapeHtml(a.title)}</span>${a.date ? ` <span class="ach-date">${formatDate(a.date)}</span>` : ''}</div>
        ${a.description ? `<div class="ach-desc">${escapeHtml(a.description)}</div>` : ''}
      </div>`).join('')}
    </div>` : ''}
  </div>
</div>
</body>
</html>`;
}

function generateDeveloperHTML(data: ResumeData): string {
  const { personalInfo, education, skills, experience, projects, certifications, achievements } = data;
  const skillGroups = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4; margin: 12mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #c9d1d9; font-size: 9pt; line-height: 1.55; background: #fff; }
  .page { width: 100%; }
  .terminal { background: #1a1e2e; border-radius: 8px 8px 0 0; padding: 10px 14px; display: flex; align-items: center; gap: 8px; }
  .terminal-dot { width: 10px; height: 10px; border-radius: 50%; }
  .dot-red { background: #ff5f56; }
  .dot-yellow { background: #ffbd2e; }
  .dot-green { background: #27c93f; }
  .terminal-title { font-family: 'Courier New', Courier, monospace; font-size: 8pt; color: #6b7280; margin-left: 4px; }
  .banner { background: #0d1117; padding: 18px 22px 16px; border-bottom: 2px solid #22c55e; }
  .banner-name { font-family: 'Courier New', Courier, monospace; font-size: 20pt; font-weight: 700; color: #f0f6fc; }
  .banner-title { font-family: 'Courier New', Courier, monospace; font-size: 10pt; color: #22c55e; margin-top: 2px; }
  .banner-contact { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 8px; font-family: 'Courier New', Courier, monospace; font-size: 8pt; color: #8b949e; }
  .banner-contact span { white-space: nowrap; }
  .prompt { color: #22c55e; }
  .body-content { padding: 14px 22px; }
  .section { margin-bottom: 14px; }
  .section-label { font-family: 'Courier New', Courier, monospace; font-size: 9pt; font-weight: 700; color: #1a1e2e; margin-bottom: 8px; padding: 4px 10px; background: #f1f5f9; border-left: 3px solid #22c55e; border-radius: 0 4px 4px 0; }
  .code-block { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 10px; margin-bottom: 10px; border-left: 3px solid #22c55e; }
  .entry-header { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
  .entry-title { font-family: 'Courier New', Courier, monospace; font-size: 9.5pt; font-weight: 700; color: #0d1117; }
  .entry-subtitle { font-size: 8.5pt; color: #6b7280; margin-top: 1px; }
  .entry-date { font-size: 8pt; color: #22c55e; font-family: 'Courier New', Courier, monospace; font-weight: 600; white-space: nowrap; flex-shrink: 0; }
  .entry-desc { font-size: 8.5pt; color: #4b5563; margin-top: 3px; }
  .entry-loc { font-size: 8pt; color: #9ca3af; margin-top: 1px; }
  .skill-group { margin-bottom: 8px; }
  .skill-cat { font-family: 'Courier New', Courier, monospace; font-size: 8pt; color: #22c55e; font-weight: 600; margin-bottom: 4px; }
  .skill-row { display: flex; flex-wrap: wrap; gap: 3px; }
  .skill-tag { font-family: 'Courier New', Courier, monospace; font-size: 7.5pt; padding: 2px 6px; background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; border-radius: 3px; }
  .project-block { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 10px; margin-bottom: 10px; }
  .project-title { font-family: 'Courier New', Courier, monospace; font-size: 9.5pt; font-weight: 700; color: #0d1117; }
  .project-desc { font-size: 8.5pt; color: #4b5563; margin-top: 3px; }
  .project-tech { font-family: 'Courier New', Courier, monospace; font-size: 8pt; color: #22c55e; margin-top: 3px; }
  .cert-item { margin-bottom: 6px; padding: 4px 8px; background: #f8fafc; border-radius: 4px; border: 1px solid #e2e8f0; }
  .ach-item { margin-bottom: 6px; padding-left: 10px; border-left: 2px solid #22c55e; }
  .ach-title { font-family: 'Courier New', Courier, monospace; font-size: 9pt; font-weight: 700; color: #0d1117; }
  .ach-desc { font-size: 8.5pt; color: #6b7280; margin-top: 2px; }
  .ach-date { font-size: 8pt; color: #22c55e; font-family: 'Courier New', Courier, monospace; }
  .summary-text { font-size: 9pt; color: #374151; line-height: 1.6; margin-bottom: 14px; padding: 8px 10px; background: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="page">
  <div class="terminal">
    <span class="terminal-dot dot-red"></span>
    <span class="terminal-dot dot-yellow"></span>
    <span class="terminal-dot dot-green"></span>
    <span class="terminal-title">resume.ts</span>
  </div>
  <div class="banner">
    <div class="banner-name">${escapeHtml(personalInfo.fullName || 'Your Name')}</div>
    <div class="banner-title">${escapeHtml(personalInfo.jobTitle || 'Full Stack Developer')}</div>
    <div class="banner-contact">
      ${personalInfo.email ? `<span><span class="prompt">&gt;</span> ${escapeHtml(personalInfo.email)}</span>` : ''}
      ${personalInfo.phone ? `<span><span class="prompt">&gt;</span> ${escapeHtml(personalInfo.phone)}</span>` : ''}
      ${personalInfo.location ? `<span><span class="prompt">&gt;</span> ${escapeHtml(personalInfo.location)}</span>` : ''}
      ${personalInfo.github ? `<span><span class="prompt">&gt;</span> ${escapeHtml(personalInfo.github)}</span>` : ''}
      ${personalInfo.linkedin ? `<span><span class="prompt">&gt;</span> ${escapeHtml(personalInfo.linkedin)}</span>` : ''}
      ${personalInfo.website ? `<span><span class="prompt">&gt;</span> ${escapeHtml(personalInfo.website)}</span>` : ''}
    </div>
  </div>

  <div class="body-content">
    ${personalInfo.summary ? `<div class="summary-text">${escapeHtml(personalInfo.summary)}</div>` : ''}

    ${experience.length > 0 ? `<div class="section">
      <div class="section-label">&gt; Experience</div>
      ${experience.map(e => `<div class="code-block">
        <div class="entry-header">
          <div><div class="entry-title">${escapeHtml(e.position)}</div><div class="entry-subtitle">${escapeHtml(e.company)}${e.location ? ` &middot; ${escapeHtml(e.location)}` : ''}</div></div>
          <div class="entry-date">${formatDate(e.startDate)} &ndash; ${e.current ? 'Present' : formatDate(e.endDate)}</div>
        </div>
        ${e.description ? `<div class="entry-desc">${escapeHtml(e.description)}</div>` : ''}
      </div>`).join('')}
    </div>` : ''}

    ${education.length > 0 ? `<div class="section">
      <div class="section-label">&gt; Education</div>
      ${education.map(ed => `<div class="code-block">
        <div class="entry-header">
          <div><div class="entry-title">${escapeHtml(ed.degree)}</div><div class="entry-subtitle">${escapeHtml(ed.institution)}${ed.location ? ` &middot; ${escapeHtml(ed.location)}` : ''}</div></div>
          <div class="entry-date">${formatDate(ed.startDate)} &ndash; ${formatDate(ed.endDate)}</div>
        </div>
        ${ed.gpa ? `<div style="font-size:8.5pt;color:#22c55e;margin-top:2px;font-family:'Courier New',Courier,monospace;">GPA: ${escapeHtml(ed.gpa)}</div>` : ''}
      </div>`).join('')}
    </div>` : ''}

    ${Object.keys(skillGroups).length > 0 ? `<div class="section">
      <div class="section-label">&gt; Skills</div>
      ${Object.entries(skillGroups).map(([cat, sk]) => `<div class="skill-group">
        <div class="skill-cat">${escapeHtml(cat)}</div>
        <div class="skill-row">${sk.map(s => `<span class="skill-tag">${escapeHtml(s.name)}</span>`).join('')}</div>
      </div>`).join('')}
    </div>` : ''}

    ${projects.length > 0 ? `<div class="section">
      <div class="section-label">&gt; Projects</div>
      ${projects.map(p => `<div class="project-block">
        <div class="project-title">${escapeHtml(p.name)}</div>
        ${p.description ? `<div class="project-desc">${escapeHtml(p.description)}</div>` : ''}
        ${p.technologies ? `<div class="project-tech">${escapeHtml(p.technologies)}</div>` : ''}
      </div>`).join('')}
    </div>` : ''}

    ${certifications.length > 0 ? `<div class="section">
      <div class="section-label">&gt; Certifications</div>
      ${certifications.map(c => `<div class="cert-item">
        <span style="font-weight:600;font-size:9pt;color:#0d1117;">${escapeHtml(c.name)}</span>
        <span style="font-size:8.5pt;color:#6b7280;"> &mdash; ${escapeHtml(c.issuer)}${c.date ? `, ${formatDate(c.date)}` : ''}</span>
      </div>`).join('')}
    </div>` : ''}

    ${achievements.length > 0 ? `<div class="section">
      <div class="section-label">&gt; Achievements</div>
      ${achievements.map(a => `<div class="ach-item">
        <div><span class="ach-title">${escapeHtml(a.title)}</span>${a.date ? ` <span class="ach-date">${formatDate(a.date)}</span>` : ''}</div>
        ${a.description ? `<div class="ach-desc">${escapeHtml(a.description)}</div>` : ''}
      </div>`).join('')}
    </div>` : ''}
  </div>
</div>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, template } = body as { data: ResumeData; template: string };

    if (!data || !data.personalInfo) {
      return NextResponse.json({ error: 'Missing resume data' }, { status: 400 });
    }

    let html: string;
    switch (template) {
      case 'classic':
        html = generateClassicHTML(data);
        break;
      case 'creative':
        html = generateCreativeHTML(data);
        break;
      case 'infographic':
        html = generateInfographicHTML(data);
        break;
      case 'academic':
        html = generateAcademicHTML(data);
        break;
      case 'freelancer':
        html = generateFreelancerHTML(data);
        break;
      case 'executive':
        html = generateExecutiveHTML(data);
        break;
      case 'minimalist':
        html = generateMinimalistHTML(data);
        break;
      case 'tech':
        html = generateTechHTML(data);
        break;
      case 'corporate':
        html = generateCorporateHTML(data);
        break;
      case 'elegant':
        html = generateElegantHTML(data);
        break;
      case 'developer':
        html = generateDeveloperHTML(data);
        break;
      case 'modern':
      default:
        html = generateModernHTML(data);
        break;
    }

    // Use Playwright to generate PDF via html2pdf-next.js
    const { execFile } = await import('child_process');
    const { writeFile, unlink, mkdtemp } = await import('fs/promises');
    const { tmpdir } = await import('os');
    const { join } = await import('path');

    const tmpDir = await mkdtemp(join(tmpdir(), 'resume-'));
    const htmlPath = join(tmpDir, `resume-${Date.now()}.html`);
    const pdfPath = join(tmpDir, `resume-${Date.now()}.pdf`);

    await writeFile(htmlPath, html, 'utf-8');

    // Check for PDF skill scripts
    const pdfSkillDir = process.env.PDF_SKILL_DIR;
    const html2pdfScript = pdfSkillDir
      ? join(pdfSkillDir, 'scripts', 'html2pdf-next.js')
      : null;

    if (html2pdfScript) {
      try {
        await new Promise<void>((resolve, reject) => {
          execFile(
            'node',
            [html2pdfScript, htmlPath, '--output', pdfPath],
            { timeout: 30000 },
            (error) => {
              if (error) reject(error);
              else resolve();
            }
          );
        });
      } catch {
        // Fallback: generate PDF from HTML using Puppeteer directly
        await generatePdfWithPuppeteer(htmlPath, pdfPath);
      }
    } else {
      await generatePdfWithPuppeteer(htmlPath, pdfPath);
    }

    const pdfBuffer = await import('fs/promises').then(fs => fs.readFile(pdfPath));

    // Cleanup
    try { await unlink(htmlPath); } catch {}
    try { await unlink(pdfPath); } catch {}

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${(data.personalInfo.fullName || 'resume').replace(/\s+/g, '_')}_Resume.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

async function generatePdfWithPuppeteer(htmlPath: string, pdfPath: string) {
  const puppeteer = await import('puppeteer-core');
  const chromium = await import('@sparticuz/chromium');
  
  const browser = await puppeteer.default.launch({
    args: chromium.default.args,
    defaultViewport: chromium.default.defaultViewport,
    executablePath: await chromium.default.executablePath(),
    headless: chromium.default.headless === true ? true : "new",
  });
  
  const page = await browser.newPage();
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
  });
  await browser.close();
}
