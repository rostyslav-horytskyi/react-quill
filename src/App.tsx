import { useState, useCallback } from 'react';
import Editor from './components/Editor/Editor';
import Toolbar from './components/Toolbar';
import { QuillProvider, useQuill } from './context';
import { Sun, Moon, FileText, Download, Eye, EyeOff } from 'lucide-react';

function AppContent() {
  const { quill } = useQuill();
  const [isDark, setIsDark] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const handleTextChange = useCallback(() => {
    if (quill) {
      const text = quill.getText();
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      setWordCount(words);
    }
  }, [quill]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  };

  const exportContent = () => {
    if (quill) {
      const content = JSON.stringify(quill.getContents(), null, 2);
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-10 backdrop-blur-lg border-b ${isDark ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'}`}
      >
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl ${isDark ? 'bg-blue-600' : 'bg-gradient-to-br from-blue-500 to-purple-600'}`}
              >
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Rich Text Editor
                </h1>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Powered by Quill
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Word count */}
              <span
                className={`text-sm px-3 py-1.5 rounded-lg ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}
              >
                {wordCount} words
              </span>

              {/* Preview toggle */}
              <button
                onClick={() => setIsPreview(!isPreview)}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                title={isPreview ? 'Edit mode' : 'Preview mode'}
              >
                {isPreview ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>

              {/* Export */}
              <button
                onClick={exportContent}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                title="Export as JSON"
              >
                <Download size={20} />
              </button>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800 text-yellow-400' : 'hover:bg-gray-100 text-gray-600'}`}
                title="Toggle theme"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div
          className={`rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${isDark ? 'bg-gray-800 shadow-gray-900/50' : 'bg-white shadow-gray-200/50'}`}
        >
          {/* Toolbar */}
          {!isPreview && <Toolbar />}

          {/* Editor */}
          <div className={`transition-colors ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <Editor
              placeholder="Start writing something amazing..."
              onTextChange={handleTextChange}
              readOnly={isPreview}
              className={isPreview ? 'opacity-90' : ''}
            />
          </div>

          {/* Footer */}
          <div
            className={`px-4 py-2 border-t flex items-center justify-between text-xs ${isDark ? 'bg-gray-900/50 border-gray-700 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
          >
            <span>Press Ctrl+B for bold, Ctrl+I for italic, Ctrl+U for underline</span>
            <span>{isPreview ? 'Preview Mode' : 'Edit Mode'}</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center">
        <p className={`text-sm ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
          Built with React, Quill & Tailwind CSS
        </p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <QuillProvider>
      <AppContent />
    </QuillProvider>
  );
}

export default App;
