import React from 'react';
import { MOCK_SCHEMES_DATA, TEXTS } from '../constants';
import { Language } from '../types';
import { ChevronRightIcon } from './icons';

interface SchemesViewProps {
  language: Language;
}

const SchemesView: React.FC<SchemesViewProps> = ({ language }) => {
  const T = TEXTS[language];
  const schemes = MOCK_SCHEMES_DATA;

  return (
    <div className="animate-fade-in-up space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{T.schemesTitle}</h1>
      
      <div className="space-y-6">
        {schemes.map((scheme) => (
          <div key={scheme.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-shadow hover:shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{scheme.name[language] || scheme.name[Language.EN]}</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{scheme.description[language] || scheme.description[Language.EN]}</p>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{T.eligibility}</h3>
              <ul className="mt-2 space-y-1 list-disc list-inside text-gray-600 dark:text-gray-300">
                {(scheme.eligibility[language] || scheme.eligibility[Language.EN] || []).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <a
                href={scheme.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center font-bold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
              >
                <span>{T.learnMore}</span>
                <ChevronRightIcon className="w-5 h-5 ml-1" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchemesView;