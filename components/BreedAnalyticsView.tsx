import React, { useState } from 'react';
import { MOCK_BREED_ANALYTICS_DATA, TEXTS } from '../constants';
import { Language } from '../types';
import { StarIcon, MapPinIcon, BadgeCheckIcon, CurrencyRupeeIcon, CalendarDaysIcon, HeartIcon, SearchIcon } from './icons';

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

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <li className="flex items-start">
    <div className="flex-shrink-0 w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5">{icon}</div>
    <div className="ml-3">
      <span className="font-semibold text-gray-800 dark:text-gray-100">{label}:</span>
      <span className="ml-1 text-gray-600 dark:text-gray-300">{value}</span>
    </div>
  </li>
);

const BreedAnalyticsView: React.FC<BreedAnalyticsViewProps> = ({ language }) => {
  const data = MOCK_BREED_ANALYTICS_DATA;
  const T = TEXTS[language];
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBreeds = data.filter(breed =>
    breed.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in-up space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{T.analyticsTitle}</h1>
      
      <div className="relative">
        <input
          type="text"
          placeholder={T.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:border-green-500"
          aria-label={T.searchPlaceholder}
        />
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
      </div>

      {filteredBreeds.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBreeds.map((breed) => (
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

              <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="text-base font-bold text-gray-700 dark:text-gray-200 mb-3">{T.breedDetails}</h3>
                  <ul className="space-y-3 text-sm">
                      <DetailItem icon={<BadgeCheckIcon />} label={T.suitability} value={breed.suitability[language] || breed.suitability[Language.EN] || ''} />
                      <DetailItem icon={<CurrencyRupeeIcon />} label={T.monthlyExpense} value={breed.monthlyExpense[language] || breed.monthlyExpense[Language.EN] || ''} />
                      <DetailItem icon={<CalendarDaysIcon />} label={T.breedingSeason} value={breed.breedingSeason[language] || breed.breedingSeason[Language.EN] || ''} />
                      <DetailItem icon={<HeartIcon />} label={T.matingSuggestions} value={(breed.matingSuggestions[language] || breed.matingSuggestions[Language.EN] || []).join(', ')} />
                  </ul>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">{T.noResults}</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Try searching for another breed like "Gir" or "Sahiwal".</p>
        </div>
      )}
    </div>
  );
};

export default BreedAnalyticsView;