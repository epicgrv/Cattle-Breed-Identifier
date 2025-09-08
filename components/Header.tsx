import React from 'react';
import { Language, Theme } from '../types';
import { TEXTS } from '../constants';
import { Logo, MenuIcon } from './icons';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage, toggleSidebar }) => {
  const handleLanguageToggle = () => {
    setLanguage(language === Language.EN ? Language.HI : Language.EN);
  };

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm dark:shadow-none border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Logo className="h-10 w-10" />
            <div>
              <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100 tracking-tight">{TEXTS[language].title}</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">{TEXTS[language].subtitle}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLanguageToggle}
              className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
              aria-label="Toggle Language"
            >
              {language === Language.EN ? 'हिन्दी' : 'English'}
            </button>
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Open navigation menu"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;