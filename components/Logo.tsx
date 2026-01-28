
import React from 'react';

export const Logo: React.FC = () => (
    <div className="flex items-center gap-2" aria-hidden="true">
        <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-500">
            <path d="M4 25V7.94975L12.0625 15.9375L16 11.9375L19.9375 15.9375L28 7.94975V25" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 19.5L18.5 22L16 24.5L13.5 22L16 19.5Z" fill="currentColor"/>
            <path d="M25.5 10L24 11.5L25.5 13L27 11.5L25.5 10Z" fill="currentColor" stroke="currentColor" />
        </svg>
        <span className="text-2xl font-bold text-slate-100">MakeMeLookLike</span>
    </div>
);