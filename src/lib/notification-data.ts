export type NotificationType = "alert" | "event" | "system" | "message";

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

export const superAdminNotifications: NotificationData[] = [
  {
    id: "sa1",
    type: "system",
    title: "Pending Accreditation",
    message:
      "You have a pending accreditation request from [Org Name]. Please review their submitted documents.",
    time: "10 mins ago",
    isRead: false,
  },
  {
    id: "sa2",
    type: "alert",
    title: "System Maintenance",
    message:
      "Salina servers will undergo brief maintenance on Sunday at 2:00 AM.",
    time: "2 hours ago",
    isRead: true,
  },
];

export const adminNotifications: NotificationData[] = [
  {
    id: "a1",
    type: "message",
    title: "New Announcement",
    message:
      "Kirk (Vice President) posted a new announcement to the general feed.",
    time: "Just now",
    isRead: false,
  },
  {
    id: "a2",
    type: "system",
    title: "Roster Updated",
    message: "3 new members have successfully completed their onboarding.",
    time: "1 day ago",
    isRead: true,
  },
];

export const officerNotifications: NotificationData[] = [
  {
    id: "o1",
    type: "event",
    title: "Event Reminder",
    message:
      "Bytes & Boards is happening tomorrow! Don't forget to prepare the attendance scanner.",
    time: "1 hour ago",
    isRead: false,
  },
  {
    id: "o2",
    type: "message",
    title: "New RSVP",
    message: "5 more members just RSVP'd to your upcoming event.",
    time: "3 hours ago",
    isRead: true,
  },
];

export const memberNotifications: NotificationData[] = [
  {
    id: "m1",
    type: "event",
    title: "Event Starting Now!",
    message:
      "Region 7 CpE Challenge is happening right now! Don't forget to scan your ID for attendance.",
    time: "Just now",
    isRead: false,
  },
  {
    id: "m2",
    type: "alert",
    title: "Membership Approved",
    message:
      "Welcome to the organization! Your membership status is now active.",
    time: "Yesterday",
    isRead: true,
  },
];
