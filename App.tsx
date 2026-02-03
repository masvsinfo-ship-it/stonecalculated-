import React, { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import CalculatorCard from './components/CalculatorCard.tsx';
import ResultDisplay from './components/ResultDisplay.tsx';
import HistoryList from './components/HistoryList.tsx';
import AIAssistant from './components/AIAssistant.tsx';
import LoginOverlay from './components/LoginOverlay.tsx';
import CommunityChat from './components/CommunityChat.tsx';
import DeploymentGuide from './components/DeploymentGuide.tsx';
import { CalculationResult, HistoryItem, CalcMode, Language, UserProfile } from './types.ts';
import { translations } from './translations.ts';

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<CalcMode>('toMurubba');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [theme, setTheme] = useState<'emerald' | 'blue' | 'indigo'>('emerald');
  const [language, setLanguage] = useState<Language>('bn');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'calc' | 'chat'>('calc');

  const t = translations[language as keyof typeof translations] || translations.bn;

  useEffect(() => {
    const savedHistory = localStorage.getItem('stone_calc_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    
    const savedTheme = localStorage.getItem('stone_calc_theme') as any;
    if (savedTheme && ['emerald', 'blue', 'indigo'].includes(savedTheme)) setTheme(savedTheme);

    const savedLang = localStorage.getItem('stone_calc_lang') as Language;
    if (savedLang && ['bn', 'en'].includes(savedLang)) setLanguage(savedLang);

    const savedUser = localStorage.getItem('stone_calc_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (newUser: UserProfile) => {
    setUser(newUser);
    localStorage.setItem('stone_calc_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('stone_calc_user');
    setResult(null);
  };

  const handleThemeChange = (newTheme: 'emerald' | 'blue' | 'indigo') => {
    setTheme(newTheme);
    localStorage.setItem('stone_calc_theme', newTheme);
  };

  const handleCalculate = (data: CalculationResult) => {
    setResult(data);
    const newItem: HistoryItem = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      label: `${t.appTitle} ${history.filter(h => h.userMobile === user?.mobile).length + 1}`,
      userMobile: user?.mobile
    };
    const updatedHistory = [newItem, ...history].slice(0, 100);
    setHistory(updatedHistory);
    localStorage.setItem('stone_calc_history', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    if (!user) return;
    const remainingHistory = history.filter(item => item.userMobile !== user.mobile);
    setHistory(remainingHistory);
    localStorage.setItem('stone_calc_history', JSON.stringify(remainingHistory));
  };

  const currentUserHistory = history.filter(item => item.userMobile === user?.mobile);

  const themeAccentBg = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    indigo: 'bg-indigo-500'
  }[theme];

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50/50`}>
      {!user && <LoginOverlay language={language} onLogin={handleLogin} />}
      
      <Header 
        activeMode={activeMode} 
        setActiveMode={setActiveMode} 
        currentTheme={theme} 
        onThemeChange={handleThemeChange} 
        language={language}
        onLanguageChange={setLanguage}
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 max-w-[280px] mx-auto mb-8">
          <button 
            onClick={() => setActiveTab('calc')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'calc' ? themeAccentBg + ' text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <i className="fas fa-calculator mr-2"></i> {t.calculate}
          </button>
          <button 
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'chat' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <i className="fas fa-comments mr-2"></i> {t.communityTab}
          </button>
        </div>

        {activeTab === 'calc' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section className="animate-in fade-in duration-500">
                <CalculatorCard activeMode={activeMode} onCalculate={handleCalculate} themeColor={theme} language={language} />
              </section>

              {result && (
                <section className="animate-in slide-in-from-bottom-4 duration-500">
                  <ResultDisplay result={result} themeColor={theme} language={language} />
                </section>
              )}

              <AIAssistant currentCalculation={result} language={language} />
              <DeploymentGuide language={language} />
            </div>

            <div className="space-y-6">
              <section className="sticky top-32">
                <div className="flex justify-between items-center mb-6 px-2">
                  <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">{t.history}</h2>
                  {currentUserHistory.length > 0 && (
                    <button onClick={clearHistory} className="text-[10px] text-red-500 font-black uppercase tracking-widest hover:underline">{t.clearHistory}</button>
                  )}
                </div>
                <HistoryList items={currentUserHistory} onSelect={setResult} language={language} />
              </section>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <CommunityChat language={language} user={user!} />
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-100 py-10 mt-12">
        <div className="container mx-auto px-4 text-center">
           <div className="flex items-center justify-center gap-4 mb-4">
              <div className={`w-10 h-10 ${themeAccentBg} rounded-xl flex items-center justify-center text-white text-lg shadow-lg`}>
                <i className="fas fa-gem"></i>
              </div>
              <div className="text-left">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block">{t.brand}</span>
                <span className="text-sm font-black text-slate-800 uppercase tracking-widest">STONE PRO CALC</span>
              </div>
            </div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">{t.rights}</p>
        </div>
      </footer>
    </div>
  );
};

export default App;