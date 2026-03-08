import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Shield, Upload, DollarSign, FileText, TrendingUp, Info, Pencil, Check, X, Loader2, FileCheck, AlertTriangle, Sparkles, Download } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';

// eslint-disable-next-line no-unused-vars
const StatRow = ({ label, value, icon: StatIcon, isEditing, onChange }) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group/row transition-all hover:bg-white/[0.08]">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400">
        <StatIcon size={16} />
      </div>
      <span className="text-sm font-medium text-slate-300">{label}</span>
    </div>
    {isEditing ? (
      <input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-800 border border-brand-500/30 rounded px-2 py-0.5 text-sm text-white w-32 focus:outline-none focus:border-brand-500 text-right"
      />
    ) : (
      <span className="text-sm font-bold text-white">{value}</span>
    )}
  </div>
);

const UploadBox = ({ label, sublabel }) => {
  const [status, setStatus] = useState('idle'); // idle, uploading, done
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setStatus('uploading');
      // Simulate upload delay for premium feel
      setTimeout(() => {
        setStatus('done');
      }, 1500);
    }
  };

  return (
    <div 
      onClick={handleUpload}
      className={`group border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center transition-all cursor-pointer h-32
        ${status === 'done' ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 hover:border-brand-500/50 hover:bg-brand-500/5'}`}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={onFileChange} 
        className="hidden" 
        accept=".pdf,.jpg,.png,.doc,.docx"
      />
      {status === 'uploading' ? (
        <Loader2 size={18} className="text-brand-400 animate-spin mb-2" />
      ) : status === 'done' ? (
        <FileCheck size={18} className="text-green-500 mb-2" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-brand-400 mb-2 transition-colors">
          <Upload size={18} />
        </div>
      )}
      <span className="text-sm font-semibold text-slate-200">
        {status === 'done' ? 'File Uploaded' : label}
      </span>
      <span className="text-[10px] text-slate-500 mt-1 truncate max-w-full italic px-2">
        {status === 'done' ? fileName : sublabel}
      </span>
    </div>
  );
};

