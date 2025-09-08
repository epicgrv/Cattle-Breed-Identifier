import React from 'react';
import { MOCK_BREED_ANALYTICS_DATA, TEXTS } from '../constants';
import { Language } from '../types';
import { StarIcon, MapPinIcon } from './icons';

interface BreedAnalyticsViewProps {
  language: Language;
}

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <StarIcon key={i} className="w-5 h-5 text-yellow-400" filled={i < rating} />
    ))}
  </div>
);

const BreedAnalyticsView: React.FC<BreedAnalyticsViewProps> = ({ language }) => {
  const data = MOCK_BREED_ANALYTICS_DATA;
  const T = TEXTS[language];

  return (
    <div className="animate-fade-in-up space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{T.analyticsTitle}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((breed) => (
          <div key={breed.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between transition-transform transform hover:-translate-y-1">
            <div>
              <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{breed.name}</h2>
                  <RatingStars rating={breed.ranking} />
              </div>
              <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                <MapPinIcon className="w-4 h-4 mr-1.5" />
                <span>{breed.location}</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
               <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">{T.milkQuality}</h3>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">{T.fatContent}:</span>
                        <span className="font-bold text-gray-800 dark:text-gray-100">{breed.milkQuality.fat}</span>
                    </div>
                     <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-500 dark:text-gray-400">{T.proteinContent}:</span>
                        <span className="font-bold text-gray-800 dark:text-gray-100">{breed.milkQuality.protein}</span>
                    </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BreedAnalyticsView;