
import React from 'react';

interface HeaderProps {
  onHistoryClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHistoryClick }) => {
  return (
    <header className="bg-gray-950/50 backdrop-blur-sm border-b border-cyan-400/20 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-wider text-cyan-400 uppercase">
            <span className="text-gray-200">ZEXLY</span> Music Creator
          </h1>
          <p className="text-sm text-gray-400 tracking-wide">
            AI-Powered Professional Lyric Generation System
          </p>
        </div>
        <button 
          onClick={onHistoryClick} 
          className="bg-gray-700/50 border border-gray-600 text-cyan-300 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-semibold"
          aria-label="View generation history"
        >
          History
        </button>
      </div>
    </header>
  );
};

export default Header;
