import React from 'react';
import { ChewingCowIcon } from './icons';

interface LoaderProps {
  message: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex flex-col items-center justify-center z-50">
      <ChewingCowIcon className="w-32 h-32" />
      <p className="text-white text-xl mt-4 font-semibold tracking-wider">{message}</p>
    </div>
  );
};

export default Loader;
