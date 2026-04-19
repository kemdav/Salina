'use client';

import { useState } from "react";
import { Switch } from "@/components/atoms/switch";

interface Stage {
    id: string;
    name: string;
}

const DEFAULT_STAGES: Stage[] = [
    { id: "1", name: "Application" },
    { id: "2", name: "Screening" },
    { id: "3", name: "Interview" },
    { id: "4", name: "Offer" },
];

export function PipelineSetupForm() {
    const [stages, setStages] = useState<Stage[]>(DEFAULT_STAGES);
    const [draggingIdx, setDraggingIdx] = useState<number | null>(null);

    const [reqResume, setReqResume] = useState(true);
    const [reqCoverLetter, setReqCoverLetter] = useState(false);
    const [reqPortfolio, setReqPortfolio] = useState(false);
    const [reqLinkedIn, setReqLinkedIn] = useState(true);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        setDraggingIdx(index);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", index.toString());
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
        e.preventDefault();
        if (draggingIdx === null || draggingIdx === targetIndex) return;

        const newStages = [...stages];
        const draggedItem = newStages[draggingIdx];
        newStages.splice(draggingIdx, 1);
        newStages.splice(targetIndex, 0, draggedItem);

        setDraggingIdx(targetIndex);
        setStages(newStages);
    };

    const handleDragEnd = () => setDraggingIdx(null);

    const handleAddStage = () => {
        const newId = Math.random().toString(36).substr(2, 9);
        setStages([...stages, { id: newId, name: "New Stage" }]);
    };

    const handleRemoveStage = (idToRemove: string) => {
        setStages(stages.filter(s => s.id !== idToRemove));
    };

    const handleUpdateStageName = (id: string, newName: string) => {
        setStages(stages.map(s => s.id === id ? { ...s, name: newName } : s));
    };

    return (
        <div className="flex flex-col w-full animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="mb-8 lg:mb-10 w-full">
                <h1 className="text-sm font-light text-[var(--muted)] uppercase tracking-wide mb-2">
                    ONBOARDING &nbsp;/&nbsp; <span className="text-foreground font-medium">PIPELINE CONFIGURATION</span>
                </h1>
                <h2 className="text-4xl sm:text-5xl font-bold font-[family:var(--font-heading)] text-foreground leading-none tracking-tight">
                    The Flow.
                </h2>
                <p className="text-sm text-[var(--muted)] mt-3">
                    Structure the journey. Define how your candidates go through the process.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 w-full items-start">

                {/* Recruitment Stages */}
                <div className="flex flex-col w-full lg:w-[32%] shrink-0 lg:max-h-[600px] overflow-y-auto overscroll-contain -ml-2 pl-2 pr-2 sm:pr-4 pb-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full transition-colors">
                    <div className="flex flex-col gap-4">
                        <div className="border-b border-border pb-2">
                            <h3 className="text-lg font-semibold text-foreground">Recruitment Stages</h3>
                            <p className="text-xs text-[var(--muted)] mt-1">Drag to reorder the flow. You can edit this as you like.</p>
                        </div>

                        <div className="flex flex-col gap-2">
                            {stages.map((stage, index) => (
                                <div
                                    key={stage.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragEnter={(e) => handleDragEnter(e, index)}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDragEnd={handleDragEnd}
                                    className={`flex items-center gap-3 bg-white border border-[#E5E7EB] rounded-[var(--radius)] p-2 transition-all ${draggingIdx === index ? 'opacity-50 scale-[0.98] shadow-inner bg-slate-50' : 'shadow-sm hover:border-slate-300'}`}
                                >
                                    <div className="cursor-grab active:cursor-grabbing px-1 text-slate-400 hover:text-slate-600 shrink-0">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="5" cy="4" r="1.5" /><circle cx="5" cy="8" r="1.5" /><circle cx="5" cy="12" r="1.5" />
                                            <circle cx="11" cy="4" r="1.5" /><circle cx="11" cy="8" r="1.5" /><circle cx="11" cy="12" r="1.5" />
                                        </svg>
                                    </div>

                                    <input
                                        type="text"
                                        value={stage.name}
                                        onChange={(e) => handleUpdateStageName(stage.id, e.target.value)}
                                        className="flex-1 min-w-0 bg-transparent text-sm font-medium outline-none text-foreground"
                                    />

                                    <button
                                        onClick={() => handleRemoveStage(stage.id)}
                                        className="h-7 w-7 shrink-0 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleAddStage}
                            className="mt-2 flex items-center justify-center gap-2 w-full py-2.5 rounded-[var(--radius)] border border-dashed border-[#E5E7EB] text-sm font-medium text-[var(--muted)] hover:bg-slate-50 hover:text-foreground hover:border-slate-300 transition-colors"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                            Add Stage
                        </button>
                    </div>
                </div>

                {/* Application Form Toggles */}
                <div className="flex flex-col w-full lg:w-[26%] shrink-0 lg:max-h-[600px] overflow-y-auto overscroll-contain pr-2 sm:pr-4 pb-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full transition-colors">
                    <div className="flex flex-col gap-4">
                        <div className="border-b border-border pb-2">
                            <h3 className="text-lg font-semibold text-foreground">Application Fields</h3>
                            <p className="text-xs text-[var(--muted)] mt-1">Select candidate requirements.</p>
                        </div>

                        <div className="flex flex-col gap-5 bg-[#F9FAFB] border border-[#E5E7EB] p-5 rounded-xl">
                            <div className="flex items-center justify-between gap-4">
                                <h4 className="text-sm font-medium text-foreground">Resume / CV</h4>
                                <Switch checked={reqResume} onChange={setReqResume} />
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <h4 className="text-sm font-medium text-foreground">Cover Letter</h4>
                                <Switch checked={reqCoverLetter} onChange={setReqCoverLetter} />
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <h4 className="text-sm font-medium text-foreground">Portfolio URL</h4>
                                <Switch checked={reqPortfolio} onChange={setReqPortfolio} />
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <h4 className="text-sm font-medium text-foreground">LinkedIn Profile</h4>
                                <Switch checked={reqLinkedIn} onChange={setReqLinkedIn} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Preview Panel */}
                <div className="flex-1 flex flex-col w-full h-full lg:min-h-[600px]">
                    <div className="w-full h-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 flex flex-col shadow-inner overflow-hidden">

                        <div className="flex items-center justify-between mb-4 shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Form Preview</span>
                            </div>
                        </div>

                        <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200">

                            <div className="p-5 border-b border-[#E5E7EB] bg-slate-50/50">
                                <h3 className="text-lg font-bold text-slate-800">Software Engineer</h3>
                                <p className="text-xs text-slate-500 mt-1">Acme Corp • Remote • Full-Time</p>
                            </div>

                            <div className="p-5 flex flex-col gap-5">

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-slate-600">First Name <span className="text-red-500">*</span></label>
                                        <div className="h-8 w-full bg-slate-50 border border-slate-200 rounded-md" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-slate-600">Last Name <span className="text-red-500">*</span></label>
                                        <div className="h-8 w-full bg-slate-50 border border-slate-200 rounded-md" />
                                    </div>
                                    <div className="col-span-2 flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-slate-600">Email Address <span className="text-red-500">*</span></label>
                                        <div className="h-8 w-full bg-slate-50 border border-slate-200 rounded-md" />
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                <div className="flex flex-col gap-4">
                                    <div className={`flex flex-col gap-1.5 transition-all duration-300 ${reqResume ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden hidden'}`}>
                                        <label className="text-xs font-semibold text-slate-600">Resume / CV <span className="text-red-500">*</span></label>
                                        <div className="border border-dashed border-slate-300 rounded-md h-16 flex flex-col items-center justify-center bg-slate-50 text-slate-400 gap-1">
                                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                            <span className="text-[9px]">Click to upload file</span>
                                        </div>
                                    </div>

                                    <div className={`flex flex-col gap-1.5 transition-all duration-300 ${reqCoverLetter ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden hidden'}`}>
                                        <label className="text-xs font-semibold text-slate-600">Cover Letter</label>
                                        <div className="h-20 w-full bg-slate-50 border border-slate-200 rounded-md" />
                                    </div>

                                    <div className={`flex flex-col gap-1.5 transition-all duration-300 ${reqPortfolio ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden hidden'}`}>
                                        <label className="text-xs font-semibold text-slate-600">Portfolio Website</label>
                                        <div className="h-8 w-full bg-slate-50 border border-slate-200 rounded-md flex items-center px-2">
                                            <span className="text-[10px] text-slate-400">https://</span>
                                        </div>
                                    </div>

                                    <div className={`flex flex-col gap-1.5 transition-all duration-300 ${reqLinkedIn ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden hidden'}`}>
                                        <label className="text-xs font-semibold text-slate-600">LinkedIn Profile</label>
                                        <div className="h-8 w-full bg-slate-50 border border-slate-200 rounded-md flex items-center px-2">
                                            <span className="text-[10px] text-slate-400">linkedin.com/in/</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-3 mt-1 border-t border-slate-100">
                                    <div className="h-9 w-full bg-slate-800 rounded-md flex items-center justify-center">
                                        <span className="text-xs font-medium text-white">Submit Application</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}