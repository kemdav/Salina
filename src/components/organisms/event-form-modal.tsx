import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { TenantBranding, NewEventPayload } from "@/components/molecules/calendar-day"; // Adjust path if needed


interface EventFormModalProps {
    tenant: TenantBranding;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (eventData: NewEventPayload) => void;
}

export function EventFormModal({ tenant, isOpen, onClose, onSubmit }: EventFormModalProps) {
    const [title, setTitle] = useState("");
    const [type, setType] = useState("Workshop");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Pass the dummy data payload up to the page
        onSubmit({ title, type, date, time, location, description });

        // Reset form & close
        setTitle("");
        setType("Workshop");
        setDate("");
        setTime("");
        setLocation("");
        setDescription("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-all duration-300">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">

                {/* Themed Header */}
                <div
                    className="px-6 py-5 relative shrink-0"
                    style={{ backgroundColor: tenant.primaryColor, color: tenant.textColor }}
                >
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none" />
                    <h2 className="relative z-10 text-xl font-bold font-[family:var(--font-heading)]">
                        Create New Event
                    </h2>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="p-6 space-y-4 overflow-y-auto flex-1">

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Event Title</label>
                            <Input
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., General Assembly"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Event Type</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full h-10 px-3 rounded-[var(--radius)] border-[1.5px] border-[#E5E7EB] bg-[#F9FAFB] text-sm outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition duration-200"
                                >
                                    <option>Workshop</option>
                                    <option>Competition</option>
                                    <option>Academic</option>
                                    <option>Social</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Date</label>
                                <Input
                                    type="date"
                                    required
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Time</label>
                                <Input
                                    required
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    placeholder="1:00 PM - 3:00 PM"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Location</label>
                                <Input
                                    required
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Main Auditorium"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Description</label>
                            <textarea
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="w-full rounded-[var(--radius)] border-[1.5px] border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-3 text-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 resize-none"
                                placeholder="Describe the event details..."
                            />
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                        <Button variant="secondary" onClick={onClose} type="button">
                            Cancel
                        </Button>
                        <Button variant="dark" type="submit">
                            Save Event
                        </Button>
                    </div>
                </form>

            </div>
        </div>
    );
}