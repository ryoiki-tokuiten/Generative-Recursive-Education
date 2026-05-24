import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface GenerationOverlayProps {
  title?: string;
}

export const GenerationOverlay: React.FC<GenerationOverlayProps> = ({
  title = 'Generating your lesson'
}) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0c]/95 px-6 backdrop-blur-md">
    <div className="w-full max-w-md rounded-2xl border border-[#2a2a35] bg-[#121217] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2 rounded-full border border-[#00e599]/20 bg-[#00e599]/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#00e599]">
          <Sparkles size={13} />
          Generation
        </div>
        <Loader2 className="animate-spin text-[#00e599]" size={21} />
      </div>

      <h2 className="mb-2 text-2xl font-semibold tracking-tight text-[#e2e8f0]">{title}</h2>
      <p className="text-sm leading-relaxed text-[#94a3b8]">
        Designing the structure, interactive explanations, and visual layer.
      </p>

      <div className="mt-8 h-1 overflow-hidden rounded-full bg-[#1a1a24]">
        <div className="h-full w-2/5 animate-pulse rounded-full bg-[#00e599] shadow-[0_0_16px_rgba(0,229,153,0.55)]" />
      </div>
    </div>
  </div>
);
