'use client';

import React, { Suspense, lazy } from 'react';
import { useAppStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// Lazy load components
const LandingPage = lazy(() => import('@/components/landing/LandingPage'));
const ResumeWizard = lazy(() => import('@/components/resume-builder/ResumeWizard'));
const ClassicTemplate = lazy(() => import('@/components/resume-templates/ClassicTemplate'));
const ModernTemplate = lazy(() => import('@/components/resume-templates/ModernTemplate'));
const CreativeTemplate = lazy(() => import('@/components/resume-templates/CreativeTemplate'));
const ExecutiveTemplate = lazy(() => import('@/components/resume-templates/ExecutiveTemplate'));
const MinimalistTemplate = lazy(() => import('@/components/resume-templates/MinimalistTemplate'));
const TechTemplate = lazy(() => import('@/components/resume-templates/TechTemplate'));
const InfographicTemplate = lazy(() => import('@/components/resume-templates/InfographicTemplate'));
const AcademicTemplate = lazy(() => import('@/components/resume-templates/AcademicTemplate'));
const FreelancerTemplate = lazy(() => import('@/components/resume-templates/FreelancerTemplate'));
const CorporateTemplate = lazy(() => import('@/components/resume-templates/CorporateTemplate'));
const ElegantTemplate = lazy(() => import('@/components/resume-templates/ElegantTemplate'));
const DeveloperTemplate = lazy(() => import('@/components/resume-templates/DeveloperTemplate'));
const PortfolioPreview = lazy(() => import('@/components/portfolio/PortfolioPreview'));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
    </div>
  );
}

