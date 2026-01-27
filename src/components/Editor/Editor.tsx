import { forwardRef, useRef, useEffect, useLayoutEffect } from 'react';
import Quill from 'quill';
import CustomList from '../../quill/formats/list.ts';
import '../../quill/formats/font';
import { syntaxOptions } from '../../quill/modules/syntax';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import 'highlight.js/styles/github.css';
import 'quill-table-up/index.css';
import type { EditorProps } from './types';
import { useQuill } from '../../context';
import './Editor.scss';
import '../../modules/CharCounter';
import '../../modules/ImageDrop';
import '../../modules/ImageResize';
import '../../modules/Mention';
import { TableSelection } from '../../modules/Table';

Quill.register('formats/list', CustomList, true);

const Editor = forwardRef<Quill | null, EditorProps>((props, ref) => {
  const { setQuill } = useQuill();
  const {
    defaultValue,
    readOnly = false,
    placeholder = '',
    theme = 'snow',
    className = '',
    charCounterRef,
    charCounterLimit,
    mentionSource,
    onTextChange,
    onSelectionChange,
    onReady,
  } = props;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const onTextChangeRef = useRef(onTextChange);
  const onSelectionChangeRef = useRef(onSelectionChange);
  const onReadyRef = useRef(onReady);

  useLayoutEffect(() => {
    onTextChangeRef.current = onTextChange;
    onSelectionChangeRef.current = onSelectionChange;
    onReadyRef.current = onReady;
  }, [onTextChange, onSelectionChange, onReady]);

  // Initialize Quill editor
  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    // Create editor container
    const editorContainer = container.appendChild(document.createElement('div'));

    const hasCharCounter = Boolean(charCounterRef) || charCounterLimit !== undefined;
    const mentionModule = mentionSource ? { source: mentionSource } : {};

    const quill = new Quill(editorContainer, {
      theme,
      readOnly,
      placeholder,
      modules: {
        toolbar: false,
        imageDrop: true,
        imageResize: true,
        syntax: syntaxOptions,
        mention: mentionModule,
        'table-up': {
          full: true,
          modules: [{ module: TableSelection, options: {} }],
        },
        ...(hasCharCounter
          ? {
              charCounter: {
                container: charCounterRef?.current ?? undefined,
                limit: charCounterLimit,
              },
            }
          : {}),
      },
    });

    if (typeof ref === 'function') {
      ref(quill);
    } else if (ref) {
      ref.current = quill;
    }

    // Set default content if provided
    if (defaultValueRef.current) {
      quill.setContents(defaultValueRef.current);
    }

    // Handle text change events
    quill.on(Quill.events.TEXT_CHANGE, (...args) => {
      onTextChangeRef.current?.(...args);
    });

    // Handle selection change events
    quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
      onSelectionChangeRef.current?.(...args);
    });

    // Register quill instance with context
    setQuill(quill);

    // Notify that the editor is ready
    onReadyRef.current?.(quill);

    // Cleanup on unmount
    return () => {
      setQuill(null);
      if (typeof ref === 'function') {
        ref(null);
      } else if (ref) {
        ref.current = null;
      }
      quill.off(Quill.events.TEXT_CHANGE);
      quill.off(Quill.events.SELECTION_CHANGE);
      container.innerHTML = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeholder, ref, theme]);

  // Handle readOnly prop changes separately to avoid reinitializing Quill
  useEffect(() => {
    if (ref && 'current' in ref && ref.current) {
      ref.current.enable(!readOnly);
    }
  }, [readOnly, ref]);

  return (
    <div
      ref={containerRef}
      className={`editor-container ${className}`}
      data-testid={'editor-container'}
    />
  );
});

Editor.displayName = 'Editor';

export default Editor;
