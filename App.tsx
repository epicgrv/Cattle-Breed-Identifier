import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ImageUploader from './components/ImageUploader';
import Loader from './components/Loader';
import FieldWorkerView from './components/FieldWorkerView';
import BreedAnalyticsView from './components/BreedAnalyticsView';
import ProfileView from './components/ProfileView';
import { AlertTriangleIcon, CheckCircleIcon } from './components/icons';
import { analyzeImage } from './services/geminiService';
import { TEXTS, MOCK_FIELD_WORKER_DATA } from './constants';
import { Language, AnalysisStatus, AIResult, View, FieldWorkData, Theme } from './types';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [error, setError] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [identifiedBreed, setIdentifiedBreed] = useState<AIResult | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>(View.IDENTIFIER);
  const [fieldWorkData, setFieldWorkData] = useState<FieldWorkData[]>(MOCK_FIELD_WORKER_DATA);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || Theme.SYSTEM);

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark =
      theme === Theme.DARK ||
      (theme === Theme.SYSTEM &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    root.classList.toggle('dark', isDark);
    
    if (theme === Theme.SYSTEM) {
        localStorage.removeItem('theme');
    } else {
        localStorage.setItem('theme', theme);
    }
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
        if (theme === Theme.SYSTEM) {
            const root = window.document.documentElement;
            root.classList.toggle('dark', mediaQuery.matches);
        }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);


  const resetState = useCallback(() => {
    setStatus(AnalysisStatus.IDLE);
    setError('');
    setImageFile(null);
    setIdentifiedBreed(null);
    setCurrentView(View.IDENTIFIER);
  }, []);

  const handleImageUpload = useCallback((file: File) => {
    if (file) {
      setImageFile(file);
    }
  }, []);

  const handleAnalysis = useCallback(async () => {
    if (!imageFile) return;

    setStatus(AnalysisStatus.LOADING);
    setLoadingMessage(TEXTS[language].uploading);
    try {
      const result = await analyzeImage(imageFile, (msgKey) => setLoadingMessage(TEXTS[language][msgKey as keyof typeof TEXTS.en] as string));
      setIdentifiedBreed(result.aiResult);
      setStatus(AnalysisStatus.SUCCESS);

      const newEntry: FieldWorkData = {
        id: fieldWorkData.length + Date.now(),
        breed: result.aiResult.name,
        location: 'User Upload',
        date: new Date().toISOString().split('T')[0],
      };
      setFieldWorkData(prevData => [newEntry, ...prevData]);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setStatus(AnalysisStatus.ERROR);
    }
  }, [imageFile, language, fieldWorkData]);

  useEffect(() => {
    if (imageFile && status === AnalysisStatus.IDLE) {
        handleAnalysis();
    }
  }, [imageFile, status, handleAnalysis]);

  const renderIdentifierContent = () => {
    switch (status) {
      case AnalysisStatus.LOADING:
        return <Loader message={loadingMessage} />;
      case AnalysisStatus.SUCCESS:
        if (identifiedBreed) {
          return (
            <div className="text-center p-8 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg mt-10 animate-fade-in-up">
              <CheckCircleIcon className="w-24 h-24 text-green-500 mx-auto"/>
              <h2 className="text-3xl font-bold mt-4 text-gray-800 dark:text-gray-100">{TEXTS[language].confirmedTitle}</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">{TEXTS[language].confirmedText}</p>
              <p className="text-4xl font-extrabold mt-4 text-green-600 dark:text-green-400">{identifiedBreed.name}</p>
              <div className="mt-6 text-left text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border dark:border-gray-600">
                {identifiedBreed.description}
              </div>
              <div className="mt-8 w-full flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={resetState} 
                  className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
                >
                  {TEXTS[language].uploadAnother}
                </button>
                <button 
                  onClick={() => setCurrentView(View.FIELD_WORKER)} 
                  className="w-full bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800"
                >
                  {TEXTS[language].viewActivity}
                </button>
              </div>
            </div>
          );
        }
        return null;
      case AnalysisStatus.ERROR:
        return (
            <div className="text-center p-8 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg mt-10 animate-fade-in-up">
                <AlertTriangleIcon className="w-24 h-24 text-red-500 mx-auto"/>
                <h2 className="text-3xl font-bold mt-4 text-gray-800 dark:text-gray-100">{TEXTS[language].errorTitle}</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{TEXTS[language].errorText}</p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-2 bg-red-50 dark:bg-red-900/50 p-3 rounded-md">({error})</p>
                <button onClick={resetState} className="mt-8 w-full bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800">
                    {TEXTS[language].tryAgain}
                </button>
            </div>
        );
      case AnalysisStatus.IDLE:
      default:
        return <ImageUploader onImageUpload={handleImageUpload} language={language} />;
    }
  };

  const renderView = () => {
    switch(currentView) {
      case View.IDENTIFIER:
        return renderIdentifierContent();
      case View.FIELD_WORKER:
        return <FieldWorkerView language={language} data={fieldWorkData} />;
      case View.ANALYTICS:
        return <BreedAnalyticsView language={language} />;
      case View.PROFILE:
        return <ProfileView language={language} setLanguage={setLanguage} theme={theme} setTheme={setTheme} />;
      default:
        return renderIdentifierContent();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header 
        language={language} 
        setLanguage={setLanguage} 
        toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
      />
      <div className="flex flex-1">
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setSidebarOpen}
          currentView={currentView}
          setCurrentView={(view) => {
            if (currentView === View.IDENTIFIER && status !== AnalysisStatus.IDLE) {
               setStatus(AnalysisStatus.IDLE);
               setError('');
               setImageFile(null);
               setIdentifiedBreed(null);
            }
            setCurrentView(view);
          }}
          language={language}
        />
        <main className="flex-grow p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
             {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;