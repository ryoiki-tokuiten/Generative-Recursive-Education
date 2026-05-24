import React, { useEffect, useRef, useMemo } from 'react';
import { AppMode, SelectionEvent } from '../types';

interface GenerativeCanvasProps {
  htmlContent: string;
  mode: AppMode;
  onElementSelect: (data: SelectionEvent) => void;
}

const INJECTED_SCRIPT = `
<style>
  .interactive-hover {
    outline: 4px solid #6366f1 !important; /* Indigo 500 */
    outline-offset: -4px;
    background-color: rgba(99, 102, 241, 0.1) !important;
    cursor: help !important;
    transition: all 0.2s ease;
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.3) !important;
  }
</style>
<script>
  (function() {
    let currentMode = 'browse';
    
    // --- Message Handling ---
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SET_MODE') {
        currentMode = event.data.mode;
        document.body.style.cursor = currentMode === 'interactive' ? 'help' : 'default';
        
        // Cleanup on mode switch
        if (currentMode !== 'interactive') {
          document.querySelectorAll('.interactive-hover').forEach(el => 
            el.classList.remove('interactive-hover')
          );
        }
      }
    });

    // --- Interaction Logic ---
    const getTargetBlock = (target) => {
       let current = target;
       // Traverse up to find a significant container, but stop before body
       while (current && current !== document.body && current.parentElement !== document.body) {
           const tag = current.tagName;
           // We prioritize semantic blocks or divs with content
           if (['SECTION', 'ARTICLE', 'DIV', 'MAIN', 'ASIDE', 'FIGURE'].includes(tag)) {
               return current;
           }
           current = current.parentElement;
       }
       return target === document.body ? null : target;
    };

    const getComponentId = (target) => {
      if (target.dataset.recursiveComponentId) {
        return target.dataset.recursiveComponentId;
      }

      const path = [];
      let current = target;

      while (current && current !== document.body && current !== document.documentElement) {
        const tag = current.tagName.toLowerCase();
        const siblings = current.parentElement
          ? Array.from(current.parentElement.children).filter(sibling => sibling.tagName === current.tagName)
          : [current];
        const position = String(siblings.indexOf(current) + 1).padStart(2, '0');
        path.unshift(tag + '-' + position);
        current = current.parentElement;
      }

      const pathKey = path.join('-');
      const semanticName = (target.id || target.getAttribute('aria-label') || target.tagName.toLowerCase())
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 18) || 'block';
      let hash = 0;

      for (let index = 0; index < pathKey.length; index += 1) {
        hash = ((hash << 5) - hash + pathKey.charCodeAt(index)) | 0;
      }

      const componentId = 'cmp-' + semanticName + '-' + Math.abs(hash).toString(36).padStart(5, '0').slice(0, 5);
      target.dataset.recursiveComponentId = componentId;
      return componentId;
    };

    document.addEventListener('mouseover', (e) => {
      if (currentMode !== 'interactive') return;
      const target = getTargetBlock(e.target);
      if (target) {
        e.stopPropagation();
        target.classList.add('interactive-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
       if (currentMode !== 'interactive') return;
       const target = getTargetBlock(e.target);
       if (target) {
         target.classList.remove('interactive-hover');
       }
    });

    document.addEventListener('click', (e) => {
      if (currentMode !== 'interactive') return;
      e.preventDefault();
      e.stopPropagation();
      
      const target = getTargetBlock(e.target);
      if (target) {
        target.classList.remove('interactive-hover');
        const componentId = getComponentId(target);
        const htmlSnippet = target.outerHTML.replace(/\\sdata-recursive-component-id="[^"]*"/g, '');
        
        // Send to parent
        window.parent.postMessage({
          type: 'ELEMENT_SELECTED',
          payload: {
            componentId,
            htmlSnippet,
            textSummary: (target.innerText || "").substring(0, 150)
          }
        }, '*');
      }
    }, true); // Capture phase
  })();
</script>
`;

export const GenerativeCanvas: React.FC<GenerativeCanvasProps> = ({ 
  htmlContent, 
  mode, 
  onElementSelect 
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Construct the full source document with injected scripts
  const srcDoc = useMemo(() => {
    // Attempt to insert before closing body, otherwise append
    if (htmlContent.includes('</body>')) {
        return htmlContent.replace('</body>', `${INJECTED_SCRIPT}</body>`);
    }
    return htmlContent + INJECTED_SCRIPT;
  }, [htmlContent]);

  // Handle Mode Updates via PostMessage
  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'SET_MODE', mode }, '*');
    }
  }, [mode]);

  // Handle Selection Messages from Iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'ELEMENT_SELECTED') {
        onElementSelect(event.data.payload);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onElementSelect]);

  // Initial load handler to sync mode
  const handleLoad = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'SET_MODE', mode }, '*');
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-slate-900">
      <iframe
        ref={iframeRef}
        srcDoc={srcDoc}
        title="Generative Content"
        className="w-full h-full border-none"
        onLoad={handleLoad}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  );
};
