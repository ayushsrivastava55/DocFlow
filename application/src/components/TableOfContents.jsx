import React, { useState } from 'react';
import { useDocumentation } from '../context/DocumentationContext';

const TableOfContents = () => {
  const [expandedSections, setExpandedSections] = useState(new Set());
  const { documentation } = useDocumentation();

  const toggleSection = (sectionTitle) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionTitle)) {
      newExpanded.delete(sectionTitle);
    } else {
      newExpanded.add(sectionTitle);
    }
    setExpandedSections(newExpanded);
  };

  const renderSectionLink = (section, level = 0) => {
    const sectionId = section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const hasSubsections = section.subsections && section.subsections.length > 0;
    const isExpanded = expandedSections.has(section.title);

    return (
      <div key={section.title} className={`ml-${level * 4}`}>
        <div className="flex items-center group">
          {hasSubsections && (
            <button
              onClick={() => toggleSection(section.title)}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
          <a
            href={`#${sectionId}`}
            className={`py-1 px-2 text-sm hover:text-blue-500 dark:hover:text-blue-400 ${
              level === 0 ? 'font-medium' : ''
            } group-hover:underline`}
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById(sectionId);
              if (element) {
                const headerOffset = 80;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth'
                });
              }
            }}
          >
            {section.title}
          </a>
        </div>
        {hasSubsections && isExpanded && (
          <div className="mt-1">
            {section.subsections.map(subsection =>
              renderSectionLink(subsection, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  if (!documentation?.sections) return null;

  return (
    <nav className="toc-nav sticky top-24 overflow-y-auto max-h-[calc(100vh-8rem)] bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Table of Contents</h2>
      <div className="space-y-2">
        {documentation.sections.map(section => renderSectionLink(section))}
      </div>
    </nav>
  );
};

export default TableOfContents;
