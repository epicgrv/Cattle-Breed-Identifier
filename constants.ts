import { Language, FieldWorkData, BreedAnalyticsData } from './types';

export const TEXTS = {
  [Language.EN]: {
    // General & Identifier
    title: 'Pashu Pehchan',
    subtitle: 'AI Cattle & Buffalo Breed Identifier',
    uploadTitle: 'Upload an Image',
    uploadSubtitle: 'Upload a clear photo of a single cow or buffalo to identify its breed.',
    uploadButton: 'Select Image',
    uploading: 'Uploading...',
    analyzing: 'Analyzing your champion...',
    identifying: 'Identifying the breed...',
    errorTitle: 'Analysis Failed',
    errorText: 'Sorry, we couldn\'t analyze the image. It might not be a clear photo of a cow or buffalo. Please try another one.',
    tryAgain: 'Try Again',
    confirmedTitle: 'Breed Identified!',
    confirmedText: 'This animal has been identified as:',
    resultsIntro: (species: string, breedName: string) => `Analysis complete! It looks like a ${species.toLowerCase()}. The breed is ${breedName}.`,
    uploadAnother: 'Upload Another',
    viewActivity: 'View Activity',
    
    // Sidebar
    navIdentifier: 'Breed Identifier',
    navFieldWorker: 'Field Worker',
    navAnalytics: 'Breed Analytics',
    navProfile: 'Profile',

    // Field Worker View
    fieldWorkerTitle: 'Field Worker Dashboard',
    totalAnalyzed: 'Total Breeds Analyzed',
    recentActivity: 'Recent Activity',

    // Breed Analytics View
    analyticsTitle: 'Breed Analytics',
    milkQuality: 'Milk Quality',
    fatContent: 'Fat',
    proteinContent: 'Protein',
    primaryLocation: 'Primary Location',
    qualityRanking: 'Quality Ranking',

    // Profile View
    profileTitle: 'Profile & Settings',
    appearanceTitle: 'Appearance',
    themeLabel: 'Choose a theme to display the app.',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System',
    languageTitle: 'Language',
    languageLabel: 'Select your preferred language.',
    otherSettingsTitle: 'Other Settings',
    notificationsLabel: 'Enable Push Notifications',
    dataSyncLabel: 'Sync Data Now',
  },
  [Language.HI]: {
    // General & Identifier
    title: 'पशु पहचान',
    subtitle: 'एआई मवेशी और भैंस नस्ल पहचानकर्ता',
    uploadTitle: 'एक छवि अपलोड करें',
    uploadSubtitle: 'नस्ल की पहचान के लिए एक गाय या भैंस की स्पष्ट तस्वीर अपलोड करें।',
    uploadButton: 'छवि चुनें',
    uploading: 'अपलोड हो रहा है...',
    analyzing: 'आपके चैंपियन का विश्लेषण किया जा रहा है...',
    identifying: 'नस्ल की पहचान की जा रही है...',
    errorTitle: 'विश्लेषण विफल',
    errorText: 'क्षमा करें, हम छवि का विश्लेषण नहीं कर सके। यह गाय या भैंस की स्पष्ट तस्वीर नहीं हो सकती है। कृपया दूसरी कोशिश करें।',
    tryAgain: 'पुनः प्रयास करें',
    confirmedTitle: 'नस्ल की पहचान हो गई!',
    confirmedText: 'इस जानवर की पहचान इस रूप में की गई है:',
    resultsIntro: (species: string, breedName: string) => `विश्लेषण पूरा! ऐसा लगता है कि यह एक ${species === 'COW' ? 'गाय' : 'भैंस'} है। नस्ल ${breedName} है।`,
    uploadAnother: 'दूसरी अपलोड करें',
    viewActivity: 'गतिविधि देखें',

    // Sidebar
    navIdentifier: 'नस्ल पहचानकर्ता',
    navFieldWorker: 'फील्ड वर्कर',
    navAnalytics: 'नस्ल एनालिटिक्स',
    navProfile: 'प्रोफ़ाइल',

    // Field Worker View
    fieldWorkerTitle: 'फील्ड वर्कर डैशबोर्ड',
    totalAnalyzed: 'कुल नस्लों का विश्लेषण किया गया',
    recentActivity: 'हाल की गतिविधि',

    // Breed Analytics View
    analyticsTitle: 'नस्ल एनालिटिक्स',
    milkQuality: 'दूध की गुणवत्ता',
    fatContent: 'वसा',
    proteinContent: 'प्रोटीन',
    primaryLocation: 'प्राथमिक स्थान',
    qualityRanking: 'गुणवत्ता रैंकिंग',

    // Profile View
    profileTitle: 'प्रोफ़ाइल और सेटिंग्स',
    appearanceTitle: 'दिखावट',
    themeLabel: 'ऐप प्रदर्शित करने के लिए एक थीम चुनें।',
    themeLight: 'लाइट',
    themeDark: 'डार्क',
    themeSystem: 'सिस्टम',
    languageTitle: 'भाषा',
    languageLabel: 'अपनी पसंदीदा भाषा चुनें।',
    otherSettingsTitle: 'अन्य सेटिंग्स',
    notificationsLabel: 'पुश सूचनाएं सक्षम करें',
    dataSyncLabel: 'अभी डेटा सिंक करें',
  },
};

export const MOCK_FIELD_WORKER_DATA: FieldWorkData[] = [
    { id: 1, breed: 'Gir', location: 'Anand, Gujarat', date: '2024-07-20' },
    { id: 2, breed: 'Sahiwal', location: 'Ludhiana, Punjab', date: '2024-07-19' },
    { id: 3, breed: 'Murrah', location: 'Rohtak, Haryana', date: '2024-07-19' },
    { id: 4, breed: 'Red Sindhi', location: 'Karachi, Sindh (Origin)', date: '2024-07-18' },
    { id: 5, breed: 'Deoni', location: 'Latur, Maharashtra', date: '2024-07-17' },
];

export const MOCK_BREED_ANALYTICS_DATA: BreedAnalyticsData[] = [
    { id: 1, name: 'Gir', milkQuality: { fat: '4.5-5.0%', protein: '3.2-3.5%' }, location: 'Gujarat', ranking: 5 },
    { id: 2, name: 'Sahiwal', milkQuality: { fat: '4.0-4.5%', protein: '3.0-3.4%' }, location: 'Punjab, Haryana', ranking: 5 },
    { id: 3, name: 'Murrah Buffalo', milkQuality: { fat: '7.0-8.0%', protein: '4.0-4.5%' }, location: 'Haryana, Punjab', ranking: 5 },
    { id: 4, name: 'Red Sindhi', milkQuality: { fat: '4.0-4.2%', protein: '3.1-3.3%' }, location: 'Odisha, Tamil Nadu', ranking: 4 },
    { id: 5, name: 'Tharparkar', milkQuality: { fat: '4.2-4.8%', protein: '3.2-3.6%' }, location: 'Rajasthan', ranking: 4 },
    { id: 6, name: 'Deoni', milkQuality: { fat: '3.5-4.0%', protein: '3.0-3.2%' }, location: 'Maharashtra, Karnataka', ranking: 3 },
];
