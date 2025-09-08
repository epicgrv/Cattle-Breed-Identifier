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

  return (
    <div className="animate-fade-in-up space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{T.fieldWorkerTitle}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300">{T.totalAnalyzed}</h2>
          <p className="text-4xl font-extrabold text-green-600 dark:text-green-400 mt-2">{data.length}</p>
        </div>
        <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
           <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Coverage Map</h2>
           <div className="mt-2 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
             <p className="text-gray-500 dark:text-gray-400">Map visualization placeholder</p>
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