import React, { useState } from 'react';
import WidgetBox from '../ui/WidgetBox';
import { mockNotes, mockFlashcards } from '../../services/mockData';
import { Sparkles, Edit3, ArrowRightLeft } from 'lucide-react';

const NotesFlashcardsBox = () => {
    const [activeTab, setActiveTab] = useState('notes');
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const nextCard = (e) => {
        e.stopPropagation();
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentCardIndex((prev) => (prev + 1) % mockFlashcards.length);
        }, 150);
    };

    return (
        <WidgetBox title="Notes & Flashcards">
            {/* Tabs */}
            <div className="flex bg-slate-900/50 p-1 rounded-xl w-fit mb-4 border border-slate-800/80">
                <button
                    onClick={() => setActiveTab('notes')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'notes' ? 'bg-surface-card text-brand-400 shadow-sm border border-slate-700/50' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Recent Notes
                </button>
                <button
                    onClick={() => { setActiveTab('flashcards'); setIsFlipped(false); }}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'flashcards' ? 'bg-surface-card text-brand-400 shadow-sm border border-slate-700/50' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    AI Flashcards
                </button>
            </div>

            <div className="flex-1 overflow-hidden relative">
                {/* Notes View */}
                {activeTab === 'notes' && (
                    <div className="h-full overflow-y-auto pr-2 custom-scrollbar space-y-3">
                        {mockNotes.map((note) => (
                            <div key={note.id} className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 hover:bg-slate-800/80 transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-slate-300">{note.client}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-slate-500 font-medium">{note.date}</span>
                                        {note.isAI ? (
                                            <span className="flex items-center gap-1 text-[9px] uppercase font-bold tracking-wider text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded border border-brand-500/20">
                                                <Sparkles size={10} /> AI
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-[9px] uppercase font-bold tracking-wider text-slate-400 bg-slate-700 px-1.5 py-0.5 rounded border border-slate-600">
                                                <Edit3 size={10} /> Manual
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{note.text}</p>
                            </div>
                        ))}

                        <button className="w-full py-2.5 border border-dashed border-slate-700 text-slate-400 hover:text-white hover:border-brand-500 hover:bg-brand-500/5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                            <Edit3 size={16} /> Add Quick Note
                        </button>
                    </div>
                )}

                {/* Flashcards View */}
                {activeTab === 'flashcards' && (
                    <div className="h-full flex flex-col items-center justify-center pb-6">
                        <div className="w-full max-w-sm perspective-1000">
                            <div
                                className={`relative w-full h-40 transition-transform duration-500 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
                                onClick={handleFlip}
                            >
                                {/* Front Side */}
                                <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-brand-600 to-indigo-700 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center text-center border border-indigo-400/30">
                                    <div className="absolute top-3 left-3 flex gap-1 items-center bg-black/20 px-2 py-1 rounded-full backdrop-blur-md">
                                        <Sparkles size={12} className="text-brand-200" />
                                        <span className="text-[10px] font-bold text-brand-100 font-mono tracking-widest uppercase">OpenNote</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mt-4">{mockFlashcards[currentCardIndex].front}</h3>
                                    <div className="absolute bottom-3 right-3 flex items-center gap-1 text-brand-200/60 font-medium text-[10px] bg-black/10 px-2 py-1 rounded-full">
                                        Click to flip <ArrowRightLeft size={10} />
                                    </div>
                                </div>

                                {/* Back Side */}
                                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-surface-card rounded-2xl p-6 shadow-xl border border-brand-500 flex flex-col items-center justify-center text-center">
                                    <div className="w-10 h-10 bg-brand-500/10 rounded-full flex items-center justify-center mb-3">
                                        <span className="text-xl">💡</span>
                                    </div>
                                    <p className="text-slate-200 font-medium">{mockFlashcards[currentCardIndex].back}</p>
                                    <button
                                        onClick={nextCard}
                                        className="absolute bottom-3 px-4 py-1.5 bg-brand-500 hover:bg-brand-400 text-white text-xs font-bold rounded-full transition-colors shadow-md shadow-brand-500/20"
                                    >
                                        Next Card
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex gap-1">
                            {mockFlashcards.map((_, i) => (
                                <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentCardIndex ? 'w-4 bg-brand-400' : 'w-1.5 bg-slate-700'}`} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Required CSS for 3D flip effect injected locally for simplicity */}
            <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
        </WidgetBox>
    );
};

export default NotesFlashcardsBox;
