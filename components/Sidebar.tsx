import React from 'react';
import { Logo, CloseIcon, SparklesIcon, BarChartIcon, UserIcon } from './icons';
import { TEXTS } from '../constants';
import { Language, View } from '../types';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentView: View;
  setCurrentView: (view: View) => void;
  language: Language;
}

const NavLink: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
      isActive
        ? 'bg-green-600 text-white shadow'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);


const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, currentView, setCurrentView, language }) => {
  const handleNavigation = (view: View) => {
    setCurrentView(view);
    setIsOpen(false);
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
         <div className="flex items-center space-x-3">
            <Logo className="h-8 w-8" />
            <span className="font-bold text-gray-800 dark:text-gray-100">{TEXTS[language].title}</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Close navigation menu"
        >
          <CloseIcon className="h-6 w-6" />
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <NavLink 
            icon={<SparklesIcon className="h-5 w-5" />}
            label={TEXTS[language].navIdentifier}
            isActive={currentView === View.IDENTIFIER}
            onClick={() => handleNavigation(View.IDENTIFIER)}
        />
        <NavLink 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
            label={TEXTS[language].navFieldWorker}
            isActive={currentView === View.FIELD_WORKER}
            onClick={() => handleNavigation(View.FIELD_WORKER)}
        />
        <NavLink 
            icon={<BarChartIcon className="h-5 w-5" />}
            label={TEXTS[language].navAnalytics}
            isActive={currentView === View.ANALYTICS}
            onClick={() => handleNavigation(View.ANALYTICS)}
        />
        <NavLink
            icon={<UserIcon className="h-5 w-5" />}
            label={TEXTS[language].navProfile}
            isActive={currentView === View.PROFILE}
            onClick={() => handleNavigation(View.PROFILE)}
        />
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 bg-black/60 z-50 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 flex-shrink-0">
        <div className="h-full fixed w-64 border-r border-gray-200 dark:border-gray-700">
          {sidebarContent}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;