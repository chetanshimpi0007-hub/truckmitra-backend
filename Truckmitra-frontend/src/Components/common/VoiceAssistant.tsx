import React, { useState, useEffect } from 'react';
import { HiMicrophone, HiSpeakerphone, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';

interface VoiceAssistantProps {
  onCommand: (command: string) => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // @ts-ignore
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
     recognition.continuous = false;
     recognition.interimResults = false;
     recognition.lang = 'en-IN'; // Can be changed to 'hi-IN' for Hindi

     recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        processCommand(text);
        setIsListening(false);
     };

     recognition.onerror = () => {
        setIsListening(false);
        toast.error('Voice recognition error');
     };
  }

  const processCommand = (text: string) => {
     const cmd = text.toLowerCase();
     if (cmd.includes('marketplace') || cmd.includes('market')) {
        onCommand('marketplace');
        speak('Opening marketplace');
     } else if (cmd.includes('bids') || cmd.includes('my bids')) {
        onCommand('my-bids');
        speak('Showing your active bids');
     } else if (cmd.includes('fleet') || cmd.includes('trucks')) {
        onCommand('fleet');
        speak('Opening your fleet management');
     } else if (cmd.includes('wallet') || cmd.includes('balance') || cmd.includes('earnings')) {
        onCommand('financial');
        speak('Navigating to your earnings and wallet');
     } else {
        speak("I didn't recognize that command. Try saying Marketplace or My Bids.");
     }
  };

  const speak = (text: string) => {
     const utterance = new SpeechSynthesisUtterance(text);
     window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
     if (!recognition) {
        toast.error('Speech recognition not supported in this browser');
        return;
     }
     setIsListening(true);
     recognition.start();
  };

  return (
    <div className="fixed bottom-10 right-10 z-[100]">
       {!isOpen ? (
          <button 
           onClick={() => setIsOpen(true)}
           className="w-16 h-16 bg-slate-900 border-4 border-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all group animate-bounce">
             <HiMicrophone className="w-8 h-8 group-hover:text-emerald-400" />
          </button>
       ) : (
          <div className="bg-slate-900 rounded-[32px] p-8 w-80 shadow-2xl border-4 border-emerald-500/30 animate-fade-in relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
             <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
                <HiX className="w-6 h-6" />
             </button>
             
             <div className="relative z-10 flex flex-col items-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all ${isListening ? 'bg-rose-500 shadow-xl shadow-rose-500/50 scale-110 animate-pulse' : 'bg-emerald-500 shadow-xl shadow-emerald-500/50'}`}>
                   <HiMicrophone className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-xl font-black text-white italic mb-2">TruckMitra Voice</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">
                   {isListening ? 'Listening...' : 'Ready for Commands'}
                </p>

                <div className="w-full bg-slate-800 rounded-2xl p-4 mb-8 text-center min-h-[60px] flex items-center justify-center">
                   <p className="text-emerald-400 font-bold italic">{transcript || 'Say "Open Marketplace"...'}</p>
                </div>

                {!isListening && (
                   <button 
                    onClick={startListening}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-emerald-900/50">
                      Tap to Speak
                   </button>
                )}
             </div>
          </div>
       )}
    </div>
  );
};

export default VoiceAssistant;
