
import React, { useState, useEffect } from 'react';
import type { GenerationResult } from '../types';

interface LyricDisplayProps {
  result: GenerationResult;
  isLoading: boolean;
  error: string | null;
}

const LyricDisplay: React.FC<LyricDisplayProps> = ({ result, isLoading, error }) => {
  const [copySuccess, setCopySuccess] = useState('');
  const { lyrics, genreStyle, avoidStyle } = result;

  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => setCopySuccess(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

  const handleCopy = (textToCopy: string, type: 'Lyrics' | 'Genre' | 'Avoid') => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy.trim()).then(
      () => setCopySuccess(`${type} copied!`),
      () => setCopySuccess(`Failed to copy`)
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <svg className="animate-spin h-10 w-10 text-cyan-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-2xl font-semibold">Generating Lyrics...</p>
          <p className="text-gray-400">The AI is crafting your masterpiece.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center text-red-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-2xl font-semibold">An Error Occurred</p>
          <p className="text-sm font-roboto-mono mt-2 bg-red-900/50 p-2 rounded">{error}</p>
        </div>
      );
    }
    
    if (!lyrics) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 6l12-3" />
          </svg>
          <p className="text-2xl font-semibold">Your masterpiece awaits</p>
          <p className="text-gray-400">Generated lyrics will appear here.</p>
        </div>
      );
    }

    return (
      <>
        <pre className="whitespace-pre-wrap break-words font-roboto-mono text-sm text-gray-300 p-1">
          {lyrics}
        </pre>
        {genreStyle && (
          <div className="mt-6 pt-4 border-t-2 border-cyan-400/20 font-roboto-mono text-sm space-y-4">
            <h3 className="text-lg font-bold text-cyan-400 font-sans tracking-wider">STYLE ANALYSIS</h3>
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="font-semibold text-gray-400">Recommended Genre & Style:</p>
                <button onClick={() => handleCopy(genreStyle, 'Genre')} className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded-md text-xs hover:bg-gray-600 transition-colors">
                  {copySuccess.startsWith('Genre') ? copySuccess : 'Copy'}
                </button>
              </div>
              <p className="text-gray-300 pl-2 border-l-2 border-gray-700">{genreStyle}</p>
            </div>
             <div>
              <div className="flex justify-between items-center mb-1">
                <p className="font-semibold text-gray-400">Avoid Style:</p>
                 <button onClick={() => handleCopy(avoidStyle, 'Avoid')} className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded-md text-xs hover:bg-gray-600 transition-colors">
                  {copySuccess.startsWith('Avoid') ? copySuccess : 'Copy'}
                </button>
              </div>
              <p className="text-gray-300 pl-2 border-l-2 border-gray-700">{avoidStyle}</p>
            </div>
          </div>
        )}
      </>
    );
  };
  
  return (
    <div className="bg-gray-950/70 rounded-lg border border-gray-700 h-full flex flex-col min-h-[400px] lg:min-h-0">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-cyan-400">GENERATED LYRICS</h2>
        {lyrics && !isLoading && !error && (
          <button onClick={() => handleCopy(lyrics, 'Lyrics')} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-md text-sm hover:bg-gray-600 transition-colors relative">
            {copySuccess.startsWith('Lyrics') ? copySuccess : 'Copy Lyrics'}
          </button>
        )}
      </div>
      <div className="p-6 overflow-y-auto flex-grow">
        {renderContent()}
      </div>
    </div>
  );
};

export default LyricDisplay;
