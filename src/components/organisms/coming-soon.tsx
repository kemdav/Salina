'use client';

export function ComingSoon({ moduleName = "This Module" }: { moduleName?: string }) {
    return (
        <div className="w-full max-w-2xl border-2 border-dashed border-[#E5E7EB] rounded-2xl flex flex-col items-center justify-center bg-white shadow-sm p-12 mt-10 mx-auto">
            
            <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </div>

            <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-3 font-[family:var(--font-heading)] text-center">
                {moduleName} <br/> is coming soon.
            </h2>
            
            <p className="text-sm text-slate-500 max-w-md text-center leading-relaxed">
                We are actively building this feature. Please check back later huhu. We are working hard.
            </p>
        </div>
    );
}