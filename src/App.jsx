import { useState, useEffect } from 'react';
import reposData from '../github_mit_repos_20250222_192855.json';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

function AppContent() {
  const { t, currentLanguage, toggleLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSearch, setTempSearch] = useState('');
  const [repos, setRepos] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const [sortBy, setSortBy] = useState('stars');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    setRepos(reposData);
  }, []);

  const languages = [...new Set(reposData.map(repo => repo.language).filter(Boolean))];

  const filteredAndSortedRepos = repos
    .filter(repo => {
      const nameMatch = repo.name.toLowerCase().includes(searchQuery.toLowerCase());
      const descMatch = repo.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSearch = nameMatch || descMatch;
      
      const matchesLanguage = !selectedLanguage || repo.language === selectedLanguage;
      
      return matchesSearch && matchesLanguage;
    })
    .sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1;
      switch (sortBy) {
        case 'created_at':
          return order * (new Date(a.created_at) - new Date(b.created_at));
        case 'updated_at':
          return order * (new Date(a.updated_at) - new Date(b.updated_at));
        case 'stars':
          return order * (a.stars - b.stars);
        case 'forks':
          return order * (a.forks - b.forks);
        default:
          return 0;
      }
    });

  const highlightText = (text, query) => {
    if (!query || !text) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? 
        <span key={i} className="bg-yellow-200 font-medium">{part}</span> : 
        part
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {currentLanguage === 'en' ? '切换到中文' : 'Switch to English'}
            </button>
          </div>
          <p className="text-gray-600 text-lg mb-6">{t('description')}</p>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  className="block w-full rounded-md border-0 py-2 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  placeholder={t('searchPlaceholder')}
                  value={tempSearch}
                  onChange={(e) => setTempSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setSearchQuery(tempSearch);
                    }
                  }}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-sm text-gray-500">
                    {filteredAndSortedRepos.length} {t('reposFound')}
                  </span>
                </div>
              </div>

              <select
                className="w-40 rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                <option value="">{t('allLanguages')}</option>
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>

              <select
                className="w-40 rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="stars">{t('sortOptions.stars')}</option>
                <option value="forks">{t('sortOptions.forks')}</option>
                <option value="created_at">{t('sortOptions.createdAt')}</option>
                <option value="updated_at">{t('sortOptions.updatedAt')}</option>
              </select>

              <select
                className="w-40 rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="desc">{t('sortOrder.desc')}</option>
                <option value="asc">{t('sortOrder.asc')}</option>
              </select>
            </div>


          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedRepos.map(repo => (
            <div key={repo.name} className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                  <a href={repo.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600">
                    {searchQuery ? highlightText(repo.name, searchQuery) : repo.name}
                  </a>
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-4 min-h-[4.5rem] leading-[1.125rem]">
                  {searchQuery ? highlightText(repo.description || t('noDescription'), searchQuery) : (repo.description || t('noDescription'))}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center text-gray-500">
                      ⭐ {repo.stars.toLocaleString()}
                    </span>
                    <span className="flex items-center text-gray-500">
                      🔄 {repo.forks.toLocaleString()}
                    </span>
                  </div>
                  {repo.language && (
                    <span className="text-gray-500">{repo.language}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <footer className="mt-12 py-6 text-center text-gray-600 border-t border-gray-200">
          <p>{t('copyright').replace('{year}', new Date().getFullYear())}</p>
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
