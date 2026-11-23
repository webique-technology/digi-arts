'use client';
import { useEffect, useRef, useState } from 'react';

const TOOLS = [
  { label: 'P', title: 'Paragraph', run: () => document.execCommand('formatBlock', false, 'p') },
  { label: 'H2', title: 'Heading', run: () => document.execCommand('formatBlock', false, 'h2') },
  { label: 'H3', title: 'Subheading', run: () => document.execCommand('formatBlock', false, 'h3') },
  { label: 'B', title: 'Bold', run: () => document.execCommand('bold'), style: { fontWeight: 700 } },
  { label: 'I', title: 'Italic', run: () => document.execCommand('italic'), style: { fontStyle: 'italic' } },
  { label: '1.', title: 'Numbered list (shown as step cards)', run: () => document.execCommand('insertOrderedList') },
  { label: '•', title: 'Bulleted list (shown as cards)', run: () => document.execCommand('insertUnorderedList') },
  { label: '❝', title: 'Quote', run: () => document.execCommand('formatBlock', false, 'blockquote') },
  {
    label: 'Link', title: 'Link',
    run: () => {
      const url = window.prompt('Link URL (https://… or /path)');
      if (url) document.execCommand('createLink', false, url);
    },
  },
  { label: 'Clear', title: 'Remove formatting', run: () => document.execCommand('removeFormat') },
];

/** Minimal WYSIWYG for blog bodies. The API sanitizes the HTML before storing it. */
export default function RichTextEditor({ id, value, onChange }) {
  const ref = useRef(null);
  const [mode, setMode] = useState('visual');

  useEffect(() => {
    if (mode === 'visual' && ref.current && ref.current.innerHTML !== value) ref.current.innerHTML = value || '';
    // Only sync on mount / mode switch so the caret isn't reset while typing
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const exec = (tool) => {
    ref.current?.focus();
    tool.run();
    onChange(ref.current?.innerHTML || '');
  };

  return (
    <div className="rte">
      <div className="rte__bar" role="toolbar" aria-label="Formatting">
        {TOOLS.map((t) => (
          <button key={t.label} type="button" title={t.title} aria-label={t.title} style={t.style}
            disabled={mode !== 'visual'} onMouseDown={(e) => e.preventDefault()} onClick={() => exec(t)}>
            {t.label}
          </button>
        ))}
        <button type="button" className="rte__mode" onClick={() => setMode(mode === 'visual' ? 'html' : 'visual')}>
          {mode === 'visual' ? '</> HTML' : 'Visual'}
        </button>
      </div>
      {mode === 'visual' ? (
        <div id={id} ref={ref} className="rte__area blog-rich" contentEditable suppressContentEditableWarning role="textbox" aria-multiline="true"
          onInput={(e) => onChange(e.currentTarget.innerHTML)}
          onPaste={(e) => { e.preventDefault(); document.execCommand('insertText', false, e.clipboardData.getData('text/plain')); }} />
      ) : (
        <textarea id={id} className="rte__html" value={value} onChange={(e) => onChange(e.target.value)} spellCheck={false} />
      )}
    </div>
  );
}
