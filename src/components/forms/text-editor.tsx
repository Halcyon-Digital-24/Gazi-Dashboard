import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface TextEditorProps {
    editorText?: string;
    onChangeFunction: (value: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ editorText = '', onChangeFunction }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillInstanceRef = useRef<Quill | null>(null);

    // Toolbar options
    const toolbarOptions = [
        [{ size: ['small', 'normal', 'large', 'huge'] }], // Font size dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }], // Headers dropdown
        [{ font: [] }], // Font family

        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['blockquote', 'code-block'],
        [{ color: [] }, { background: [] }], // Font and background colors
        ['link', 'image', 'video', 'formula'], // Links, media, and formulas

        [{ header: 1 }, { header: 2 }], // Custom button values
        [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }], // Lists
        [{ script: 'sub' }, { script: 'super' }], // Superscript/Subscript
        [{ indent: '-1' }, { indent: '+1' }], // Indent/Outdent
        [{ direction: 'rtl' }], // Text direction (RTL)
        [{ align: [] }], // Text alignment

        ['clean'], // Remove formatting button
    ];

    useEffect(() => {
        if (editorRef.current && !quillInstanceRef.current) {
            // Initialize Quill
            quillInstanceRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: toolbarOptions,
                },
            });

            // Set initial content
            quillInstanceRef.current.root.innerHTML = editorText;

            // Listen for content changes
            quillInstanceRef.current.on('text-change', () => {
                const htmlContent = quillInstanceRef.current?.root.innerHTML || '';
                onChangeFunction(htmlContent);
            });
        }
    }, [editorText, onChangeFunction]);

    // Sync external changes to the editorText prop
    useEffect(() => {
        if (quillInstanceRef.current && quillInstanceRef.current.root.innerHTML !== editorText) {
            quillInstanceRef.current.root.innerHTML = editorText;
        }
    }, [editorText]);

    return <div ref={editorRef} style={{ height: '300px' }} />;
};

export default TextEditor;
