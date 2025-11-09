
import React from 'react';
import type { FormState, Emotion, Language, Genre } from '../types';
import { EMOTIONS, LANGUAGES, GENRES } from '../types';

interface InputFormProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  onSubmit: () => void;
  isLoading: boolean;
}

const STRUCTURE_PRESETS = {
  'Classic Rap': ['Intro', 'Verse 1', 'Hook 1', 'Verse 2', 'Hook 2', 'Bridge 1', 'Hook 3', 'Outro'],
  'Trap Anthem': ['Intro', 'Hook 1', 'Verse 1', 'Hook 2', 'Verse 2', 'Hook 3', 'Outro'],
  'Storytelling': ['Intro', 'Verse 1', 'Chorus 1', 'Verse 2', 'Chorus 2', 'Bridge 1', 'Verse 3', 'Outro'],
  'Drill': ['Intro', 'Verse 1', 'Hook 1', 'Verse 2', 'Hook 2', 'Verse 3', 'Hook 3', 'Outro'],
  'Pop': ['Intro', 'Verse 1', 'Pre-Chorus 1', 'Chorus 1', 'Verse 2', 'Pre-Chorus 2', 'Chorus 2', 'Bridge 1', 'Chorus 3', 'Outro'],
  'Verse-Chorus-Bridge': ['Verse 1', 'Chorus 1', 'Verse 2', 'Chorus 2', 'Bridge 1', 'Chorus 3', 'Outro'],
  'AABA': ['Verse 1', 'Verse 2', 'Bridge 1', 'Verse 3', 'Outro'],
};


