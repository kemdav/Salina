'use client';

import { useState, useRef, useEffect } from 'react';
import { Member } from '@/lib/actions/members';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { FeedbackModal } from '@/components/organisms/feedback-modal';

interface MemberActionsMenuProps {
    member: Member;
    onRemove: (id: string, userId: string) => void;
    onRename: (id: string, userId: string, newName: string) => void;
    onChangeRole: (id: string, newRole: string) => void;
    onUpdateTags: (id: string, tags: string[]) => void;
}

function ModalOverlay({ children, isOpen }: { children: React.ReactNode, isOpen: boolean }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}

function RenameModal({ isOpen, onClose, member, onSave }: { isOpen: boolean, onClose: () => void, member: Member, onSave: (name: string) => void }) {
    const [name, setName] = useState(member.name || '');

    const handleSave = () => {
        onSave(name);
        onClose();
    };

    return (
        <ModalOverlay isOpen={isOpen}>
            <h3 className="text-xl font-bold mb-4">Rename Member</h3>
            <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Display Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. John Doe" />
            </div>
            <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
            </div>
        </ModalOverlay>
    );
}

function RoleModal({ isOpen, onClose, member, onSave }: { isOpen: boolean, onClose: () => void, member: Member, onSave: (role: string) => void }) {
    const [role, setRole] = useState(member.role);

    const handleSave = () => {
        onSave(role);
        onClose();
    };

    return (
        <ModalOverlay isOpen={isOpen}>
            <h3 className="text-xl font-bold mb-4">Change Role</h3>
            <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Select Role</label>
                <select 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full h-11 rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                >
                    <option value="member">Member</option>
                    <option value="officer">Officer</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
            </div>
        </ModalOverlay>
    );
}

function TagsModal({ isOpen, onClose, member, onSave }: { isOpen: boolean, onClose: () => void, member: Member, onSave: (tags: string[]) => void }) {
    const [tags, setTags] = useState<string[]>(member.tags || []);
    const [input, setInput] = useState('');

    const handleSave = () => {
        onSave(tags);
        onClose();
    };
    
    const handleAdd = () => {
        const t = input.trim();
        if (t && !tags.includes(t)) {
            setTags([...tags, t]);
        }
        setInput('');
    };

    const handleRemove = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    return (
        <ModalOverlay isOpen={isOpen}>
            <h3 className="text-xl font-bold mb-4">Edit Tags</h3>
            <div className="mb-6 space-y-4">
                <div className="flex gap-2">
                    <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="New tag..." onKeyDown={(e) => e.key === 'Enter' && handleAdd()} />
                    <Button onClick={handleAdd}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {tags.length === 0 && <span className="text-sm text-slate-400">No tags added.</span>}
                    {tags.map(tag => (
                        <div key={tag} className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full text-sm">
                            <span>{tag}</span>
                            <button onClick={() => handleRemove(tag)} className="text-slate-400 hover:text-slate-700 rounded-full font-bold leading-none w-4 h-4 flex items-center justify-center">&times;</button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
            </div>
        </ModalOverlay>
    );
}

export function MemberActionsMenu({ member, onRemove, onRename, onChangeRole, onUpdateTags }: MemberActionsMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [openUpwards, setOpenUpwards] = useState(false);
    
    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const [isTagsOpen, setIsTagsOpen] = useState(false);
    const [isRemoveOpen, setIsRemoveOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && menuRef.current) {
            const rect = menuRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            // Dropdown height is ~170px. If less than 185px space below, open upwards.
            setOpenUpwards(spaceBelow < 185);
        }
    }, [isOpen]);

    return (
        <div className="relative flex justify-center" ref={menuRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-400 transition-colors hover:text-foreground hover:bg-slate-100 p-2 rounded-full w-8 h-8 flex items-center justify-center"
            >
                ⋯
            </button>
            
            {isOpen && (
                <div className={`absolute right-0 ${openUpwards ? 'bottom-full mb-1' : 'top-full mt-1'} w-44 bg-white border border-border rounded-xl shadow-lg z-10 py-1 overflow-hidden`}>
                    <button onClick={() => { setIsRenameOpen(true); setIsOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">Rename</button>
                    <button onClick={() => { setIsRoleOpen(true); setIsOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">Change Role</button>
                    <button onClick={() => { setIsTagsOpen(true); setIsOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">Edit Tags</button>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button onClick={() => { setIsRemoveOpen(true); setIsOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors">Remove</button>
                </div>
            )}
            
            <RenameModal key={`rename-${isRenameOpen ? 'open' : 'closed'}`} isOpen={isRenameOpen} onClose={() => setIsRenameOpen(false)} member={member} onSave={(name: string) => onRename(member.membership_id, member.user_id, name)} />
            <RoleModal key={`role-${isRoleOpen ? 'open' : 'closed'}`} isOpen={isRoleOpen} onClose={() => setIsRoleOpen(false)} member={member} onSave={(role: string) => onChangeRole(member.membership_id, role)} />
            <TagsModal key={`tags-${isTagsOpen ? 'open' : 'closed'}`} isOpen={isTagsOpen} onClose={() => setIsTagsOpen(false)} member={member} onSave={(tags: string[]) => onUpdateTags(member.membership_id, tags)} />
            
            <FeedbackModal
                isOpen={isRemoveOpen}
                onClose={() => setIsRemoveOpen(false)}
                title="Remove Member"
                message={`Are you sure you want to remove ${member.name || member.email} from the organization?`}
                tone="error"
                onConfirm={() => { onRemove(member.membership_id, member.user_id); setIsRemoveOpen(false); }}
                confirmText="Remove"
                showCancel
            />
        </div>
    );
}
