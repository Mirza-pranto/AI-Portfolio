'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Globe, Sparkles, ArrowUpRight, FolderGit2, ArrowRight } from 'lucide-react';
import { usePortfolioStore } from '@/lib/store';
import { portfolioData } from '@/lib/data';

// Helper to normalize and check if a skill matches a project tag
function isSkillMatchingTag(skillName: string, tag: string): boolean {
  const normSkill = skillName.toLowerCase().replace(/[\s\-_.]/g, '');
  const normTag = tag.toLowerCase().replace(/[\s\-_.]/g, '');

  if (normSkill === normTag) return true;
  if (normSkill.includes(normTag) || normTag.includes(normSkill)) return true;

  // Common aliases
  if ((normSkill === 'reactjs' || normSkill === 'react') && (normTag === 'react' || normTag === 'mern')) return true;
  if (normSkill === 'nodejs' && (normTag === 'node' || normTag === 'mern')) return true;
  if (normSkill === 'expressjs' && (normTag === 'express' || normTag === 'mern')) return true;
  if (normSkill.includes('llama') && normTag.includes('llama')) return true;
  if (normSkill.includes('rag') && normTag.includes('rag')) return true;
  if (normSkill.includes('lora') && normTag.includes('lora')) return true;
  if (normSkill.includes('mcp') && normTag.includes('mcp')) return true;
  if (normSkill.includes('langgraph') && normTag.includes('langgraph')) return true;
  if (normSkill.includes('langchain') && normTag.includes('langchain')) return true;
  if (normSkill.includes('chromadb') && normTag.includes('chroma')) return true;
  if (normSkill.includes('bert') && normTag.includes('bert')) return true;
  if (normSkill.includes('lstm') && normTag.includes('lstm')) return true;
  if (normSkill.includes('gru') && normTag.includes('gru')) return true;
  if (normSkill.includes('fastapi') && normTag.includes('fastapi')) return true;
  if (normSkill.includes('streamlit') && normTag.includes('streamlit')) return true;
  if (normSkill.includes('docker') && normTag.includes('docker')) return true;
  if (normSkill.includes('neo4j') && normTag.includes('neo4j')) return true;
  if (normSkill.includes('supabase') && normTag.includes('supabase')) return true;
  if (normSkill.includes('mongodb') && (normTag === 'mongodb' || normTag === 'mern')) return true;

  return false;
}

