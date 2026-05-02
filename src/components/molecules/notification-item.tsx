import { cn } from "@/lib/utils";
import { NotificationData } from "@/lib/notification-data";

interface NotificationItemProps {
    notification: NotificationData;
    onClick?: (id: string) => void;
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
    // Dynamically assign an icon and color based on the type of notification
    const getIcon = () => {
        switch (notification.type) {
            case 'event': // Green calendar/check
                return <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
            case 'system': // Blue gear/settings
                return <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
            case 'message': // Purple chat bubble
                return <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
            case 'alert': // Yellow warning
            default:
                return <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
        }
    };

    return (
        <button
            onClick={() => onClick && onClick(notification.id)}
            className={cn(
                "w-full text-left flex gap-3 p-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0",
                !notification.isRead && "bg-slate-50/50"
            )}
        >
            <div className="shrink-0 mt-0.5">
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                    {getIcon()}
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <p className={cn("text-sm truncate", notification.isRead ? "font-medium text-slate-700" : "font-bold text-slate-900")}>
                    {notification.title}
                </p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {notification.message}
                </p>
                <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wider">
                    {notification.time}
                </p>
            </div>
            {/* The Unread Blue Dot indicator */}
            {!notification.isRead && (
                <div className="shrink-0 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shadow-sm" />
                </div>
            )}
        </button>
    );
}