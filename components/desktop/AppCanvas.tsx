import React, { useEffect, useRef, useMemo } from 'react';
import { AppMode, SelectionEvent } from '../../types';

interface AppCanvasProps {
  htmlContent: string;
  mode: AppMode;
  onElementSelect: (data: SelectionEvent) => void;
  onLearnTopicSubmit?: (topic: string) => void;
  isLoading?: boolean;
}

/** Script injected into every app iframe. Handles hover/click for interactive mode. */
const INJECTED_SCRIPT = `
<style>
  .gen-hover {
    outline: 3px solid #388bfd !important;
    outline-offset: -3px;
    background-color: rgba(56,139,253,0.08) !important;
    cursor: crosshair !important;
    box-shadow: 0 0 16px rgba(56,139,253,0.25) !important;
    transition: outline 0.1s, box-shadow 0.1s !important;
  }
</style>
<script>
(function() {
  let mode = 'browse';

  window.addEventListener('message', e => {
    if (e.data && e.data.type === 'SET_MODE') {
      mode = e.data.mode;
      document.body.style.cursor = mode === 'interactive' ? 'crosshair' : '';
      if (mode !== 'interactive') {
        document.querySelectorAll('.gen-hover').forEach(el => el.classList.remove('gen-hover'));
      }
    }
  });

  const getBlock = (el) => {
    let cur = el;
    while (cur && cur !== document.body && cur.parentElement !== document.body) {
      if (['SECTION','ARTICLE','DIV','MAIN','ASIDE','FIGURE','HEADER','FOOTER','NAV'].includes(cur.tagName)) return cur;
      cur = cur.parentElement;
    }
    return el === document.body ? null : el;
  };

  document.addEventListener('mouseover', e => {
    if (mode !== 'interactive') return;
    const t = getBlock(e.target);
    if (t) { e.stopPropagation(); t.classList.add('gen-hover'); }
  });

  document.addEventListener('mouseout', e => {
    if (mode !== 'interactive') return;
    const t = getBlock(e.target);
    if (t) t.classList.remove('gen-hover');
  });

  document.addEventListener('click', e => {
    if (mode !== 'interactive') return;
    e.preventDefault(); e.stopPropagation();
    const t = getBlock(e.target);
    if (t) {
      t.classList.remove('gen-hover');
      window.parent.postMessage({
        type: 'ELEMENT_SELECTED',
        payload: {
          htmlSnippet: t.outerHTML,
          textSummary: (t.innerText || '').slice(0, 200).trim()
        }
      }, '*');
    }
  }, true);

  // Learn app form submit handler
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    if (!form) return;
    form.addEventListener('submit', e => {
      const input = form.querySelector('input[type=text],textarea');
      if (input && input.value.trim()) {
        window.parent.postMessage({ type: 'LEARN_TOPIC_SUBMIT', topic: input.value.trim() }, '*');
      }
    });
  });
})();
<\/script>
`;

export const AppCanvas: React.FC<AppCanvasProps> = ({
  htmlContent,
  mode,
  onElementSelect,
  onLearnTopicSubmit,
  isLoading = false,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const srcDoc = useMemo(() => {
    const script = INJECTED_SCRIPT;
    if (htmlContent.includes('</body>')) {
      return htmlContent.replace('</body>', `${script}</body>`);
    }
    return htmlContent + script;
  }, [htmlContent]);

  // Sync mode to iframe
  useEffect(() => {
    iframeRef.current?.contentWindow?.postMessage({ type: 'SET_MODE', mode }, '*');
  }, [mode]);

  // Listen only to messages from THIS iframe using source check
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.source !== iframeRef.current?.contentWindow) return;
      if (e.data?.type === 'ELEMENT_SELECTED') {
        onElementSelect(e.data.payload as SelectionEvent);
      }
      if (e.data?.type === 'LEARN_TOPIC_SUBMIT' && onLearnTopicSubmit) {
        onLearnTopicSubmit(e.data.topic as string);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onElementSelect, onLearnTopicSubmit]);

  const handleLoad = () => {
    iframeRef.current?.contentWindow?.postMessage({ type: 'SET_MODE', mode }, '*');
  };

  return (
    <div className="relative w-full h-full bg-[#0d1117]">
      <iframe
        ref={iframeRef}
        srcDoc={srcDoc}
        title="App Content"
        className="w-full h-full border-none block"
        onLoad={handleLoad}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
      {/* Loading overlay — shown over this specific app window during generation */}
      {isLoading && (
        <div className="absolute inset-0 bg-[#0d1117]/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-[#30363d] border-t-[#388bfd] rounded-full animate-spin" />
          <span className="text-[#8b949e] text-xs font-mono">Generating…</span>
        </div>
      )}
    </div>
  );
};
