import React from 'react';
import { TEXTS } from '../constants';
import { Language, FieldWorkData } from '../types';
import { MapPinIcon } from './icons';

interface FieldWorkerViewProps {
  language: Language;
  data: FieldWorkData[];
}

const FieldWorkerView: React.FC<FieldWorkerViewProps> = ({ language, data }) => {
  const T = TEXTS[language];
  const total = data.length;

  const breedCounts = data.reduce((acc, item) => {
    acc[item.breed] = (acc[item.breed] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const breedDistributionData = Object.entries(breedCounts)
    .map(([breed, count]) => ({
      breed,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const colors = ['#34D399', '#FBBF24', '#60A5FA', '#F87171', '#A78BFA', '#F472B6'];

  let cumulativePercentage = 0;
  const gradientString = breedDistributionData.map((item, index) => {
      const color = colors[index % colors.length];
      const start = cumulativePercentage;
      const end = cumulativePercentage + item.percentage;
      cumulativePercentage = end;
      return `${color} ${start}% ${end}%`;
  }).join(', ');


  return (
    <div className="animate-fade-in-up space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{T.fieldWorkerTitle}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300">{T.totalAnalyzed}</h2>
          <p className="text-4xl font-extrabold text-green-600 dark:text-green-400 mt-2">{total}</p>
        </div>
        <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
           <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300">{T.breedDistribution}</h2>
           <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
            {total > 0 ? (
              <>
                <div
                  className="w-32 h-32 rounded-full flex-shrink-0"
                  style={{ background: `conic-gradient(${gradientString})` }}
                  role="img"
                  aria-label={`Pie chart showing breed distribution: ${breedDistributionData.map(d => `${d.breed} ${d.percentage.toFixed(1)}%`).join(', ')}`}
                ></div>
                <ul className="space-y-2 text-sm w-full">
                  {breedDistributionData.slice(0, 5).map((item, index) => (
                    <li key={item.breed} className="flex items-center">
                      <span className="w-3 h-3 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: colors[index % colors.length] }}></span>
                      <span className="font-medium text-gray-700 dark:text-gray-200 truncate pr-2">{item.breed}:</span>
                      <span className="ml-auto text-gray-500 dark:text-gray-400 font-mono">{item.count} ({item.percentage.toFixed(0)}%)</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8 w-full">No data for breed distribution.</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{T.recentActivity}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Breed</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Location</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.breed}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <MapPinIcon className="w-4 h-4 mr-1.5 text-gray-400 dark:text-gray-500" />
                        {item.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FieldWorkerView;