function ResumePreviewView() {
  const { resumeData, selectedTemplate, setCurrentView, setCurrentStep } = useAppStore();

  const TemplateComponent = {
    classic: ClassicTemplate,
    modern: ModernTemplate,
    creative: CreativeTemplate,
    executive: ExecutiveTemplate,
    minimalist: MinimalistTemplate,
    tech: TechTemplate,
    infographic: InfographicTemplate,
    academic: AcademicTemplate,
    freelancer: FreelancerTemplate,
    corporate: CorporateTemplate,
    elegant: ElegantTemplate,
    developer: DeveloperTemplate,
  }[selectedTemplate];

  const handleDownloadPdf = async () => {
    try {
      const element = document.querySelector('#resume-preview-content') as HTMLElement;
      if (!element) throw new Error('Preview element not found');

      // Use dynamic imports for client-side libraries
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      // Temporarily remove constraints for full-quality capture
      const originalStyle = element.getAttribute('style') || '';
      element.style.maxHeight = 'none';
      element.style.overflow = 'visible';
      element.style.height = 'auto';

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      // Restore original styles
      element.setAttribute('style', originalStyle);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${(resumeData.personalInfo.fullName || 'resume').replace(/\s+/g, '_')}_Resume.pdf`);
    } catch (error) {
      console.error('Client-side download error, trying server fallback:', error);
      try {
        const response = await fetch('/api/generate-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: resumeData, template: selectedTemplate }),
        });

        if (!response.ok) throw new Error('Server-side PDF generation failed');

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(resumeData.personalInfo.fullName || 'resume').replace(/\s+/g, '_')}_Resume.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (fallbackError) {
        console.error('All download methods failed:', fallbackError);
        const confirmPrint = confirm('Direct PDF generation failed due to browser/server limits. Would you like to use the browser print menu to save as PDF instead? (Recommended fallback)');
        if (confirmPrint) {
          window.print();
        }
      }
    }
  };

  const handleAiSuggest = async () => {
    try {
      const store = useAppStore.getState();
      store.setIsAiLoading(true);
      store.setAiSuggestion(null);

      const response = await fetch('/api/ai-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: resumeData }),
      });

      if (!response.ok) throw new Error('AI suggestion failed');

      const result = await response.json();
      if (result.suggestions && result.suggestions.suggestions) {
        const text = result.suggestions.suggestions
          .map((s: { improved?: string; reason?: string; section?: string }) => {
            return `**${s.section || 'General'}**: ${s.improved || ''}\n_Reason: ${s.reason || ''}_`;
          })
          .join('\n\n');
        store.setAiSuggestion(text);
      } else {
        store.setAiSuggestion(JSON.stringify(result.suggestions, null, 2));
      }
    } catch (error) {
      console.error('AI suggest error:', error);
    } finally {
      useAppStore.getState().setIsAiLoading(false);
    }
  };

  const applyAiSuggestion = (suggestion: string) => {
    // Parse the suggestion and try to apply it to the summary field
    const match = suggestion.match(/\*\*(\w+)\*\*:\s*(.+?)(?:\n|$)/);
    if (match && match[1].toLowerCase() === 'summary' && match[2]) {
      useAppStore.getState().updatePersonalInfo({ summary: match[2] });
      useAppStore.getState().setAiSuggestion(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-950 dark:to-slate-900">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 pt-[env(safe-area-inset-top)] print:hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <button
              onClick={() => setCurrentView('landing')}
              className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent hover:from-emerald-500 hover:to-teal-500 transition-all"
            >
              ResumeAI
            </button>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => { setCurrentStep(0); setCurrentView('builder'); }}
                className="px-3 py-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Edit Resume
              </button>
              <button
                onClick={() => setCurrentView('portfolio')}
                className="px-3 py-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Portfolio
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Resume Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 print:p-0 print:m-0"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden print:shadow-none print:rounded-none">
              <div className="p-1 print:p-0">
                <div id="resume-preview-content" className="overflow-auto max-h-[60vh] sm:max-h-[75vh] lg:max-h-[85vh] print:max-h-none print:overflow-visible">
                  {TemplateComponent && (
                    <Suspense fallback={<LoadingFallback />}>
                      <TemplateComponent data={resumeData} />
                    </Suspense>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-80 space-y-4 print:hidden"
          >
            {/* Template Switcher */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Resume Template</h3>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    ['classic', 'Classic'],
                    ['modern', 'Modern'],
                    ['creative', 'Creative'],
                    ['executive', 'Executive'],
                    ['minimalist', 'Minimalist'],
                    ['tech', 'Tech'],
                    ['infographic', 'Infographic'],
                    ['academic', 'Academic'],
                    ['freelancer', 'Freelancer'],
                    ['corporate', 'Corporate'],
                    ['elegant', 'Elegant'],
                    ['developer', 'Developer'],
                  ] as const
                ).map(([t, label]) => (
                  <button
                    key={t}
                    onClick={() => useAppStore.getState().setSelectedTemplate(t)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedTemplate === t
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 ring-2 ring-emerald-500'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleDownloadPdf}
                  className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Download PDF
                </button>
                <button
                  onClick={handleAiSuggest}
                  disabled={useAppStore.getState().isAiLoading}
                  className="w-full py-3 px-4 bg-white dark:bg-slate-700 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 font-medium rounded-lg transition-all hover:bg-emerald-50 dark:hover:bg-slate-600 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  {useAppStore.getState().isAiLoading ? 'Analyzing...' : 'AI Suggestions'}
                </button>
              </div>
            </div>

            {/* AI Suggestions Panel */}
            <AnimatePresence>
              {useAppStore.getState().aiSuggestion && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-emerald-200 dark:border-emerald-800 overflow-hidden"
                >
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">AI Suggestions</h3>
                      <button
                        onClick={() => useAppStore.getState().setAiSuggestion(null)}
                        className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 text-xs"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-xs">
                      {useAppStore.getState().aiSuggestion}
                    </div>
                    <button
                      onClick={() => {
                        const s = useAppStore.getState().aiSuggestion;
                        if (s) applyAiSuggestion(s);
                      }}
                      className="mt-3 w-full py-2 px-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                    >
                      Apply to Summary
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Info */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl p-6 border border-emerald-100 dark:border-emerald-900/50">
              <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-2">Pro Tips</h3>
              <ul className="space-y-2 text-xs text-emerald-700 dark:text-emerald-400">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-emerald-500">&#9679;</span>
                  Use action verbs to start bullet points
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-emerald-500">&#9679;</span>
                  Quantify achievements with numbers
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-emerald-500">&#9679;</span>
                  Tailor resume for each job application
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-emerald-500">&#9679;</span>
                  Keep it to 1-2 pages maximum
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function PortfolioView() {
  const { resumeData, setCurrentView } = useAppStore();

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => setCurrentView('landing')}
              className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent"
            >
              ResumeAI
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('preview')}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-emerald-400 transition-colors"
              >
                Resume Preview
              </button>
              <button
                onClick={() => { useAppStore.getState().setCurrentStep(0); setCurrentView('builder'); }}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-emerald-400 transition-colors"
              >
                Edit Resume
              </button>
            </div>
          </div>
        </div>
      </nav>
      <Suspense fallback={<LoadingFallback />}>
        <PortfolioPreview data={resumeData} />
      </Suspense>
    </div>
  );
}

export default function Home() {
  const { currentView } = useAppStore();

  return (
    <main className="min-h-screen">
      <AnimatePresence mode="wait">
        {currentView === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <LandingPage />
            </Suspense>
          </motion.div>
        )}
        {currentView === 'builder' && (
          <motion.div
            key="builder"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <ResumeWizard />
            </Suspense>
          </motion.div>
        )}
        {currentView === 'preview' && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <ResumePreviewView />
          </motion.div>
        )}
        {currentView === 'portfolio' && (
          <motion.div
            key="portfolio"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <PortfolioView />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
