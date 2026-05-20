"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { updateRecruitmentSettings } from "@/lib/actions/recruitment";

type StageType = "form" | "interview" | "deliberation";

export type RecruitmentStage = {
  id: string;
  name: string;
  type: StageType;
  meetingLink?: string;
  questions?: { id: string; label: string; required: boolean }[];
};

export type RecruitmentSettings = {
  stages: RecruitmentStage[];
};

export function RecruitmentSettingsEditor({
  entryId,
  initialSettings,
}: {
  entryId: string;
  initialSettings: RecruitmentSettings;
}) {
  const [stages, setStages] = useState<RecruitmentStage[]>(
    initialSettings.stages || []
  );
  const [isSaving, setIsSaving] = useState(false);

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
    setStages(stages.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateRecruitmentSettings(entryId, { stages });
      alert("Settings saved successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to save settings.");
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
                <div>
                  <Label>Meeting Link (e.g. Google Meet / Zoom)</Label>
                  <Input
                    value={stage.meetingLink || ""}
                    onChange={(e) => updateStage(index, { meetingLink: e.target.value })}
                    placeholder="https://meet.google.com/..."
                  />
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
    </div>
  );
}
