import React from 'react';
import { TEXTS } from '../constants';
import { Language, Theme } from '../types';
import { SunIcon, MoonIcon } from './icons';

interface ProfileViewProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ language, setLanguage, theme, setTheme }) => {
  const T = TEXTS[language];

  const SettingCard: React.FC<{ title: string; description: string; children: React.ReactNode; }> = ({ title, description, children }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
      <p className="text-gray-500 dark:text-gray-400 mt-1">{description}</p>
      <div className="mt-6">{children}</div>
    </div>
  );

  const ThemeButton: React.FC<{ label: string; value: Theme; icon: React.ReactNode }> = ({ label, value, icon }) => (
     <button
        onClick={() => setTheme(value)}
        className={`w-full sm:w-auto flex-1 flex flex-col items-center justify-center p-4 border rounded-lg transition-colors text-sm font-semibold ${
          theme === value
            ? 'bg-green-600 text-white border-green-700 shadow'
            : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
        }`}
      >
        {icon}
        <span className="mt-2">{label}</span>
      </button>
  );

  return (
    <div className="animate-fade-in-up space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{T.profileTitle}</h1>
      
      <SettingCard title={T.appearanceTitle} description={T.themeLabel}>
        <div className="flex flex-col sm:flex-row gap-4">
            <ThemeButton label={T.themeLight} value={Theme.LIGHT} icon={<SunIcon className="w-6 h-6"/>} />
            <ThemeButton label={T.themeDark} value={Theme.DARK} icon={<MoonIcon className="w-6 h-6"/>} />
            <ThemeButton label={T.themeSystem} value={Theme.SYSTEM} icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            } />
        </div>
      </SettingCard>

      <SettingCard title={T.languageTitle} description={T.languageLabel}>
        <div className="flex gap-4">
            <button
                onClick={() => setLanguage(Language.EN)}
                className={`flex-1 font-bold py-3 px-6 rounded-lg transition-colors ${ language === Language.EN ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600' }`}
            >
                English
            </button>
            <button
                onClick={() => setLanguage(Language.HI)}
                className={`flex-1 font-bold py-3 px-6 rounded-lg transition-colors ${ language === Language.HI ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600' }`}
            >
                हिन्दी
            </button>
        </div>
      </SettingCard>

      <SettingCard title={T.otherSettingsTitle} description="Manage other application preferences.">
        <ul className="space-y-4">
            <li className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="font-semibold text-gray-700 dark:text-gray-200">{T.notificationsLabel}</span>
                <label htmlFor="notifications" className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" id="notifications" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
            </li>
             <li className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="font-semibold text-gray-700 dark:text-gray-200">Sync Activity Data</span>
                 <button className="bg-gray-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors text-sm dark:bg-gray-600 dark:hover:bg-gray-500">
                    {T.dataSyncLabel}
                </button>
            </li>
        </ul>
      </SettingCard>

    </div>
  );
};

export default ProfileView;