export default function ExpandedDetailView() {
  const { expandedItemType, expandedItemId, clearExpandedItem, setExpandedItem } = usePortfolioStore();

  if (!expandedItemType || !expandedItemId) {
    return null;
  }

  // Lookup item data from portfolioData
  let item: any = null;
  let matchingProjects: typeof portfolioData.projects = [];

  if (expandedItemType === 'skill') {
    const skillName = expandedItemId;
    matchingProjects = portfolioData.projects.filter((p) =>
      p.tags.some((tag) => isSkillMatchingTag(skillName, tag))
    );

    item = {
      isSkillView: true,
      skillName,
      title: `Projects using ${skillName}`,
      subtitle: 'Skill Deep Dive',
      emoji: '⚡',
      gradient: 'from-indigo-600 via-blue-600 to-cyan-600',
    };
  } else if (expandedItemType === 'project') {
    item = portfolioData.projects.find((p) => String(p.id) === String(expandedItemId));
  } else if (expandedItemType === 'fun') {
    const sections = (portfolioData.fun as any).sections || [];
    const section = sections.find((s: any) => String(s.id) === String(expandedItemId));
    if (section) {
      item = {
        title: section.title,
        subtitle: section.subtitle,
        emoji: section.emoji,
        image: section.image || null,
        gradient: section.gradient || 'from-amber-600 to-orange-600',
        tags: section.tags || [],
        description: section.description,
        longDescription: section.description,
        links: null,
      };
    }
  } else if (expandedItemType === 'education') {
    const edu = portfolioData.education.find((e) => String(e.id) === String(expandedItemId));
    if (edu) {
      item = {
        title: edu.degree,
        subtitle: `${edu.institution} • ${edu.location}`,
        emoji: '🎓',
        image: edu.image || null,
        logo: edu.logo || null,
        gradient: 'from-blue-600 via-indigo-600 to-violet-600',
        tags: [edu.institution, edu.duration, edu.location],
        description: edu.details,
        longDescription: `Institution: ${edu.institution}\nDegree: ${edu.degree}\nDuration: ${edu.duration}\nLocation: ${edu.location}\n\nAcademic Details & Honors:\n${edu.details}`,
        links: null,
      };
    }
  } else if (expandedItemType === 'experience') {
    const exp = portfolioData.experience.find((e) => String(e.id) === String(expandedItemId));
    if (exp) {
      item = {
        title: exp.role,
        subtitle: `${exp.company} • ${exp.location}`,
        emoji: '💼',
        image: exp.image || null,
        logo: exp.logo || null,
        gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
        tags: [exp.company, exp.duration, exp.location],
        description: exp.details,
        longDescription: `Role: ${exp.role}\nOrganization: ${exp.company}\nDuration: ${exp.duration}\nLocation: ${exp.location}\n\nKey Responsibilities & Impact:\n${exp.details}`,
        links: {
          live: (exp as any).links?.website || 'https://linkedin.com/in/mirza-julkawsar-264752273',
          facebook: (exp as any).links?.facebook,
          instagram: (exp as any).links?.instagram,
          website: (exp as any).links?.website,
        },
      };
    }
  }

  if (!item) {
    return null;
  }

  // Handle clicking a mini-project card to switch to that project's deep dive
  const handleProjectSelect = (projId: string | number) => {
    setExpandedItem('project', projId);
    setTimeout(() => {
      const detailElement = document.getElementById('expanded-detail-view');
      if (detailElement) {
        detailElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  return (
    <AnimatePresence>
      <motion.div
        id="expanded-detail-view"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-4xl mx-auto px-4 sm:px-6 mt-12 mb-8"
      >
        <div className="relative">
          {/* Top cover image or gradient banner */}
          <div
            className={`relative w-full h-44 sm:h-56 rounded-3xl ${
              item.image ? 'bg-zinc-900' : `bg-gradient-to-br ${item.gradient || 'from-indigo-600 to-purple-600'}`
            } flex items-center justify-center overflow-hidden shadow-md mb-8`}
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                {/* Subtle overlay texture */}
                <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />

                {/* Central icon or emoji */}
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-5xl sm:text-6xl drop-shadow-md">
                    {item.emoji || '🚀'}
                  </span>
                </div>
              </>
            )}

            {/* Close button in top-right */}
            <button
              onClick={clearExpandedItem}
              aria-label="Close detail view"
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Content Body */}
          <div>
            {/* Subtitle & Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                {item.logo && (
                  <div className="w-7 h-7 rounded-md overflow-hidden border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-0.5 flex items-center justify-center flex-shrink-0">
                    <img
                      src={item.logo}
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {item.subtitle || (expandedItemType === 'project' ? 'Featured Project' : 'Activity')}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                {expandedItemType === 'project'
                  ? 'Project Details'
                  : expandedItemType === 'education'
                  ? 'Academic Details'
                  : expandedItemType === 'experience'
                  ? 'Professional Experience'
                  : expandedItemType === 'skill'
                  ? 'Skill Project Showcase'
                  : 'Behind the Scenes'}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
              {item.title}
            </h3>

            {/* --- SKILL SPECIFIC VIEW: Render matching project grid --- */}
            {expandedItemType === 'skill' ? (
              <div className="mt-6 mb-8">
                {matchingProjects.length > 0 ? (
                  <>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                      Found <span className="font-semibold text-zinc-900 dark:text-white">{matchingProjects.length}</span> {matchingProjects.length === 1 ? 'project' : 'projects'} built with{' '}
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">{item.skillName}</span>. Click any card to explore the full architecture.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {matchingProjects.map((proj) => (
                        <motion.div
                          key={proj.id}
                          whileHover={{ y: -3 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleProjectSelect(proj.id)}
                          className="group p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-zinc-600 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                {proj.subtitle}
                              </span>
                              <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                            </div>
                            <h5 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                              {proj.title}
                            </h5>
                            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 line-clamp-3 leading-relaxed mb-4">
                              {proj.description}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/80">
                            {proj.tags.map((t) => {
                              const isTargetSkill = isSkillMatchingTag(item.skillName, t);
                              return (
                                <span
                                  key={t}
                                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${
                                    isTargetSkill
                                      ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                                      : 'bg-zinc-200/70 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                                  }`}
                                >
                                  {t}
                                </span>
                              );
                            })}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 text-center max-w-xl mx-auto my-6">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
                      <FolderGit2 className="w-6 h-6" />
                    </div>
                    <h5 className="text-base font-semibold text-zinc-900 dark:text-white mb-1">
                      No standalone projects tagged with {item.skillName} yet
                    </h5>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      While not highlighted in a standalone card above, {item.skillName} is part of my active engineering toolkit and used across smaller experiments and research workflows!
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* --- STANDARD EXPANDED VIEW: Render Tags & Long Description --- */
              <>
                {/* Technology / Tag pills */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {item.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="bg-zinc-900 text-white dark:bg-zinc-800 dark:text-zinc-200 px-3.5 py-1.5 rounded-full text-xs font-medium shadow-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Detailed Description with markdown-style section headings & bold highlights */}
                <div className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-base sm:text-lg mb-8 max-w-3xl space-y-4">
                  {(item.longDescription || item.description || '')
                    .split('\n\n')
                    .map((paragraph: string, idx: number) => {
                      const trimmed = paragraph.trim();
                      if (!trimmed) return null;

                      // Handle bold section headings like **Overview** or **Key Features**
                      if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.includes('\n')) {
                        const headingText = trimmed.slice(2, -2);
                        return (
                          <h4
                            key={idx}
                            className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white pt-2 first:pt-0"
                          >
                            {headingText}
                          </h4>
                        );
                      }

                      // Handle bullet lists
                      if (trimmed.includes('\n- ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
                        const lines = trimmed.split('\n');
                        return (
                          <ul key={idx} className="space-y-2 pl-1 my-2">
                            {lines.map((line: string, lineIdx: number) => {
                              const cleanLine = line.replace(/^[-•]\s*/, '').trim();
                              if (!cleanLine) return null;

                              // Parse **bold** prefixes inside bullets
                              const boldMatch = cleanLine.match(/^\*\*([^*]+)\*\*:(.*)$/);
                              if (boldMatch) {
                                return (
                                  <li key={lineIdx} className="flex items-start gap-2.5 text-sm sm:text-base">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                                    <div>
                                      <strong className="font-semibold text-zinc-900 dark:text-white">
                                        {boldMatch[1]}:
                                      </strong>
                                      <span className="text-zinc-600 dark:text-zinc-300 ml-1">
                                        {boldMatch[2]}
                                      </span>
                                    </div>
                                  </li>
                                );
                              }

                              return (
                                <li key={lineIdx} className="flex items-start gap-2.5 text-sm sm:text-base">
                                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                                  <span className="text-zinc-600 dark:text-zinc-300">{cleanLine}</span>
                                </li>
                              );
                            })}
                          </ul>
                        );
                      }

                      // Standard paragraph text
                      return (
                        <p key={idx} className="text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
                          {trimmed}
                        </p>
                      );
                    })}
                </div>
              </>
            )}

            {/* Action Buttons & Links */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-200 dark:border-zinc-800">
              <div className="flex flex-wrap items-center gap-3">
                {item.links?.website && (
                  <a
                    href={item.links.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all cursor-pointer"
                  >
                    <Globe className="w-4 h-4" />
                    Official Website
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
                  </a>
                )}
                {item.links?.facebook && (
                  <a
                    href={item.links.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#1877F2] hover:bg-[#166fe5] text-white shadow-sm transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook Page
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
                  </a>
                )}
                {item.links?.instagram && (
                  <a
                    href={item.links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-90 text-white shadow-sm transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    Instagram
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
                  </a>
                )}
                {item.links?.github && (
                  <a
                    href={item.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm transition-all cursor-pointer"
                  >
                    <Globe className="w-4 h-4" />
                    GitHub Source
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
                  </a>
                )}
                {item.links?.live && !item.links?.website && (
                  <a
                    href={item.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live Link
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
                  </a>
                )}
              </div>

              {/* Close button */}
              <button
                onClick={clearExpandedItem}
                className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