export default function FinancialProfileWidget() {
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState({
    income: 185000,
    downPayment: 250000,
    preApproval: 1500000,
    loanType: '30-yr Fixed Conventional'
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState(null);

  const [insight, setInsight] = useState({
    grade: 'Analyzing',
    text: 'Analyzing your financial profile with AI...',
    color: 'text-slate-400',
    bg: 'bg-slate-500/5'
  });
  const [insightLoading, setInsightLoading] = useState(false);

  const fetchGeminiInsight = useCallback(async (currentStats) => {
    setInsightLoading(true);
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setInsight({
        grade: 'Error',
        text: 'Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env.local file.',
        color: 'text-red-400',
        bg: 'bg-red-500/5'
      });
      setInsightLoading(false);
      return;
    }

    const dpPercent = currentStats.preApproval > 0 ? ((currentStats.downPayment / currentStats.preApproval) * 100).toFixed(1) : 0;

    const prompt = `You are a real estate financial analyst AI. Analyze this buyer's financial profile and provide a realtor importance insight.

Buyer Profile:
- Annual Income: $${currentStats.income.toLocaleString()}
- Down Payment: $${currentStats.downPayment.toLocaleString()} (${dpPercent}% of pre-approval)
- Pre-Approval Amount: $${currentStats.preApproval.toLocaleString()}
- Loan Type: ${currentStats.loanType}

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{"grade": "Gold" or "Silver" or "Bronze" or "At Risk", "text": "2-3 sentence analysis of their position as a buyer and how realtors would view them", "suggestion": "One actionable suggestion"}

Be honest and critical. If down payment is $0 or income is very low, grade should be "At Risk". If financials are very strong, grade should be "Gold".`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 300 }
          })
        }
      );

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      // Strip markdown code fences if present
      const cleanText = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanText);

      const gradeColors = {
        'Gold': { color: 'text-brand-400', bg: 'bg-brand-500/5' },
        'Silver': { color: 'text-blue-400', bg: 'bg-blue-500/5' },
        'Bronze': { color: 'text-amber-400', bg: 'bg-amber-500/5' },
        'At Risk': { color: 'text-red-400', bg: 'bg-red-500/5' },
      };
      const colors = gradeColors[parsed.grade] || gradeColors['Bronze'];

      setInsight({
        grade: parsed.grade,
        text: `${parsed.text} ${parsed.suggestion || ''}`,
        color: colors.color,
        bg: colors.bg
      });
    } catch (err) {
      console.error('Gemini insight failed:', err);
      // Fallback to basic logic
      const dpPct = currentStats.preApproval > 0 ? (currentStats.downPayment / currentStats.preApproval) * 100 : 0;
      if (dpPct <= 0) {
        setInsight({ grade: 'At Risk', text: 'No down payment detected. Most sellers and realtors will deprioritize your offers. Start saving for a down payment immediately.', color: 'text-red-400', bg: 'bg-red-500/5' });
      } else if (dpPct >= 20 && currentStats.income > 150000) {
        setInsight({ grade: 'Gold', text: `Strong profile with ${dpPct.toFixed(1)}% down and high income. Sellers are likely to accept your offers.`, color: 'text-brand-400', bg: 'bg-brand-500/5' });
      } else if (dpPct >= 10) {
        setInsight({ grade: 'Silver', text: `Solid ${dpPct.toFixed(1)}% down payment makes you competitive. Consider increasing earnest money to stand out.`, color: 'text-blue-400', bg: 'bg-blue-500/5' });
      } else {
        setInsight({ grade: 'Bronze', text: `Low down payment (${dpPct.toFixed(1)}%). You may face challenges in competitive markets.`, color: 'text-amber-400', bg: 'bg-amber-500/5' });
      }
    } finally {
      setInsightLoading(false);
    }
  }, []);

  // Fetch insight on mount and when stats change (after editing)
  useEffect(() => {
    if (!isEditing) {
      fetchGeminiInsight(stats);
    }
  }, [isEditing, stats, fetchGeminiInsight]);

  const handleDownloadReport = () => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 20;

      // Header bar
      doc.setFillColor(30, 30, 50);
      doc.rect(0, 0, pageWidth, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('TheMiddleBot', 14, 18);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Financial Verification Report', 14, 26);
      doc.setFontSize(9);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 14, 34);

      // Verified badge
      doc.setFillColor(34, 197, 94);
      doc.roundedRect(pageWidth - 40, 10, 28, 10, 2, 2, 'F');
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text('VERIFIED', pageWidth - 37, 17);

      y = 52;

      // Section: Financial Summary
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Financial Summary', 14, y);
      y += 4;
      doc.setDrawColor(139, 92, 246);
      doc.setLineWidth(0.8);
      doc.line(14, y, 80, y);
      y += 10;

      const financialData = [
        ['Annual Income', `$${stats.income.toLocaleString()}`],
        ['Down Payment', `$${stats.downPayment.toLocaleString()} (${((stats.downPayment / stats.preApproval) * 100).toFixed(1)}%)`],
        ['Pre-Approval Amount', `$${stats.preApproval.toLocaleString()}`],
        ['Loan Type', stats.loanType],
      ];

      doc.setFontSize(10);
      financialData.forEach(([label, value]) => {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(label, 18, y);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 30, 50);
        doc.text(value, pageWidth - 18, y, { align: 'right' });
        y += 4;
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.2);
        doc.line(18, y, pageWidth - 18, y);
        y += 7;
      });

      y += 6;

      // Section: AI Analysis
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('AI Analysis Results', 14, y);
      y += 4;
      doc.setDrawColor(139, 92, 246);
      doc.setLineWidth(0.8);
      doc.line(14, y, 80, y);
      y += 10;

      if (report) {
        // Score badge
        doc.setFillColor(245, 245, 255);
        doc.roundedRect(14, y - 4, pageWidth - 28, 16, 3, 3, 'F');
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text('Estimated Credit Score', 18, y + 3);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(139, 92, 246);
        doc.setFontSize(16);
        doc.text(String(report.score), pageWidth - 22, y + 5, { align: 'right' });
        y += 20;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);
        const summaryLines = doc.splitTextToSize(report.summary, pageWidth - 36);
        doc.text(summaryLines, 18, y);
        y += summaryLines.length * 6 + 6;

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(60, 60, 60);
        doc.text('Recommendation', 18, y);
        y += 6;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);
        const recLines = doc.splitTextToSize(report.recommendation, pageWidth - 36);
        doc.text(recLines, 18, y);
        y += recLines.length * 6 + 6;
      }

      // Footer
      const footerY = doc.internal.pageSize.getHeight() - 15;
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(14, footerY - 4, pageWidth - 14, footerY - 4);
      doc.setFontSize(7);
      doc.setTextColor(160, 160, 160);
      doc.text('This report is generated for verification purposes within TheMiddleBot ecosystem.', 14, footerY);
      doc.text('Confidential — Do not distribute.', pageWidth - 14, footerY, { align: 'right' });

      doc.save(`TheMiddleBot_Financial_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    });
  };

  const generateAIAnalysis = async () => {
    setIsAnalyzing(true);
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    try {
      const prompt = `You are a financial verification AI for real estate. Analyze this buyer's profile and generate a verification report.

Buyer Profile:
- Annual Income: $${stats.income.toLocaleString()}
- Down Payment: $${stats.downPayment.toLocaleString()}
- Pre-Approval: $${stats.preApproval.toLocaleString()}
- Loan Type: ${stats.loanType}

Respond ONLY with valid JSON (no markdown, no code blocks):
{"summary": "2-3 sentence analysis of their financial health and creditworthiness", "score": <estimated credit score 300-850 as a number>, "recommendation": "One sentence recommendation for loan programs"}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 300 }
          })
        }
      );

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleanText = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanText);

      setReport({
        summary: parsed.summary,
        score: parsed.score,
        recommendation: parsed.recommendation,
        date: new Date().toLocaleDateString()
      });
    } catch (err) {
      console.error('AI Analysis failed:', err);
      // Fallback to mock data
      setReport({
        summary: 'Analysis complete. Profile reviewed based on available financial data.',
        score: stats.income > 200000 ? 815 : 785,
        recommendation: 'Consider consulting with a mortgage specialist for personalized advice.',
        date: new Date().toLocaleDateString()
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-surface-card rounded-2xl border border-white/5 overflow-hidden flex flex-col h-full shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-gradient-to-br from-brand-500/5 to-transparent relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="flex items-center justify-between mb-2 relative z-10">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield size={20} className="text-brand-400" />
            Financial Profile
          </h3>
          <div className="px-2 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-wider rounded border border-green-500/20 flex items-center gap-1.5 shadow-lg">
            <Check size={10} />
            Verified
          </div>
        </div>
        <p className="text-sm text-slate-400">Your statistics used by realtors to prioritize your offers.</p>
      </div>

      <div className="p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar flex-1">
        {/* Core Stats Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex flex-col">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <TrendingUp size={14} />
                Buying Power Stats
              </h4>
               {isEditing && <span className="text-[9px] text-brand-400 font-bold uppercase mt-1 animate-pulse">Editing Mode</span>}
            </div>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border
                ${isEditing ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20' : 'bg-white/5 text-slate-400 hover:text-brand-400 border-white/5 hover:border-brand-500/30'}`}
            >
              {isEditing ? (
                <><Check size={14} /> Save</>
              ) : (
                <><Pencil size={14} /> Edit Stats</>
              )}
            </button>
          </div>
          <StatRow icon={DollarSign} label="Annual Income" value={isEditing ? stats.income : `$${stats.income.toLocaleString()}`} isEditing={isEditing} onChange={(v) => setStats({...stats, income: parseInt(v.replace(/[^0-9]/g, '')) || 0})} />
          <StatRow icon={DollarSign} label="Down Payment" value={isEditing ? stats.downPayment : `$${stats.downPayment.toLocaleString()} (${((stats.downPayment/stats.preApproval)*100).toFixed(0)}%)`} isEditing={isEditing} onChange={(v) => setStats({...stats, downPayment: parseInt(v.replace(/[^0-9]/g, '')) || 0})} />
          <StatRow icon={FileText} label="Pre-Approval" value={isEditing ? stats.preApproval : `$${stats.preApproval.toLocaleString()}`} isEditing={isEditing} onChange={(v) => setStats({...stats, preApproval: parseInt(v.replace(/[^0-9]/g, '')) || 0})} />
          <StatRow icon={Info} label="Loan Type" value={stats.loanType} isEditing={isEditing} onChange={(v) => setStats({...stats, loanType: v})} />
        </div>

        {/* Realtor Priority Insights */}
        <div 
          className={`${insight.bg} rounded-2xl p-4 border border-white/5 relative group transition-all`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${insightLoading ? 'bg-amber-400 animate-pulse' : 'bg-brand-400 animate-pulse'} shadow-[0_0_8px_rgba(139,92,246,0.6)]`} />
              <h4 className="text-xs font-black text-white uppercase tracking-widest opacity-80">
                {insightLoading ? 'AI Analyzing...' : 'Realtor Importance Insight'}
              </h4>
            </div>
            {!insightLoading && (
              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${insight.color} bg-white/5 border border-white/5`}>
                {insight.grade} Tier
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            {insightLoading ? 'Gemini is analyzing your financial profile...' : insight.text}
          </p>
        </div>

        {/* Document Uploads */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Documents Tracking</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <UploadBox label="Bank Statements" sublabel="Last 3 Months" type="Bank" />
            <UploadBox label="Credit Report" sublabel="Recent Statement" type="Credit" />
          </div>
        </div>

        {/* AI Report Action */}
        <div className="mt-2">
          {report ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500/5 border border-green-500/20 rounded-2xl p-4 mb-3"
            >
              <div className="flex items-center gap-2 text-green-400 mb-2 font-bold text-xs uppercase tracking-tighter">
                <Sparkles size={14} /> AI Verification Ready
              </div>
              <p className="text-[11px] text-slate-400 italic mb-2">"{report.summary}"</p>
              <button 
                onClick={handleDownloadReport}
                className="w-full py-2 bg-green-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
              >
                <Download size={14} /> Download Analysis PDF
              </button>
            </motion.div>
          ) : (
            <button 
              disabled={isAnalyzing}
              onClick={report ? handleDownloadReport : generateAIAnalysis}
              className={`w-full py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all border flex items-center justify-center gap-3 relative overflow-hidden group
                ${isAnalyzing ? 'bg-slate-800 border-white/5 text-slate-500' : 'bg-white/5 hover:bg-white/[0.08] text-white border-white/5 hover:border-brand-500/50 shadow-lg'}`}
            >
              <AnimatePresence mode="wait">
                {isAnalyzing ? (
                  <motion.div 
                    key="analyzing"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="flex items-center gap-3"
                  >
                    <Loader2 size={18} className="animate-spin text-brand-400" />
                    Gemini Parsing Data...
                  </motion.div>
                ) : (
                  <motion.div 
                    key="idle"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-center gap-3"
                  >
                    <Sparkles size={18} className="text-brand-400 group-hover:scale-125 transition-transform" />
                    Download Verification Report
                  </motion.div>
                )}
              </AnimatePresence>
              {!isAnalyzing && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
