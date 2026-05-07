import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import type { ResumeData } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, field, section } = body as {
      data: ResumeData;
      field?: string;
      section?: string;
    };

    if (!data) {
      return NextResponse.json({ error: 'Missing resume data' }, { status: 400 });
    }

    const zai = await ZAI.create();

    // Build context from resume data for AI
    const context = buildResumeContext(data, section, field);

    const systemPrompt = `You are an expert resume writer and career coach. You provide specific, actionable suggestions to improve resumes. 
Your suggestions should be:
- Professional and industry-standard
- Specific to the user's field and experience
- Action-oriented with measurable results
- Concise (2-4 sentences max per suggestion)
- Written in a helpful, encouraging tone

Format your response as clean JSON with this structure:
{
  "suggestions": [
    {
      "section": "summary",
      "field": "summary",
      "current": "current text here",
      "improved": "improved text here",
      "reason": "Why this improves the resume"
    }
  ]
}

Provide 3-5 suggestions. If a specific section/field is requested, focus on that area.
Always respond with valid JSON only, no markdown or extra text.`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemPrompt },
        {
          role: 'user',
          content: `Please analyze this resume data and provide improvement suggestions.\n\n${context}`,
        },
      ],
      thinking: { type: 'disabled' },
    });

    const responseText = completion.choices[0]?.message?.content || '';

    // Try to parse JSON from response
    let suggestions;
    try {
      // Clean up response - extract JSON if wrapped in markdown code blocks
      const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      suggestions = JSON.parse(cleaned);
    } catch {
      suggestions = {
        suggestions: [
          {
            section: section || 'general',
            field: field || 'general',
            current: '',
            improved: responseText,
            reason: 'AI-generated suggestion',
          },
        ],
      };
    }

    return NextResponse.json({ success: true, suggestions });
  } catch (error) {
    console.error('AI suggestion error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI suggestions' },
      { status: 500 }
    );
  }
}

function buildResumeContext(data: ResumeData, section?: string, field?: string): string {
  const { personalInfo, education, skills, experience, projects, certifications, achievements } = data;

  let context = `## Current Resume Data\n\n`;

  if (personalInfo.fullName) {
    context += `**Name:** ${personalInfo.fullName}\n`;
    context += `**Title:** ${personalInfo.jobTitle}\n`;
    if (personalInfo.summary) context += `**Summary:** ${personalInfo.summary}\n`;
  }

  if (experience.length > 0) {
    context += `\n### Experience\n`;
    experience.forEach((e) => {
      context += `- ${e.position} at ${e.company} (${e.startDate} - ${e.current ? 'Present' : e.endDate})\n`;
      if (e.description) context += `  Description: ${e.description}\n`;
    });
  }

  if (education.length > 0) {
    context += `\n### Education\n`;
    education.forEach((e) => {
      context += `- ${e.degree} from ${e.institution} (${e.startDate} - ${e.endDate})\n`;
    });
  }

  if (skills.length > 0) {
    context += `\n### Skills\n`;
    skills.forEach((s) => {
      context += `- ${s.name} (${s.level}) [${s.category}]\n`;
    });
  }

  if (projects.length > 0) {
    context += `\n### Projects\n`;
    projects.forEach((p) => {
      context += `- ${p.name}: ${p.description}\n`;
      if (p.technologies) context += `  Technologies: ${p.technologies}\n`;
    });
  }

  if (certifications.length > 0) {
    context += `\n### Certifications\n`;
    certifications.forEach((c) => {
      context += `- ${c.name} from ${c.issuer}\n`;
    });
  }

  if (achievements.length > 0) {
    context += `\n### Achievements\n`;
    achievements.forEach((a) => {
      context += `- ${a.title}: ${a.description}\n`;
    });
  }

  if (section) {
    context += `\n\n## Focus Area\nPlease provide specific suggestions for the "${section}" section${field ? `, specifically the "${field}" field` : ''}.`;
  } else {
    context += `\n\n## Focus Area\nPlease provide suggestions across all sections of this resume.`;
  }

  return context;
}
