import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ImageSlot } from '../../components/ui/ImageSlot';
import { mockPublishedProjects, mockCategories, mockTags } from '../../services/demo/data';
import { Search, Filter, ArrowRight, FileText, ExternalLink } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { t, lang } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedTag, setSelectedTag] = useState('');

  const filteredProjects = mockPublishedProjects.filter((p) => {
    // Only is_visible = true projects ever show publicly (PRD BR-02, BR-03)
    if (!p.is_visible) return false;

    if (selectedCategory && p.category_slug !== selectedCategory) {
      return false;
    }
    if (selectedTag && !p.tag_slugs.includes(selectedTag)) {
      return false;
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q) || (p.title_ur && p.title_ur.includes(q));
      const matchDesc = p.short_description.toLowerCase().includes(q);
      const matchOwner = p.owner_display_name.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchOwner) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="max-w-3xl space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text)]">
          {t('nav.projects')}
        </h1>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          Explore production digital solutions engineered and designed by Inspire Academy members. Every project displayed here has been reviewed, quality checked, and approved by academy faculty.
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute start-3 top-3 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search projects, technologies, or authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs ps-9 pe-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSearchParams(e.target.value ? { category: e.target.value } : {});
            }}
            className="text-xs px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] font-medium outline-none"
          >
            <option value="">All Categories</option>
            {mockCategories.map((c) => (
              <option key={c.id} value={c.slug}>
                {lang === 'ur' && c.name_ur ? c.name_ur : c.name_en}
              </option>
            ))}
          </select>

          {/* Tag Filter */}
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="text-xs px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] font-medium outline-none"
          >
            <option value="">All Technologies</option>
            {mockTags.map((t) => (
              <option key={t.id} value={t.slug}>
                {t.name_en}
              </option>
            ))}
          </select>

          {(selectedCategory || selectedTag || searchTerm) && (
            <button
              onClick={() => {
                setSelectedCategory('');
                setSelectedTag('');
                setSearchTerm('');
                setSearchParams({});
              }}
              className="text-xs text-rose-500 hover:underline px-2"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-[var(--text)]">No approved projects match your filters</p>
          <p className="text-xs text-[var(--text-muted)]">Try selecting another category or clearing search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length === 0 && <p className="col-span-full py-12 text-center text-sm text-[var(--text-muted)]">No projects have been added yet.</p>}
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.slug}`}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-indigo-400/50"
            >
              <ImageSlot
                src={project.cover_public_path}
                alt={project.title}
                aspect="16/10"
                fallbackText={project.title}
                badge={project.category_name}
              />
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <span>By {project.owner_display_name}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Published</span>
                  </div>
                  <h3 className="font-bold text-base text-[var(--text)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {lang === 'ur' && project.title_ur ? project.title_ur : project.title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                    {lang === 'ur' && project.short_description_ur ? project.short_description_ur : project.short_description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag.slug} className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--surface-2)] text-[var(--text-muted)] font-medium">
                        {tag.name_en}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                    View
                    <ArrowRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
