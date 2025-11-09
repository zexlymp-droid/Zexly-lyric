
import React, { useState, useCallback, useEffect } from 'react';
import type { FormState, GenerationResult, HistoryItem } from './types';
import { generateLyrics } from './services/geminiService';
import Header from './components/Header';
import InputForm from './components/InputForm';
import LyricDisplay from './components/LyricDisplay';
import HistoryModal from './components/HistoryModal';

function App() {
  const [formState, setFormState] = useState<FormState>({
    songTitle: 'Untitled',
    story: '',
    genre: '',
    structure: ['Intro', 'Verse 1', 'Hook 1', 'Verse 2', 'Hook 2', 'Outro'],
    bpm: 120,
    emotion: ['Dark Confidence'],
    language: 'English',
    enhancements: {
      autoEmotionLink: true,
      autoCadenceAdjust: true,
      autoBeatSync: true,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [generationResult, setGenerationResult] = useState<GenerationResult>({
    lyrics: '',
    genreStyle: '',
    avoidStyle: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('zexly-lyric-history');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to parse history from localStorage", e);
      localStorage.removeItem('zexly-lyric-history');
    }
  }, []);

  const updateHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem('zexly-lyric-history', JSON.stringify(newHistory));
  };


  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGenerationResult({ lyrics: '', genreStyle: '', avoidStyle: '' });

    try {
      const result = await generateLyrics(formState);
      setGenerationResult(result);
      // Add to history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        formState,
        result,
        timestamp: Date.now(),
      };
      updateHistory([newHistoryItem, ...history].slice(0, 50)); // Keep max 50 items
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [formState, history]);

  const handleLoadHistoryItem = (item: HistoryItem) => {
    setFormState(item.formState);
    setGenerationResult(item.result);
    setIsHistoryOpen(false);
  };

  const handleClearHistory = () => {
    updateHistory([]);
    setIsHistoryOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Header onHistoryClick={() => setIsHistoryOpen(true)} />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <InputForm
            formState={formState}
            setFormState={setFormState}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
          <LyricDisplay
            result={generationResult}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>ZEXLY Music Creator v5 &copy; 2024. AI-Powered Lyric Generation.</p>
      </footer>
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onLoad={handleLoadHistoryItem}
        onClear={handleClearHistory}
      />
    </div>
  );
}

export default App;