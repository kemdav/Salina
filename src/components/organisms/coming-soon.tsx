'use client';

export function ComingSoonView({ moduleName }: { moduleName: string }) {
    return (
        <div className="w-full h-full min-h-[600px] border-2 border-dashed border-[#E5E7EB] rounded-2xl flex flex-col items-center justify-center bg-white shadow-sm p-8 animate-in fade-in zoom-in-95 duration-500">
            
            <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-6 relative">
                <svg className="w-10 h-10 text-slate-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="absolute top-2 right-2 w-3 h-3 bg-primary/20 rounded-full blur-[2px]" />
                <div className="absolute bottom-4 left-4 w-4 h-4 bg-accent/20 rounded-full blur-[2px]" />
            </div>

            <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-3 font-[family:var(--font-heading)]">
                {moduleName}
            </h2>
            
            <p className="text-sm text-slate-500 max-w-md text-center leading-relaxed">
                This module is currently under construction. Our engineering team is working hard to bring these features to your workspace soon!
            </p>

            <button className="mt-8 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
                Return to Dashboard
            </button>
        </div>
    );
}