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
        // Fallback: generate PDF from HTML using Playwright directly
        await generatePdfWithPlaywright(htmlPath, pdfPath);
      }
    } else {
      await generatePdfWithPlaywright(htmlPath, pdfPath);
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

async function generatePdfWithPlaywright(htmlPath: string, pdfPath: string) {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
  });
  await browser.close();
}
