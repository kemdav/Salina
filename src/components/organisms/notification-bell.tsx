'use client';

import { useState, useRef, useEffect } from "react";
import { NotificationData } from "@/lib/notification-data";
import { NotificationItem } from "@/components/molecules/notification-item";

interface NotificationBellProps {
    initialNotifications: NotificationData[];
}

export function NotificationBell({ initialNotifications }: NotificationBellProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState(initialNotifications);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Calculate how many unread notifications we have
    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Mark a single notification as read when clicked
    const handleNotificationClick = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
    };

    // Mark all as read
    const handleMarkAllRead = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent dropdown from closing
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* The Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>

                {/* Red Unread Badge */}
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full" />
                )}
            </button>

            {/* The Dropdown Panel */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-[320px] sm:w-[380px] bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">

                    {/* Header */}
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-800">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    {unreadCount} New
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Scrollable List */}
                    <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
                        {notifications.length > 0 ? (
                            notifications.map(notif => (
                                <NotificationItem
                                    key={notif.id}
                                    notification={notif}
                                    onClick={handleNotificationClick}
                                />
                            ))
                        ) : (
                            <div className="p-8 flex flex-col items-center text-center text-slate-500">
                                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                                </div>
                                <p className="text-sm font-medium text-slate-800">You&apos;re all caught up!</p>
                                <p className="text-xs mt-1">No new notifications right now.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}