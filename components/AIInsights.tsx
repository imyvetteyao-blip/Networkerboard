
import React, { useState, useEffect } from 'react';
import { Contact, WeeklyInsight, ReviewPeriod } from '../types';
import { getReviewInsights } from '../geminiService';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface AIInsightsProps {
  contacts: Contact[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ contacts }) => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<WeeklyInsight | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<ReviewPeriod>('W');
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
    "Pruning network meta-data...",
    "Scanning interaction patterns...",
    "Synthesizing persona profiles...",
    "Finalizing flash strategy..."
  ];

  const generateReport = async () => {
    if (contacts.length === 0) {
      setError("No contacts found to analyze.");
      return;
    }

    setLoading(true);
    setError(null);
    setLoadingStep(0);
    
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 1200);

    try {
      const data = await getReviewInsights(contacts, period);
      setInsight(data);
    } catch (err: any) {
      setError(err.message || "Failed to generate AI strategy report.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Strategy Control Center */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <span className="p-1.5 bg-indigo-600 rounded-lg text-white text-base">
              <i className="fa-solid fa-radar"></i>
            </span>
            Strategy Audit
          </h2>
          <p className="text-slate-500 text-xs mt-1">Rolling analysis of networking efficiency and social capital drift.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(['W', 'M', 'Q', 'Y'] as ReviewPeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${
                  period === p ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {p === 'W' ? 'Weekly' : p === 'M' ? 'Monthly' : p === 'Q' ? 'Quarterly' : 'Yearly'}
              </button>
            ))}
          </div>
          <button 
            onClick={generateReport}
            disabled={loading}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2 font-bold text-sm shadow-xl shadow-indigo-100"
          >
            {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-bolt-lightning text-amber-300"></i>}
            Run Flash Audit
          </button>
        </div>
      </div>

      {loading && (
        <div className="bg-white rounded-[40px] border border-slate-200 p-20 flex flex-col items-center justify-center text-center">
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <i className="fa-solid fa-wand-sparkles text-2xl text-indigo-600"></i>
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">{loadingMessages[loadingStep]}</h3>
          <p className="text-slate-500 text-sm max-w-xs">Optimizing data payload for high-speed processing...</p>
          <div className="w-64 h-1.5 bg-slate-100 rounded-full mt-8 overflow-hidden">
             <div 
              className="h-full bg-indigo-600 transition-all duration-700" 
              style={{ width: `${(loadingStep + 1) * 25}%` }}
             ></div>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="p-12 bg-rose-50/50 text-rose-700 rounded-[40px] border border-rose-100 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-2">
            <i className="fa-solid fa-circle-exclamation text-3xl"></i>
          </div>
          <div>
            <p className="font-black text-xl mb-2 text-rose-900">Audit Interrupted</p>
            <p className="text-sm opacity-80 max-w-md mx-auto">{error}</p>
          </div>
          <button 
            onClick={generateReport} 
            className="mt-4 px-8 py-3 bg-rose-600 text-white rounded-2xl font-bold text-sm hover:bg-rose-700 transition shadow-lg shadow-rose-200"
          >
            Try Again
          </button>
        </div>
      )}

      {insight && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6">Efficiency Pipeline</h3>
            <div className="space-y-8">
              {[
                { label: 'Sent', val: insight.funnel.sent, color: 'bg-slate-200' },
                { label: 'Responded', val: insight.funnel.responded, color: 'bg-indigo-500', metric: insight.funnel.responseRate },
                { label: 'Coffee', val: insight.funnel.coffee, color: 'bg-emerald-500', metric: insight.funnel.coffeeRate }
              ].map((step, i) => (
                <div key={i} className="relative">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-slate-500">{step.label}</span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-slate-900">{step.val}</span>
                      {step.metric && (
                        <span className={`ml-2 text-[10px] font-black px-1.5 py-0.5 rounded ${step.metric.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          {step.metric.comparisonValue}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                    <div 
                      className={`${step.color} h-full transition-all duration-1000`} 
                      style={{ width: `${Math.min(100, (step.val / Math.max(1, insight.funnel.sent)) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6">Success Factor Hit Rates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {insight.featureHitRates.map((rate, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 flex-shrink-0 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[{v: rate.percentage}, {v: 100 - rate.percentage}]}
                          innerRadius={16}
                          outerRadius={22}
                          paddingAngle={0}
                          dataKey="v"
                          startAngle={90}
                          endAngle={-270}
                        >
                          <Cell fill={COLORS[i % COLORS.length]} />
                          <Cell fill="#f1f5f9" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-900">
                      {rate.percentage}%
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{rate.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{rate.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-emerald-50/20 border border-emerald-100 p-8 rounded-[40px] relative overflow-hidden group">
               <div className="absolute top-8 right-8 text-emerald-100 text-6xl group-hover:scale-110 transition-transform"><i className="fa-solid fa-bullseye"></i></div>
               <h4 className="text-emerald-700 font-black text-lg mb-6 flex items-center gap-2"><i className="fa-solid fa-circle-check"></i> High Conversion Persona</h4>
               <div className="flex flex-wrap gap-2 mb-6">
                 {insight.personas.success.traits.map((t, i) => <span key={i} className="px-3 py-1 bg-emerald-500/10 text-emerald-700 text-xs font-black rounded-lg">{t}</span>)}
               </div>
               <p className="text-sm text-slate-700 leading-relaxed bg-white/80 p-5 rounded-2xl border border-emerald-50 shadow-sm">{insight.personas.success.summary}</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] text-white relative overflow-hidden">
               <h4 className="text-indigo-400 font-black text-lg mb-6 flex items-center gap-2"><i className="fa-solid fa-timeline"></i> Longitudinal Insights</h4>
               <div className="space-y-6">
                 <div>
                   <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2">Target Drift Analysis</p>
                   <p className="text-sm text-indigo-50 leading-relaxed italic">{insight.personas.driftAnalysis || "No significant persona shift detected."}</p>
                 </div>
                 <div className="pt-6 border-t border-white/10">
                   <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2">Topic Evolution</p>
                   <p className="text-sm text-indigo-50 leading-relaxed">{insight.keywords.evolutionNotes || "Dialogue topics are currently consistent."}</p>
                 </div>
               </div>
            </div>
          </div>

          <div className="lg:col-span-12 bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex-1">
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Altruism & Momentum Audit</h3>
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl font-black text-slate-900">{insight.altruism.helpCount}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase leading-tight">Lives<br/>Impacted</div>
                  </div>
                  <div className="h-10 w-px bg-slate-100"></div>
                  <div className="flex items-center gap-3">
                    <div className="text-4xl font-black text-indigo-600">{insight.altruism.momentumScore}%</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase leading-tight">Momentum<br/>Score</div>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Top Beneficiary Groups</p>
                 <div className="flex flex-wrap gap-2">
                   {insight.altruism.topRecipientCategories.map((cat, i) => (
                     <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200">{cat}</span>
                   ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!insight && !loading && !error && (
        <div className="bg-white rounded-[40px] border-2 border-dashed border-slate-200 p-20 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <i className="fa-solid fa-chart-line text-slate-300 text-3xl"></i>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Active Audit Found</h3>
          <p className="text-slate-500 max-w-sm">Start a Flash Audit to see your latest networking performance metrics and persona drift analysis.</p>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