const InputForm: React.FC<InputFormProps> = ({ formState, setFormState, onSubmit, isLoading }) => {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: parseInt(value, 10) }));
  };
  
  const handleEmotionChange = (emotion: Emotion) => {
    setFormState(prev => {
      const currentEmotions = prev.emotion;
      const newEmotions = currentEmotions.includes(emotion)
        ? currentEmotions.filter(e => e !== emotion)
        : [...currentEmotions, emotion];
      return { ...prev, emotion: newEmotions };
    });
  };
  
  const handleLanguageChange = (language: Language) => {
    setFormState(prev => ({...prev, language}));
  };

  const handleGenreChange = (genre: Genre) => {
    setFormState(prev => ({
      ...prev,
      genre: prev.genre === genre ? '' : genre,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormState(prev => ({
      ...prev,
      enhancements: { ...prev.enhancements, [name]: checked },
    }));
  };

  const handleAddStructurePart = (part: 'Intro' | 'Verse' | 'Pre-Chorus' | 'Chorus' | 'Post-Chorus' | 'Hook' | 'Bridge' | 'Skit' | 'Outro') => {
    setFormState(prev => {
      const newStructure = [...prev.structure];
      const numberedParts = ['Verse', 'Pre-Chorus', 'Chorus', 'Post-Chorus', 'Hook', 'Bridge', 'Skit'];
      
      if (numberedParts.includes(part)) {
        const count = newStructure.filter(p => p.startsWith(part)).length;
        newStructure.push(`${part} ${count + 1}`);
      } else { // For Intro/Outro, which are typically unique
        if (!newStructure.some(p => p.startsWith(part))) {
           if (part === 'Intro') {
             newStructure.unshift(part);
           } else {
             newStructure.push(part);
           }
        }
      }
      return { ...prev, structure: newStructure };
    });
  };
  
  const handleRemoveLastPart = () => {
    setFormState(prev => ({ ...prev, structure: prev.structure.slice(0, -1) }));
  };

  const handleClearStructure = () => {
    setFormState(prev => ({ ...prev, structure: [] }));
  }

  const handlePresetSelect = (presetKey: keyof typeof STRUCTURE_PRESETS) => {
    setFormState(prev => ({ ...prev, structure: STRUCTURE_PRESETS[presetKey] }));
  };


  return (
    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 space-y-6">
      <h2 className="text-2xl font-bold text-cyan-400 border-b-2 border-cyan-400/30 pb-2">CREATE YOUR TRACK</h2>
      
      <div>
        <label htmlFor="songTitle" className="block text-lg font-semibold mb-1">Song Title</label>
        <input
          type="text"
          name="songTitle"
          id="songTitle"
          value={formState.songTitle}
          onChange={handleInputChange}
          className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="story" className="block text-lg font-semibold mb-1">Story / Core Message</label>
        <textarea
          name="story"
          id="story"
          rows={4}
          placeholder="What's the story behind this track? What message do you want to convey?"
          value={formState.story}
          onChange={handleInputChange}
          className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-400 focus:outline-none font-roboto-mono text-sm"
        />
      </div>

      <div>
        <label className="block text-lg font-semibold mb-2">Main Genre (Optional)</label>
        <div className="flex flex-wrap gap-2">
          {GENRES.map(g => (
            <button
              key={g}
              onClick={() => handleGenreChange(g)}
              className={`px-3 py-1 text-sm rounded-full border-2 transition-all duration-200 ${formState.genre === g ? 'bg-cyan-400 text-gray-900 border-cyan-400 font-bold' : 'bg-gray-700 border-gray-600 hover:bg-gray-600'}`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-lg font-semibold mb-2">Language</label>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(lang => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`px-3 py-1 text-sm rounded-full border-2 transition-all duration-200 ${formState.language === lang ? 'bg-cyan-400 text-gray-900 border-cyan-400 font-bold' : 'bg-gray-700 border-gray-600 hover:bg-gray-600'}`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

       <div>
        <label className="block text-lg font-semibold mb-2">Song Structure</label>
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-sm text-gray-400 self-center mr-2">Presets:</span>
          {Object.keys(STRUCTURE_PRESETS).map(key => (
              <button
                  key={key}
                  onClick={() => handlePresetSelect(key as keyof typeof STRUCTURE_PRESETS)}
                  className="text-xs bg-gray-600 border-gray-500 hover:bg-cyan-800 hover:border-cyan-600 border px-2 py-1 rounded-md transition-colors"
              >
                  {key}
              </button>
          ))}
        </div>
        <div className="bg-gray-900 border border-gray-600 rounded-md p-3 min-h-[60px] flex flex-wrap gap-2 items-center">
          {formState.structure.length > 0 ? (
             formState.structure.map((part, index) => (
                <span key={index} className="bg-cyan-900/50 text-cyan-300 text-xs font-bold px-2 py-1 rounded-full">
                  {part}
                </span>
             ))
          ) : (
            <p className="text-gray-500 text-sm">Start building your song...</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <button onClick={() => handleAddStructurePart('Intro')} className="text-xs bg-gray-700 border-gray-600 hover:bg-gray-600 border px-2 py-1 rounded-md transition-colors">+ Intro</button>
          <button onClick={() => handleAddStructurePart('Verse')} className="text-xs bg-gray-700 border-gray-600 hover:bg-gray-600 border px-2 py-1 rounded-md transition-colors">+ Verse</button>
          <button onClick={() => handleAddStructurePart('Pre-Chorus')} className="text-xs bg-gray-700 border-gray-600 hover:bg-gray-600 border px-2 py-1 rounded-md transition-colors">+ Pre-Chorus</button>
          <button onClick={() => handleAddStructurePart('Chorus')} className="text-xs bg-gray-700 border-gray-600 hover:bg-gray-600 border px-2 py-1 rounded-md transition-colors">+ Chorus</button>
          <button onClick={() => handleAddStructurePart('Post-Chorus')} className="text-xs bg-gray-700 border-gray-600 hover:bg-gray-600 border px-2 py-1 rounded-md transition-colors">+ Post-Chorus</button>
          <button onClick={() => handleAddStructurePart('Hook')} className="text-xs bg-gray-700 border-gray-600 hover:bg-gray-600 border px-2 py-1 rounded-md transition-colors">+ Hook</button>
          <button onClick={() => handleAddStructurePart('Bridge')} className="text-xs bg-gray-700 border-gray-600 hover:bg-gray-600 border px-2 py-1 rounded-md transition-colors">+ Bridge</button>
          <button onClick={() => handleAddStructurePart('Skit')} className="text-xs bg-gray-700 border-gray-600 hover:bg-gray-600 border px-2 py-1 rounded-md transition-colors">+ Skit</button>
          <button onClick={() => handleAddStructurePart('Outro')} className="text-xs bg-gray-700 border-gray-600 hover:bg-gray-600 border px-2 py-1 rounded-md transition-colors">+ Outro</button>
          <button onClick={handleRemoveLastPart} className="text-xs bg-red-900/50 border-red-500/30 hover:bg-red-800/50 border px-2 py-1 rounded-md transition-colors">Remove Last</button>
          <button onClick={handleClearStructure} className="text-xs bg-red-900/50 border-red-500/30 hover:bg-red-800/50 border px-2 py-1 rounded-md transition-colors">Clear</button>
        </div>
      </div>

      <div>
        <label htmlFor="bpm" className="block text-lg font-semibold mb-1">BPM: <span className="text-cyan-400 font-bold">{formState.bpm}</span></label>
        <input
          type="range"
          name="bpm"
          id="bpm"
          min="90"
          max="180"
          step="5"
          value={formState.bpm}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
      </div>


      <div>
        <label className="block text-lg font-semibold mb-2">Emotion(s)</label>
        <div className="flex flex-wrap gap-2">
          {EMOTIONS.map(emotion => (
            <button
              key={emotion}
              onClick={() => handleEmotionChange(emotion)}
              className={`px-3 py-1 text-sm rounded-full border-2 transition-all duration-200 ${formState.emotion.includes(emotion) ? 'bg-cyan-400 text-gray-900 border-cyan-400 font-bold' : 'bg-gray-700 border-gray-600 hover:bg-gray-600'}`}
            >
              {emotion}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-lg font-semibold mb-2">Optional Enhancements</label>
        <div className="space-y-2">
          {Object.keys(formState.enhancements).map(key => (
            <div key={key} className="flex items-center">
              <input
                type="checkbox"
                id={key}
                name={key}
                checked={formState.enhancements[key as keyof typeof formState.enhancements]}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-600 ring-offset-gray-800 focus:ring-2"
              />
              <label htmlFor={key} className="ml-2 text-sm font-medium text-gray-300">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={isLoading}
        className="w-full bg-cyan-500 text-gray-900 font-bold text-xl py-3 rounded-lg hover:bg-cyan-400 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="http://www.w3.org/2000/svg">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            GENERATING...
          </>
        ) : (
          'GENERATE LYRICS'
        )}
      </button>
    </div>
  );
};

export default InputForm;