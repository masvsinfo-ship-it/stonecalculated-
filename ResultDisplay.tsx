
import React from 'react';
import { CalculationResult, Language } from '../types';
import { translations } from '../translations';

interface Props {
  result: CalculationResult;
  themeColor: 'emerald' | 'blue' | 'indigo';
  language: Language;
}

const ResultDisplay: React.FC<Props> = ({ result, themeColor, language }) => {
  const isToPieces = result.calcMode === 'toPieces';
  const isFromMeter = result.calcMode === 'toPiecesFromMeter';
  
  // Use a fallback to ensure 't' is always defined correctly
  const t = translations[language as keyof typeof translations] || translations.bn;

  const themes = {
    emerald: {
      box1: 'bg-emerald-600',
      box2: 'bg-slate-800',
      accent: 'text-emerald-600',
      border: 'border-emerald-100'
    },
    blue: {
      box1: 'bg-blue-600',
      box2: 'bg-indigo-900',
      accent: 'text-blue-600',
      border: 'border-blue-100'
    },
    indigo: {
      box1: 'bg-indigo-600',
      box2: 'bg-rose-600',
      accent: 'text-indigo-600',
      border: 'border-indigo-100'
    }
  };

  const current = themes[themeColor];
  const formatNum = (num: number) => num.toLocaleString(undefined, { maximumFractionDigits: 2 });

  // Determine which price label to use based on target context
  const priceLabel = isFromMeter ? t.priceByMeter : t.priceByMurubba;

  const shareToWhatsApp = () => {
    const reportTitle = t.appTitle + " Report";
    const text = `*${reportTitle}*\n------------------\n📍 ${t.length}: ${result.length}m × ${result.width}m\n📐 ${t.thickness}: ${result.height}cm\n📦 ${t.quantity}: ${Math.ceil(result.quantity)}\n🏗️ ${t.totalMurubba}: ${result.totalMurubba.toFixed(2)}\n📏 ${t.linear}: ${(result.totalLinearUnit || 0).toFixed(2)} m\n⚖️ ${t.weight}: ${result.estimatedWeightTon.toFixed(2)} ${t.ton}\n💰 ${priceLabel}: ${result.totalPrice.toFixed(2)}\n------------------\n_${t.brand} Stone Calculator_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Primary Measurement Boxes */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {/* Box 1: Units Result */}
        <div className={`${current.box1} rounded-[1.25rem] p-5 text-white shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center text-center transition-transform active:scale-95 border-b-4 border-black/10`}>
          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest opacity-80 mb-1.5">
            {(isToPieces || isFromMeter) ? t.totalPieces : t.totalMurubba}
          </span>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-3xl md:text-4xl font-black tabular-nums tracking-tighter">
              {(isToPieces || isFromMeter) ? Math.ceil(result.quantity) : result.totalMurubba.toFixed(2)}
            </h3>
            <span className="text-[10px] font-bold opacity-70">
              {(isToPieces || isFromMeter) ? t.quantity : t.murubba}
            </span>
          </div>
        </div>

        {/* Box 2: Linear Meters (Always shown for reference) */}
        <div className="bg-white border-2 border-slate-100 rounded-[1.25rem] p-5 flex flex-col items-center justify-center text-center shadow-lg transition-transform active:scale-95">
          <span className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
            {t.linear} ({t.meter})
          </span>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-3xl md:text-4xl font-black text-slate-800 tabular-nums tracking-tighter">
              {(result.totalLinearUnit || 0).toFixed(2)}
            </h3>
            <span className="text-[10px] font-bold text-slate-400">m.</span>
          </div>
        </div>
      </div>

      {/* Target Price Box: Highlighted based on mode */}
      <div className={`${current.box2} rounded-[1.5rem] p-6 text-white shadow-2xl relative overflow-hidden group border-b-4 border-black/20`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
          <i className="fas fa-coins text-7xl"></i>
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <div className="bg-white/10 px-4 py-1 rounded-full mb-3">
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/80">{priceLabel}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h4 className="text-4xl md:text-6xl font-black tabular-nums tracking-tighter">
              {result.unitPrice > 0 ? formatNum(result.totalPrice) : '0.00'}
            </h4>
            <span className="text-sm md:text-xl font-bold opacity-40">TK</span>
          </div>
        </div>
      </div>

      {/* Tertiary Info Bar */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: t.weight, val: result.estimatedWeightTon.toFixed(1) + ' ' + t.ton, color: 'bg-orange-50 text-orange-600' },
          { label: t.oneInPiece, val: result.piecesPerMurubba.toFixed(1), color: 'bg-rose-50 text-rose-600' },
          { label: t.volume, val: result.totalVolumeM3.toFixed(2), color: 'bg-slate-50 text-slate-600' }
        ].map((item, i) => (
          <div key={i} className={`flex flex-col items-center justify-center py-2.5 rounded-xl border border-slate-100 ${item.color.split(' ')[0]}`}>
            <p className="text-[8px] font-black uppercase tracking-tighter opacity-60 mb-0.5">{item.label}</p>
            <p className={`text-[11px] font-black tabular-nums ${item.color.split(' ')[1]}`}>{item.val}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-1">
        <button 
          onClick={shareToWhatsApp}
          className="flex-[2] py-3.5 bg-[#25D366] text-white rounded-xl font-black text-[11px] flex items-center justify-center gap-2 shadow-md uppercase tracking-wider active:scale-95 transition-transform"
        >
          <i className="fab fa-whatsapp text-sm"></i> {t.share}
        </button>
        <button 
          onClick={() => window.print()}
          className="flex-1 py-3.5 bg-white border border-slate-200 text-slate-500 rounded-xl font-black text-[11px] flex items-center justify-center gap-2 uppercase tracking-wider active:scale-95 transition-transform"
        >
          <i className="fas fa-print"></i> {t.print}
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 py-2">
        <div className="h-px bg-slate-100 flex-grow"></div>
        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest whitespace-nowrap">
          {t.formula}
        </p>
        <div className="h-px bg-slate-100 flex-grow"></div>
      </div>
    </div>
  );
};

export default ResultDisplay;
