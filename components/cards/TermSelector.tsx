'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

const terms = ['Spring 2026', 'Fall 2025', 'Summer 2025', 'Spring 2025'];

export default function TermSelector({
    defaultTerm,
}: Readonly<{
    defaultTerm: string;
}>) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(defaultTerm);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="relative inline-block">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-0.25 font-sans text-[0.8125rem] font-semibold tracking-[0.040625rem] text-[#1d1b20]"
            >
                {selected}
                <Image
                    src="/images/chevron-down.svg"
                    alt=""
                    width={16}
                    height={16}
                />
            </button>
            {isOpen && (
                <div className="absolute left-0 top-full z-10 mt-[0.25rem] w-[9rem] rounded border border-gray-200 bg-white shadow-lg">
                    {terms.map((term) => (
                        <button
                            key={term}
                            type="button"
                            onClick={() => {
                                setSelected(term);
                                setIsOpen(false);
                            }}
                            className={`block w-full px-[0.75rem] py-[0.375rem] text-left text-[0.75rem] hover:bg-gray-50 ${
                                term === selected
                                    ? 'font-semibold text-[#3182ce]'
                                    : 'text-slate-600'
                            }`}
                        >
                            {term}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
