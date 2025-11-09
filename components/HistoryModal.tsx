
import React from 'react';
import type { HistoryItem } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onLoad: (item: HistoryItem) => void;
  onClear: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, onLoad, onClear }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-gray-900 rounded-lg border border-gray-700 w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl shadow-cyan-500/10"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="p-4 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-900/80 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-cyan-400">Generation History</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close history modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 overflow-y-auto space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-4 text-lg">No history yet.</p>
              <p>Your generated lyrics will appear here.</p>
            </div>
          ) : (
            history.map(item => (
              <div key={item.id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex justify-between items-center transition-all hover:border-cyan-400/50">
                <div>
                  <h3 className="font-bold text-lg text-gray-200">
                    {item.formState.songTitle || 'Untitled'}
                  </h3>
                  <p className="text-xs text-gray-400 font-roboto-mono">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.formState.genre && (
                      <span className="text-xs bg-green-900/50 text-green-300 px-2 py-0.5 rounded-full">{item.formState.genre}</span>
                    )}
                    <span className="text-xs bg-cyan-900/50 text-cyan-300 px-2 py-0.5 rounded-full">{item.formState.language}</span>
                    <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded-full">{item.formState.emotion.join(', ')}</span>
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{item.formState.bpm} BPM</span>
                  </div>
                </div>
                <button 
                  onClick={() => onLoad(item)} 
                  className="bg-cyan-500 text-gray-900 font-bold px-4 py-2 rounded-lg hover:bg-cyan-400 transition-colors text-sm"
                  aria-label={`Load ${item.formState.songTitle}`}
                >
                  Load
                </button>
              </div>
            ))
          )}
        </div>
        {history.length > 0 && (
          <div className="p-4 border-t border-gray-700 sticky bottom-0 bg-gray-900/80 backdrop-blur-sm">
            <button 
              onClick={onClear} 
              className="w-full bg-red-800/50 border border-red-500/30 text-red-300 py-2 rounded-lg hover:bg-red-700/50 transition-colors font-semibold"
            >
              Clear All History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryModal;