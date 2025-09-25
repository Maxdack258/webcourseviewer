import React, { useEffect, useRef, useState } from 'react';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';

declare const hljs: any;

interface CodeBlockProps {
    language: string;
    code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
    const codeRef = useRef<HTMLElement>(null);
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if (codeRef.current) {
            hljs.highlightElement(codeRef.current);
        }
    }, [code, language]);
    
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="relative my-6 not-prose">
            <pre className="rounded-lg shadow-lg">
                <code ref={codeRef} className={`language-${language || 'plaintext'}`}>
                    {(code || '').trim()}
                </code>
            </pre>
            <button 
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors"
                aria-label="Copy code"
            >
                {isCopied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
            </button>
        </div>
    );
};

export default CodeBlock;