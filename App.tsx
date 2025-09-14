
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ImageUploader from './components/ImageUploader';
import Loader from './components/Loader';
import FieldWorkerView from './components/FieldWorkerView';
import BreedAnalyticsView from './components/BreedAnalyticsView';
import ProfileView from './components/ProfileView';
import SchemesView from './components/SchemesView';
import { AlertTriangleIcon, CheckCircleIcon, MapPinIcon, BarChartIcon, SparklesIcon, StarIcon, SpeakerWaveIcon, SpinnerIcon, CloseIcon, ChewingCowIcon } from './components/icons';
import { analyzeImage } from './services/geminiService';
import { TEXTS, MOCK_FIELD_WORKER_DATA } from './constants';
import { Language, AnalysisStatus, AIResult, View, FieldWorkData, Theme, User } from './types';

// --- Start of Voice Guidance Hook ---
// As new files cannot be created, this hook is defined here. In a real-world scenario,
// this would be in its own file, e.g., 'hooks/useSpeech.ts'

let utterance: SpeechSynthesisUtterance | null = null;

const useSpeech = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setIsSupported(true);
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length > 0) {
          setVoices(availableVoices);
        }
      };
      loadVoices(); // Initial attempt
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
        window.speechSynthesis.cancel();
      };
    }
  }, []);

  const speak = useCallback((text: string, lang: Language) => {
    if (!isSupported || !text) return;
    
    window.speechSynthesis.cancel();

    utterance = new SpeechSynthesisUtterance(text);

    const langCodeMap: Record<Language, string> = {
      [Language.EN]: 'en-US',
      [Language.HI]: 'hi-IN',
      [Language.MR]: 'mr-IN',
      [Language.GU]: 'gu-IN',
      [Language.TE]: 'te-IN',
      [Language.ML]: 'ml-IN',
      [Language.TA]: 'ta-IN',
      [Language.KN]: 'kn-IN',
    };
    const langCode = langCodeMap[lang] || 'en-US';
    const langPrefix = lang as string;
    
    let selectedVoice: SpeechSynthesisVoice | undefined;

    // 1. Prioritize local, exact match
    selectedVoice = voices.find(v => v.lang === langCode && v.localService);
    // 2. Non-local, exact match
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang === langCode);
    }
    // 3. Local, prefix match
    if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith(langPrefix) && v.localService);
    }
    // 4. Non-local, prefix match
    if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith(langPrefix));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.lang = langCode;
    utterance.rate = 0.95; // Slightly slower for better clarity

    window.speechSynthesis.speak(utterance);
  }, [isSupported, voices]);

  const cancel = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
    }
  }, [isSupported]);

  return { speak, cancel, isSupported };
};
// --- End of Voice Guidance Hook ---

// --- Start of RegistrationForm Component ---
// In a real-world scenario, this would be in its own file, e.g., 'components/RegistrationForm.tsx'

interface RegistrationFormProps {
  language: Language;
  breedName: string;
  animalType: 'COW' | 'BUFFALO';
  imageUrl: string;
  onClose: () => void;
  onSubmit: (formData: { ownerName: string; ownerContact: string }) => Promise<void>;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  language,
  breedName,
  animalType,
  imageUrl,
  onClose,
  onSubmit,
}) => {
  const [ownerName, setOwnerName] = useState('');
  const [ownerContact, setOwnerContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const T = TEXTS[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName || !ownerContact || isSubmitting) return;
    setIsSubmitting(true);
    await onSubmit({ ownerName, ownerContact });
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <CheckCircleIcon className="w-24 h-24 text-green-500 mx-auto"/>
          <h2 className="text-3xl font-bold mt-4 text-gray-800 dark:text-gray-100">{T.registrationSuccessTitle}</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">{T.registrationSuccessText}</p>
          <button
            onClick={onClose}
            className="mt-8 w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
          >
            {T.close}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label={T.close}
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">{T.registrationFormTitle}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Breed identified: <span className="font-semibold">{breedName}</span></p>

        <div className="mt-6 flex flex-col sm:flex-row gap-6">
          <div className="flex-shrink-0 sm:w-1/3">
             <img src={imageUrl} alt={breedName} className="w-full h-auto object-cover rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm" />
          </div>
          <form onSubmit={handleSubmit} className="flex-grow space-y-4">
            <div>
              <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{T.ownerNameLabel}</label>
              <input
                type="text"
                id="ownerName"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                required
                className="mt-1 w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label htmlFor="ownerContact" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{T.ownerContactLabel}</label>
              <input
                type="tel"
                id="ownerContact"
                value={ownerContact}
                onChange={(e) => setOwnerContact(e.target.value)}
                required
                className="mt-1 w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>
             <div>
              <label htmlFor="animalType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{T.animalTypeLabel}</label>
              <input
                type="text"
                id="animalType"
                value={animalType}
                readOnly
                className="mt-1 w-full bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-500 dark:text-gray-400 rounded-md shadow-sm cursor-not-allowed"
              />
            </div>
             <div className="flex items-center justify-end gap-4 pt-4">
               <button type="button" onClick={onClose} disabled={isSubmitting} className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:underline disabled:opacity-50">{T.cancel}</button>
               <button
                  type="submit"
                  disabled={!ownerName || !ownerContact || isSubmitting}
                  className="bg-green-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition"
                >
                  {isSubmitting ? (
                    <>
                      <SpinnerIcon className="w-5 h-5 mr-2"/>
                      {T.registering}
                    </>
                  ) : T.submitRegistration}
                </button>
             </div>
          </form>
        </div>
      </div>
    </div>
  );
};
// --- End of RegistrationForm Component ---

