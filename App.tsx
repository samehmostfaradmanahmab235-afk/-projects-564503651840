
import React, { useState, useEffect, useRef } from 'react';
import { CONTACT_INFO, STORYBOARD_DATA } from './constants';
import { geminiService } from './services/geminiService';
import { Scene, GeneratedImage } from './types';

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.675 1.438 5.662 1.439h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const GroupIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);

const MessageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);

const App: React.FC = () => {
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [generatingIds, setGeneratingIds] = useState<number[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFirstInteraction, setIsFirstInteraction] = useState(true);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    {role: 'model', text: `أهلاً بك في المجمّع الحديث! أنا عمار، المساعد الذكي للمجموعة. يسعدنا انضمامك لمجموعتنا الرسمية على الواتساب عبر الرابط: ${CONTACT_INFO.whatsappGroup}. كيف يمكنني خدمتك اليوم؟`}
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [highQualityMode, setHighQualityMode] = useState(false);
  
  const chatRef = useRef<any>(null);

  useEffect(() => {
    chatRef.current = geminiService.createChat(
      `أنت "عمار"، المساعد الذكي والناطق الرسمي لمصنع "المجمّع الحديث للأبواب السحابة" في عدن. 
      هويتنا البصرية: الأحمر (أعلى)، الأخضر (أسفل)، البنفسجي (MCT).
      المدير التسويقي: سامح مصطفى العبسي.
      رابط مجموعة الواتساب: ${CONTACT_INFO.whatsappGroup}.
      رقم الواتساب الفردي: ${CONTACT_INFO.whatsapp}.
      الموقع: جولة دار سعد - جوار مدرسة زينب - قرب البريد الحديث.
      قاعدة العمل: بمجرد بدء العميل للمحادثة، قم بتوليد الستوري بورد تلقائياً ليرى جودة أعمالنا. شجعهم دائماً على الانضمام للمجموعة للبقاء على اطلاع بآخر العروض.`
    );
  }, []);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    const userText = userInput;
    const isFirst = isFirstInteraction;
    
    setUserInput('');
    setChatMessages(prev => [...prev, {role: 'user', text: userText}]);
    setIsTyping(true);
    setIsFirstInteraction(false);

    if (isFirst) {
      setChatMessages(prev => [...prev, {role: 'model', text: 'حياك الله! جاري الآن توليد صور الستوري بورد الخاصة بك لترى دقة تصاميمنا. يمكنك أيضاً الانضمام لمجموعتنا للحصول على خصومات حصرية.'}]);
      STORYBOARD_DATA.forEach(s => handleGenerate(s.id));
    }

    try {
      const response = await chatRef.current.sendMessage({ message: userText });
      if (response.functionCalls) {
        for (const fc of response.functionCalls) {
          if (fc.name === 'generate_full_storyboard') {
            STORYBOARD_DATA.forEach(s => handleGenerate(s.id));
            setChatMessages(prev => [...prev, {role: 'model', text: 'أبشر! جاري توليد كامل الستوري بورد بلمسة عمار الإبداعية...'}]);
          } else if (fc.name === 'update_specific_scene') {
            handleGenerate(fc.args.sceneId);
            setChatMessages(prev => [...prev, {role: 'model', text: `جاري تحديث المشهد رقم ${fc.args.sceneId}...`}]);
          }
        }
      } else {
        setChatMessages(prev => [...prev, {role: 'model', text: response.text}]);
      }
    } catch (error) {
      setChatMessages(prev => [...prev, {role: 'model', text: 'عذراً، حدث خطأ في الشبكة. تواصل معنا عبر الواتساب مباشرة.'}]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleGenerate = async (sceneId: number) => {
    const scene = STORYBOARD_DATA.find(s => s.id === sceneId);
    if (!scene) return;
    setGeneratingIds(prev => [...prev, sceneId]);
    try {
      const enhancedDescription = await geminiService.enhanceScript(scene.imageDescription);
      const imageUrl = await geminiService.generateSceneImage(enhancedDescription, highQualityMode);
      if (imageUrl) {
        setGeneratedImages(prev => {
          const filtered = prev.filter(img => img.sceneId !== sceneId);
          return [...filtered, { sceneId, url: imageUrl }];
        });
      }
    } catch (error) {} 
    finally { setGeneratingIds(prev => prev.filter(id => id !== sceneId)); }
  };

  const getGeneratedUrl = (sceneId: number) => {
    return generatedImages.find(img => img.sceneId === sceneId)?.url;
  };

  const openWhatsApp = () => {
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp.replace('+', '')}`, '_blank');
  };

  const openWhatsAppGroup = () => {
    window.open(CONTACT_INFO.whatsappGroup, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-bold overflow-x-hidden pb-24">
      {/* Brand Identity Header */}
      <header className="relative w-full shadow-2xl">
        <div className="flex h-20 md:h-32">
          <div className="flex-1 mct-red-bg flex items-center justify-center relative overflow-hidden">
             <h1 className="text-3xl md:text-7xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] tracking-tighter">المجمّع الحديث</h1>
             <div className="absolute inset-0 bg-white/5 pointer-events-none"></div>
          </div>
          <div className="w-20 md:w-44 mct-purple-bg flex flex-col items-center justify-center border-r-2 border-white/20">
             <span className="text-white text-3xl md:text-5xl font-black italic">MCT</span>
          </div>
        </div>
        <div className="flex h-32 md:h-48">
          <div className="w-1/3 mct-green-bg border-t-4 border-white flex flex-col items-center justify-center p-3 text-center">
             <p className="text-white text-xs md:text-xl font-black mb-1 opacity-80 uppercase tracking-widest">المدير التسويقي</p>
             <p className="text-white text-sm md:text-3xl font-black leading-tight">{CONTACT_INFO.manager}</p>
          </div>
          <div className="flex-1 mct-green-bg border-t-4 border-white border-r-4 border-white p-4 flex flex-col justify-center">
             <h2 className="text-white text-xl md:text-4xl font-black mb-1">لصناعة الأبواب السحابة</h2>
             <h2 className="text-white text-xl md:text-4xl font-black mb-2 opacity-90">وأعمال الهناجر والستر</h2>
             <p className="text-white text-xs md:text-xl font-bold opacity-80 mt-1 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                {CONTACT_INFO.location}
             </p>
          </div>
        </div>
      </header>

      {/* Hero Action Section */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          <div className="bg-white rounded-[3rem] shadow-2xl p-10 border-b-[12px] border-mct-red-bg flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-6 leading-tight">الجودة تبدأ من الباب</h2>
            <p className="text-slate-600 mb-10 text-lg md:text-xl leading-relaxed font-bold">
              مرحباً بكم في المجمّع الحديث. انضموا لمجموعتنا لمتابعة أحدث المشاريع والعروض الحصرية في عدن وجميع محافظات اليمن.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
               <button 
                onClick={openWhatsAppGroup}
                className="mct-purple-bg hover:bg-purple-900 text-white px-8 py-5 rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-4 transition-all hover:scale-105 shadow-xl group"
              >
                <GroupIcon />
                رابط المجموعة
              </button>
               <button 
                onClick={openWhatsApp}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-5 rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-4 transition-all hover:scale-105 shadow-xl group"
              >
                <WhatsAppIcon />
                تواصل واتساب
              </button>
            </div>
          </div>
          <div className="relative rounded-[3rem] overflow-hidden shadow-2xl h-80 md:h-auto border-8 border-white group">
            <img src="https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=1200" alt="Rolling Shutters" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-mct-purple-bg/90 via-transparent to-transparent flex items-end p-10">
               <div>
                  <p className="text-white font-black text-2xl md:text-3xl italic tracking-widest mb-2">MCT ADEN</p>
                  <p className="text-white/80 font-bold text-sm uppercase">Modern Complex for Rolling Shutters Industry</p>
               </div>
            </div>
          </div>
        </div>

        {/* Storyboard Section */}
        <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <div className="w-20 h-20 mct-red-bg rounded-[1.5rem] flex items-center justify-center text-white shadow-xl rotate-6 group hover:rotate-0 transition-transform">
                 <SparklesIcon />
              </div>
              <div>
                 <h3 className="text-3xl font-black text-slate-800 italic">ستوري بورد "عمار"</h3>
                 <p className="text-slate-500 font-bold text-lg">تخيل إعلانك القادم بذكاء MCT الاصطناعي</p>
              </div>
           </div>
           <button 
            onClick={() => STORYBOARD_DATA.forEach(s => handleGenerate(s.id))}
            className="mct-red-bg hover:bg-red-700 text-white px-10 py-5 rounded-[1.5rem] font-black text-xl flex items-center gap-4 transition-all hover:scale-110 shadow-2xl active:scale-95"
          >
            <SparklesIcon />
            توليد القصة كاملة
          </button>
        </div>

        {/* Storyboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {STORYBOARD_DATA.map((scene) => (
            <div key={scene.id} className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden group hover:-translate-y-4 transition-all duration-500 border border-slate-200/50">
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                {getGeneratedUrl(scene.id) ? (
                  <img src={getGeneratedUrl(scene.id)!} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-white p-10 text-center bg-gradient-to-br from-slate-900 to-black relative">
                    {generatingIds.includes(scene.id) ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin w-12 h-12 border-4 border-white/10 border-t-blue-500 rounded-full mb-4"></div>
                        <p className="text-xs text-blue-400 font-black tracking-widest uppercase animate-pulse">عمار يبدع الآن...</p>
                      </div>
                    ) : (
                      <div onClick={() => handleGenerate(scene.id)} className="cursor-pointer group/btn flex flex-col items-center">
                        <div className="w-16 h-16 mct-red-bg rounded-full flex items-center justify-center mb-4 group-hover/btn:scale-110 transition-transform shadow-2xl">
                           <SparklesIcon />
                        </div>
                        <p className="font-black text-sm tracking-widest opacity-80 group-hover/btn:opacity-100 uppercase">توليد المشهد {scene.id}</p>
                      </div>
                    )}
                  </div>
                )}
                <div className="absolute top-4 left-4 mct-purple-bg/90 backdrop-blur-md px-4 py-1.5 rounded-xl text-xs text-white font-black border border-white/10">
                   {scene.duration}
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-5">
                  <span className="mct-red-bg text-white w-10 h-10 rounded-xl flex items-center justify-center font-black shadow-lg text-lg italic">{scene.id}</span>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">{scene.title}</h3>
                </div>
                <p className="text-base text-slate-600 leading-relaxed italic border-r-4 border-mct-green-bg pr-5 font-bold bg-slate-50/50 p-4 rounded-xl">
                  "{scene.imageDescription}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modern Sticky Navigation Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-[60] mct-green-bg h-24 md:h-28 flex items-center px-6 md:px-16 shadow-[0_-15px_50px_rgba(0,0,0,0.5)] border-t-8 border-white/20">
          <div className="flex items-center gap-4">
            <button onClick={openWhatsAppGroup} className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl hover:bg-white/20 transition-all border border-white/20 group">
               <GroupIcon />
               <span className="hidden lg:inline text-white text-sm font-black">المجموعة</span>
            </button>
            <button onClick={openWhatsApp} className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl hover:bg-white/20 transition-all border border-white/20">
               <WhatsAppIcon />
               <span className="hidden lg:inline text-white text-sm font-black">الواتساب</span>
            </button>
          </div>
          
          <div className="flex-1 text-center">
             <button onClick={openWhatsApp} className="text-white text-3xl md:text-8xl font-black tracking-tighter drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)] hover:scale-105 transition-transform active:scale-95 leading-none">
               {CONTACT_INFO.phone}
             </button>
          </div>

          <div className="flex items-center gap-4">
             <button 
                onClick={() => setIsChatOpen(true)}
                className="mct-purple-bg text-white px-8 py-4 rounded-[1.5rem] font-black text-lg flex items-center gap-3 hover:scale-110 transition-all border-4 border-white shadow-2xl active:rotate-2"
              >
                <MessageIcon />
                <span className="hidden sm:inline">عمار</span>
              </button>
          </div>
      </footer>

      {/* AI Assistant Chat UI */}
      <div className={`fixed bottom-28 right-4 md:right-10 md:bottom-32 md:w-[450px] z-[100] transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) transform ${isChatOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-full opacity-0 scale-95 pointer-events-none'}`}>
        <div className="bg-white rounded-[3rem] shadow-[0_20px_100px_rgba(0,0,0,0.4)] border-8 border-mct-purple-bg overflow-hidden h-[80vh] flex flex-col relative">
          
          <div className="mct-purple-bg p-8 text-white flex items-center justify-between relative">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-xl shadow-inner group overflow-hidden">
                <SparklesIcon />
                <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors"></div>
              </div>
              <div>
                <h4 className="font-black text-2xl tracking-tight">عمار MCT</h4>
                <p className="text-[10px] font-bold text-purple-200 uppercase tracking-widest animate-pulse">متصل ومستعد للتوليد</p>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="bg-white/10 p-3 rounded-2xl hover:bg-red-500/50 transition-all shadow-lg border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/80 custom-scrollbar">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[90%] p-6 rounded-[2.5rem] font-bold text-base shadow-lg leading-relaxed ${
                  msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-end">
                <div className="bg-white px-6 py-4 rounded-full border border-slate-200 shadow-xl flex gap-2 items-center">
                   <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-mct-purple-bg rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-mct-purple-bg rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-mct-purple-bg rounded-full animate-bounce delay-150"></div>
                   </div>
                   <span className="text-[10px] font-black text-mct-purple-bg/50 uppercase">عمار يكتب</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 bg-white border-t-2 border-slate-100">
            <div className="flex gap-3">
              <input 
                type="text" 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="اكتب رسالتك لـ عمار..."
                className="flex-1 bg-slate-100 border-none rounded-[1.5rem] px-8 py-5 text-lg focus:ring-4 focus:ring-mct-purple-bg/20 outline-none font-black shadow-inner"
              />
              <button 
                onClick={handleSendMessage}
                disabled={isTyping}
                className="mct-purple-bg text-white p-5 rounded-[1.5rem] hover:scale-105 active:scale-95 transition-all shadow-2xl disabled:opacity-50 border-b-4 border-black/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="rotate-180"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
              </button>
            </div>
            <div className="mt-5 flex justify-center gap-4">
               <button onClick={openWhatsAppGroup} className="text-[10px] font-black text-purple-600 uppercase border-b-2 border-purple-200 hover:text-purple-900 transition-colors">انضم لمجموعة الواتساب الرسمية</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
