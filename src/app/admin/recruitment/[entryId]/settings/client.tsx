"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { updateRecruitmentSettings } from "@/lib/actions/recruitment-client";
import { FeedbackModal, FeedbackTone } from "@/components/organisms/feedback-modal";

type StageType = "form" | "screening" | "interview" | "deliberation";

export type RecruitmentStage = {
  id: string;
  name: string;
  type: StageType;
  meetingLink?: string;
  interviewDate?: string;
  interviewTime?: string;
  questions?: { id: string; label: string; required: boolean }[];
};

export type RecruitmentSettings = {
  stages: RecruitmentStage[];
};

function PlatformSelectorModal({
  isOpen,
  onClose,
  onSelect
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (platform: "google" | "zoom" | "custom", customLink?: string) => void;
}) {
  const [customLink, setCustomLink] = useState("");
  const [mode, setMode] = useState<"select" | "custom">("select");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
           <h3 className="text-xl font-bold text-slate-900 mb-4">Setup Meeting Link</h3>
           
           {mode === "select" ? (
             <div className="space-y-3">
               <button 
                 onClick={() => onSelect("google")}
                 className="w-full flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-colors text-left"
               >
                 <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                 </div>
                 <div>
                   <div className="font-semibold text-slate-900">Google Meet</div>
                   <div className="text-sm text-slate-500">Generate a placeholder Google Meet link</div>
                 </div>
               </button>

               <button 
                 onClick={() => onSelect("zoom")}
                 className="w-full flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
               >
                 <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                 </div>
                 <div>
                   <div className="font-semibold text-slate-900">Zoom</div>
                   <div className="text-sm text-slate-500">Generate a placeholder Zoom meeting link</div>
                 </div>
               </button>

               <button 
                 onClick={() => setMode("custom")}
                 className="w-full flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:border-slate-500 hover:bg-slate-50 transition-colors text-left"
               >
                 <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                 </div>
                 <div>
                   <div className="font-semibold text-slate-900">Custom Link</div>
                   <div className="text-sm text-slate-500">Manually input a URL</div>
                 </div>
               </button>
             </div>
           ) : (
             <div className="space-y-4">
               <div>
                 <Label>Meeting URL</Label>
                 <Input 
                   value={customLink}
                   onChange={(e) => setCustomLink(e.target.value)}
                   placeholder="https://..."
                   autoFocus
                   className="mt-1"
                 />
               </div>
               <div className="flex justify-end gap-2 pt-2">
                 <Button type="button" variant="ghost" onClick={() => setMode("select")}>Back</Button>
                 <Button type="button" onClick={() => {
                     onSelect("custom", customLink);
                     setMode("select");
                     setCustomLink("");
                 }}>Save Link</Button>
               </div>
             </div>
           )}
        </div>
        
        {mode === "select" && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function RecruitmentSettingsEditor({
  entryId,
  initialSettings,
  stageCounts = {},
}: {
  entryId: string;
  initialSettings: RecruitmentSettings;
  stageCounts?: Record<string, number>;
}) {
  const [stages, setStages] = useState<RecruitmentStage[]>(
    initialSettings.stages || []
  );
  const [isSaving, setIsSaving] = useState(false);
  const [platformSelectorStageIndex, setPlatformSelectorStageIndex] = useState<number | null>(null);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    tone: FeedbackTone;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    tone: "info",
    title: "",
    message: "",
  });

  const openModal = (config: Omit<typeof modalConfig, "isOpen">) => {
    setModalConfig({ ...config, isOpen: true });
  };

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const addStage = (type: StageType) => {
    const newStage: RecruitmentStage = {
      id: crypto.randomUUID(),
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Phase`,
      type,
    };
    if (type === "form") {
      newStage.questions = [];
    }
    setStages([...stages, newStage]);
  };

  const updateStage = (index: number, updates: Partial<RecruitmentStage>) => {
    const next = [...stages];
    next[index] = { ...next[index], ...updates };
    setStages(next);
  };

  const removeStage = (index: number) => {
    const stage = stages[index];
    const count = stageCounts[stage.id] || 0;
    if (count > 0) {
      openModal({
        tone: "error",
        title: "Cannot delete stage",
        message: `Cannot delete stage "${stage.name}" because there are still ${count} applicant(s) assigned to it. Please transfer them to another stage first.`,
        confirmText: "Okay",
        showCancel: false,
      });
      return;
    }

    openModal({
      tone: "warning",
      title: "Delete stage",
      message: `Are you sure you want to delete the stage "${stage.name}"?`,
      confirmText: "Delete",
      cancelText: "Cancel",
      showCancel: true,
      onConfirm: () => {
        setStages(stages.filter((_, i) => i !== index));
      },
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateRecruitmentSettings(entryId, { stages });
      openModal({
        tone: "success",
        title: "Settings Saved",
        message: "Settings saved successfully.",
        confirmText: "Okay",
        showCancel: false,
      });
    } catch (err) {
      console.error(err);
      openModal({
        tone: "error",
        title: "Save Failed",
        message: err instanceof Error ? err.message : "Failed to save settings.",
        confirmText: "Okay",
        showCancel: false,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-6">
        <Button onClick={() => addStage("form")} variant="secondary">
          + Add Form Stage
        </Button>
        <Button onClick={() => addStage("screening")} variant="secondary">
          + Add Screening Stage
        </Button>
        <Button onClick={() => addStage("interview")} variant="secondary">
          + Add Interview Stage
        </Button>
        <Button onClick={() => addStage("deliberation")} variant="secondary">
          + Add Deliberation
        </Button>
      </div>

      <div className="space-y-4">
        {stages.map((stage, index) => (
          <div key={stage.id} className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <span className="bg-slate-100 text-slate-500 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  {index + 1}
                </span>
                {stage.type.toUpperCase()}
              </h3>
              <Button onClick={() => removeStage(index)} variant="destructive" className="h-8 py-1 px-3 text-xs">
                Remove
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Phase Name</Label>
                <Input
                  value={stage.name}
                  onChange={(e) => updateStage(index, { name: e.target.value })}
                  placeholder="e.g. Technical Interview"
                />
              </div>

              {stage.type === "interview" && (
                <div className="space-y-4">
                  <div>
                    <Label>Meeting Link</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={stage.meetingLink || ""}
                        onChange={(e) => updateStage(index, { meetingLink: e.target.value })}
                        placeholder="No link set"
                        className="bg-slate-50 flex-1"
                      />
                      <Button 
                        type="button" 
                        variant="secondary"
                        onClick={() => setPlatformSelectorStageIndex(index)}
                      >
                        Set Link
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Interview Date (Optional)</Label>
                      <Input
                        type="date"
                        value={stage.interviewDate || ""}
                        onChange={(e) => updateStage(index, { interviewDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Interview Time (Optional)</Label>
                      <Input
                        type="time"
                        value={stage.interviewTime || ""}
                        onChange={(e) => updateStage(index, { interviewTime: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {stage.type === "form" && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <Label>Form Questions</Label>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="text-xs h-7 px-2"
                      onClick={() => {
                        const q = stage.questions || [];
                        updateStage(index, { questions: [...q, { id: crypto.randomUUID(), label: "", required: false }] });
                      }}
                    >
                      + Add Question
                    </Button>
                  </div>
                  
                  {stage.questions?.length === 0 && (
                    <p className="text-sm text-slate-400 italic">No custom questions added. Only baseline applicant details will be collected.</p>
                  )}
                  
                  <div className="space-y-2">
                    {stage.questions?.map((q, qIndex) => (
                      <div key={q.id} className="flex gap-2 items-center">
                        <Input 
                          value={q.label}
                          onChange={(e) => {
                            const nextQ = [...(stage.questions || [])];
                            nextQ[qIndex].label = e.target.value;
                            updateStage(index, { questions: nextQ });
                          }}
                          placeholder="Question label..."
                          className="flex-1"
                        />
                        <Button 
                          variant="ghost" 
                          onClick={() => {
                            const nextQ = stage.questions?.filter((_, qi) => qi !== qIndex);
                            updateStage(index, { questions: nextQ });
                          }}
                        >
                          X
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {stages.length === 0 && (
          <div className="text-center py-12 text-slate-500 border-2 border-dashed rounded-xl">
            No stages configured. Build your pipeline flow above.
          </div>
        )}
      </div>

      <div className="pt-6 mt-6 border-t flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Pipeline"}
        </Button>
      </div>

      <FeedbackModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        tone={modalConfig.tone}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        showCancel={modalConfig.showCancel}
        onConfirm={modalConfig.onConfirm}
      />

      <PlatformSelectorModal 
        isOpen={platformSelectorStageIndex !== null}
        onClose={() => setPlatformSelectorStageIndex(null)}
        onSelect={(platform, customLink) => {
          if (platformSelectorStageIndex === null) return;
          
          let newLink = customLink || "";
          
          if (platform === "google") {
            const mockId = Math.random().toString(36).substring(2, 11);
            newLink = `https://meet.google.com/${mockId.slice(0,3)}-${mockId.slice(3,7)}-${mockId.slice(7)}`;
          } else if (platform === "zoom") {
            newLink = `https://zoom.us/j/${Math.floor(Math.random() * 10000000000)}`;
          }
          
          if (newLink) {
            updateStage(platformSelectorStageIndex, { meetingLink: newLink });
          }
          
          setPlatformSelectorStageIndex(null);
          
          if (platform !== "custom") {
            openModal({
              tone: "success",
              title: "Link Generated",
              message: `A placeholder ${platform === "google" ? "Google Meet" : "Zoom"} link has been generated for this stage.`,
              confirmText: "Okay",
              showCancel: false,
            });
          }
        }}
      />
    </div>
  );
}