// --- Start of AuthScreen Component ---
interface AuthScreenProps {
  onLogin: (user: User) => void;
  language: Language;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, language }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const T = TEXTS[language];
  
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length === 10) {
      setError('');
      setStep('otp');
    } else {
      setError(T.authInvalidPhone);
    }
  };
  
  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '1234') {
      setError('');
      onLogin({ phone });
    } else {
      setError(T.authInvalidOtp);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 10) {
      setPhone(value);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 text-center animate-fade-in-up">
            <ChewingCowIcon className="w-24 h-24 mx-auto" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-4">{T.title}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{T.authSubtitle}</p>
            
            {step === 'phone' ? (
                <form onSubmit={handlePhoneSubmit} className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="phone" className="sr-only">{T.authPhonePlaceholder}</label>
                        <div className="relative">
                             <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">+91</span>
                             <input
                                id="phone"
                                name="phone"
                                type="tel"
                                autoComplete="tel"
                                required
                                value={phone}
                                onChange={handlePhoneChange}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                placeholder={T.authPhonePlaceholder}
                            />
                        </div>
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <button
                        type="submit"
                        disabled={phone.length !== 10}
                        className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center transition"
                    >
                        {T.authSendOtp}
                    </button>
                </form>
            ) : (
                 <form onSubmit={handleOtpSubmit} className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="otp" className="sr-only">OTP</label>
                        <input
                            id="otp"
                            name="otp"
                            type="text"
                            inputMode="numeric"
                            maxLength={4}
                            required
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            className="w-full text-center tracking-[1em] py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                            placeholder="----"
                        />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{T.authOtpInfo} <span className="font-bold">1234</span></p>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <button
                        type="submit"
                        disabled={otp.length !== 4}
                        className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center transition"
                    >
                        {T.authVerifyOtp}
                    </button>
                    <button type="button" onClick={() => { setStep('phone'); setError(''); }} className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:underline">
                      {T.authChangePhone}
                    </button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};
// --- End of AuthScreen Component ---


const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [error, setError] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [identifiedBreed, setIdentifiedBreed] = useState<AIResult | null>(null);
  const [animalSpecies, setAnimalSpecies] = useState<'COW' | 'BUFFALO' | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>(View.IDENTIFIER);
  const [fieldWorkData, setFieldWorkData] = useState<FieldWorkData[]>(MOCK_FIELD_WORKER_DATA);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || Theme.SYSTEM);
  const [isRegistrationFormVisible, setRegistrationFormVisible] = useState(false);
  
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Voice Guidance State
  const [isVoiceGuidanceEnabled, setVoiceGuidanceEnabled] = useState<boolean>(
    () => JSON.parse(localStorage.getItem('voiceGuidanceEnabled') || 'false')
  );
  const [lastSpokenText, setLastSpokenText] = useState<string>('');
  const { speak, cancel } = useSpeech();
  
  // Check for persisted user session on initial load
  useEffect(() => {
    try {
        const storedUser = localStorage.getItem('pashuUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('pashuUser');
    }
    setIsAuthLoading(false);
  }, []);

  const handleLogin = (user: User) => {
      localStorage.setItem('pashuUser', JSON.stringify(user));
      setCurrentUser(user);
  };

  const handleLogout = () => {
      localStorage.removeItem('pashuUser');
      setCurrentUser(null);
      resetState();
      setCurrentView(View.IDENTIFIER);
  };

  useEffect(() => {
    localStorage.setItem('voiceGuidanceEnabled', JSON.stringify(isVoiceGuidanceEnabled));
  }, [isVoiceGuidanceEnabled]);

  const speakAndCache = useCallback((text: string) => {
    if (isVoiceGuidanceEnabled && text) {
      speak(text, language);
      setLastSpokenText(text);
    }
  }, [isVoiceGuidanceEnabled, language, speak]);


  // Bulletproof theme management effect
  useEffect(() => {
    const root = window.document.documentElement;

    const applySystemTheme = () => {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if (theme === Theme.LIGHT) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else if (theme === Theme.DARK) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.removeItem('theme');
      applySystemTheme();
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      // Only apply system changes if the user has NOT set a specific theme
      if (!localStorage.getItem('theme')) {
        applySystemTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  // Effect for speaking on status changes
  useEffect(() => {
    if (!isVoiceGuidanceEnabled) return;

    if (status === AnalysisStatus.IDLE && currentView === View.IDENTIFIER) {
      speakAndCache(TEXTS[language].uploadSubtitle);
    } else if (status === AnalysisStatus.SUCCESS && identifiedBreed) {
      const T = TEXTS[language];
      const resultText = `${T.confirmedTitle} ${T.confirmedText} ${identifiedBreed.name}. ${T.primaryLocation}: ${identifiedBreed.locations.join(', ')}. ${T.milkCapacity}: ${identifiedBreed.milkCapacity}.`;
      speakAndCache(resultText);
    } else if (status === AnalysisStatus.ERROR) {
      speakAndCache(TEXTS[language].errorText);
    }
  }, [status, currentView, identifiedBreed, language, speakAndCache, isVoiceGuidanceEnabled]);
  
  // Effect for speaking on loading message change
  useEffect(() => {
    if (status === AnalysisStatus.LOADING && loadingMessage) {
      speakAndCache(loadingMessage);
    }
  }, [loadingMessage, status, speakAndCache]);

  const resetState = useCallback(() => {
    if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
    }
    setStatus(AnalysisStatus.IDLE);
    setError('');
    setImageFile(null);
    setImageUrl(null);
    setIdentifiedBreed(null);
    setAnimalSpecies(null);
    setCurrentView(View.IDENTIFIER);
  }, [imageUrl]);

  const handleImageUpload = useCallback((file: File) => {
    if (file) {
      setImageFile(file);
      // Clean up previous object URL to avoid memory leaks
      if (imageUrl) {
          URL.revokeObjectURL(imageUrl);
      }
      setImageUrl(URL.createObjectURL(file));
    }
  }, [imageUrl]);

  const handleAnalysis = useCallback(async () => {
    if (!imageFile) return;

    setStatus(AnalysisStatus.LOADING);
    setLoadingMessage(TEXTS[language].uploading);
    try {
      const result = await analyzeImage(imageFile, (msgKey) => setLoadingMessage(TEXTS[language][msgKey as keyof typeof TEXTS.en] as string));
      setIdentifiedBreed(result.aiResult);
      setAnimalSpecies(result.species);
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

  const handleOpenRegistration = () => {
    setRegistrationFormVisible(true);
  };

  const handleCloseRegistration = () => {
    setRegistrationFormVisible(false);
    resetState();
  };

  const handleSubmitRegistration = async (formData: { ownerName: string; ownerContact: string }) => {
    console.log("Registering breed:", identifiedBreed?.name, "for owner:", formData.ownerName);
    // Simulate API call to BPA platform
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("Registration successful!");
    // The success state is handled inside the form component.
    // The onClose (handleCloseRegistration) will be called from the success screen, which then calls resetState.
  };

  const RatingStars: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <StarIcon key={i} className="w-5 h-5 text-yellow-400" filled={i < rating} />
      ))}
    </div>
  );

  const renderIdentifierContent = () => {
    switch (status) {
      case AnalysisStatus.LOADING:
        return <Loader message={loadingMessage} />;
      case AnalysisStatus.SUCCESS:
        if (identifiedBreed && imageUrl && animalSpecies) {
          const T = TEXTS[language];
          return (
            <div className="text-center p-6 sm:p-8 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg mt-10 animate-fade-in-up">
              <img
                src={imageUrl}
                alt="Uploaded cattle for identification"
                className="w-full h-auto max-h-64 object-cover rounded-lg mb-6 border border-gray-200 dark:border-gray-700 shadow-sm"
              />
              <CheckCircleIcon className="w-24 h-24 text-green-500 mx-auto"/>
              <h2 className="text-3xl font-bold mt-4 text-gray-800 dark:text-gray-100">{T.confirmedTitle}</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">{T.confirmedText}</p>
              <p className="text-4xl font-extrabold mt-4 text-green-600 dark:text-green-400">{identifiedBreed.name}</p>
              
              <div className="mt-6 text-left space-y-3">
                <div className="flex items-start bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border dark:border-gray-200 dark:border-gray-600">
                    <MapPinIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-4 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-100">{T.primaryLocation}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{identifiedBreed.locations.join(', ')}</p>
                    </div>
                </div>
                <div className="flex items-start bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border dark:border-gray-200 dark:border-gray-600">
                    <BarChartIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-4 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-100">{T.milkCapacity}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{identifiedBreed.milkCapacity}</p>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border dark:border-gray-200 dark:border-gray-600">
                    <div className="flex items-start">
                        <SparklesIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-4 mt-1 flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-100">{T.milkQuality}</h4>
                            <div className="mt-1 flex space-x-4 text-sm">
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400">{T.fatContent}: </span>
                                    <span className="font-medium text-gray-700 dark:text-gray-200">{identifiedBreed.milkQuality.fat}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400">{T.proteinContent}: </span>
                                    <span className="font-medium text-gray-700 dark:text-gray-200">{identifiedBreed.milkQuality.protein}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-start bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border dark:border-gray-200 dark:border-gray-600">
                    <StarIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-4 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-100">{T.qualityRanking}</h4>
                        <RatingStars rating={identifiedBreed.rating} />
                    </div>
                </div>
              </div>

              <div className="mt-8 w-full flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={resetState} 
                  className="w-full bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800"
                >
                  {T.uploadAnother}
                </button>
                <button 
                  onClick={handleOpenRegistration} 
                  className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
                >
                  {T.registerBreed}
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
      case View.SCHEMES:
        return <SchemesView language={language} />;
      case View.PROFILE:
        return <ProfileView 
                  language={language} 
                  setLanguage={setLanguage} 
                  theme={theme} 
                  setTheme={setTheme}
                  isVoiceGuidanceEnabled={isVoiceGuidanceEnabled}
                  setVoiceGuidanceEnabled={setVoiceGuidanceEnabled}
                  currentUser={currentUser}
                  onLogout={handleLogout}
               />;
      default:
        return renderIdentifierContent();
    }
  };

  const handleSetCurrentView = (view: View) => {
    cancel(); // Stop speech on navigation
    if (currentView === View.IDENTIFIER && status !== AnalysisStatus.IDLE) {
       if (imageUrl) {
           URL.revokeObjectURL(imageUrl);
       }
       setStatus(AnalysisStatus.IDLE);
       setError('');
       setImageFile(null);
       setImageUrl(null);
       setIdentifiedBreed(null);
    }
    setCurrentView(view);
  };

  if (isAuthLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <SpinnerIcon className="w-12 h-12 text-green-600" />
        </div>
    );
  }

  if (!currentUser) {
      return <AuthScreen onLogin={handleLogin} language={language} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header 
        language={language} 
        toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
      />
      <div className="flex flex-1">
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setSidebarOpen}
          currentView={currentView}
          setCurrentView={handleSetCurrentView}
          language={language}
        />
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
             {renderView()}
          </div>
        </main>
      </div>
      {isVoiceGuidanceEnabled && (
        <button
          onClick={() => speakAndCache(lastSpokenText)}
          className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900 transition-transform transform hover:scale-110 z-50 disabled:bg-gray-400 disabled:cursor-not-allowed"
          aria-label="Repeat last instruction"
          disabled={!lastSpokenText}
        >
          <SpeakerWaveIcon className="w-6 h-6" />
        </button>
      )}
      {isRegistrationFormVisible && identifiedBreed && imageUrl && animalSpecies && (
        <RegistrationForm
            language={language}
            breedName={identifiedBreed.name}
            animalType={animalSpecies}
            imageUrl={imageUrl}
            onClose={handleCloseRegistration}
            onSubmit={handleSubmitRegistration}
        />
      )}
    </div>
  );
};

export default App;