import { AppDefinition } from '../../types';

// Raw HTML imports — Vite imports these as strings at build time
import learnHtml      from './learn.html?raw';
import terminalHtml   from './terminal.html?raw';
import browserHtml    from './browser.html?raw';
import notesHtml      from './notes.html?raw';
import filesHtml      from './files.html?raw';
import calendarHtml   from './calendar.html?raw';
import musicHtml      from './music.html?raw';
import calculatorHtml from './calculator.html?raw';
import weatherHtml    from './weather.html?raw';

export const APP_HTML_MAP: Record<string, string> = {
  learn:      learnHtml,
  terminal:   terminalHtml,
  browser:    browserHtml,
  notes:      notesHtml,
  files:      filesHtml,
  calendar:   calendarHtml,
  music:      musicHtml,
  calculator: calculatorHtml,
  weather:    weatherHtml,
};

export const APP_REGISTRY: AppDefinition[] = [
  {
    id: 'learn',
    name: 'Learn',
    description: 'Generative recursive education powered by Gemini',
    category: 'system',
    accentColor: '#388bfd',
    iconPath: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z',
    iconPath2: 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z',
  },
  {
    id: 'terminal',
    name: 'Terminal',
    description: 'Command-line shell with virtual filesystem',
    category: 'system',
    accentColor: '#57ab5a',
    iconPath: 'M4 17l6-6-6-6M12 19h8',
  },
  {
    id: 'browser',
    name: 'Browser',
    description: 'Web browser with tabs and bookmarks',
    category: 'system',
    accentColor: '#539bf5',
    iconPath: 'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  },
  {
    id: 'notes',
    name: 'Notes',
    description: 'Rich text notes editor with organization',
    category: 'productivity',
    accentColor: '#e3b341',
    iconPath: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  },
  {
    id: 'files',
    name: 'Files',
    description: 'File manager with grid and list views',
    category: 'system',
    accentColor: '#96d0ff',
    iconPath: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z',
  },
  {
    id: 'calendar',
    name: 'Calendar',
    description: 'Monthly calendar with events and scheduling',
    category: 'productivity',
    accentColor: '#f47067',
    iconPath: 'M8 2v4 M16 2v4 M3 10h18 M21 8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8z',
  },
  {
    id: 'music',
    name: 'Music',
    description: 'Music player with playlists and queue',
    category: 'media',
    accentColor: '#bc8cff',
    iconPath: 'M9 18V5l12-2v13',
    iconPath2: 'M6 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M18 13a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  },
  {
    id: 'calculator',
    name: 'Calculator',
    description: 'Scientific calculator with history',
    category: 'utility',
    accentColor: '#57ab5a',
    iconPath: 'M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M8 6h.01 M12 6h.01 M16 6h.01 M8 10h.01 M12 10h.01 M16 10h4 M8 14h.01 M12 14h.01 M8 18h.01 M12 18h.01 M16 14h4',
  },
  {
    id: 'weather',
    name: 'Weather',
    description: 'Real-time weather and 7-day forecast',
    category: 'utility',
    accentColor: '#539bf5',
    iconPath: 'M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z',
  },
];

export const getAppById = (id: string): AppDefinition | undefined =>
  APP_REGISTRY.find(a => a.id === id);
