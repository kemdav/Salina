"use client";

import { useId, useState } from "react";

import { NotificationItem } from "@/components/molecules/notification-item";
import { NotificationData } from "@/lib/notification-data";

interface NotificationBellProps {
  initialNotifications: NotificationData[];
}

export function NotificationBell({
  initialNotifications,
}: NotificationBellProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const toggleId = useId();

  // Calculate how many unread notifications we have
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  // Mark a single notification as read when clicked
  const handleNotificationClick = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
  };

  // Mark all as read
  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true })),
    );
  };

  return (
    <div className="relative">
      <input
        id={toggleId}
        type="checkbox"
        className="peer sr-only"
        aria-label="Toggle notifications"
      />

      {/* The Bell Button */}
      <label
        htmlFor={toggleId}
        className="relative flex cursor-pointer items-center justify-center rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-200 peer-focus-visible:ring-2 peer-focus-visible:ring-slate-200"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Red Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-rose-500" />
        )}
      </label>

      {/* The Dropdown Panel */}
      <div className="absolute right-0 top-full z-50 mt-2 hidden w-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 peer-checked:block sm:w-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-800">Notifications</h3>
            {unreadCount > 0 && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                {unreadCount} New
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs font-semibold text-blue-600 transition-colors hover:text-blue-800"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Scrollable List */}
        <div className="max-h-95 overflow-y-auto custom-scrollbar">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={handleNotificationClick}
              />
            ))
          ) : (
            <div className="flex flex-col items-center p-8 text-center text-slate-500">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
                <svg
                  className="h-6 w-6 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-800">
                You&apos;re all caught up!
              </p>
              <p className="mt-1 text-xs">No new notifications right now.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
