import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadNotifications: [],
  unreadCount: 0,
  isLoading: false,
  setNotifications: (newNotifications) => {
    // Allow newNotifications to be either a function (to update previous state) or value
    if (typeof newNotifications === "function") {
      set((state) => ({
        notifications: newNotifications(state.notifications),
      }));
    } else {
      set({
        notifications: Array.isArray(newNotifications)
          ? newNotifications
          : [newNotifications],
      });
    }
  },
  setUnreadCount: (count) => set({ unreadCount: count }),

  getNotifications: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/api/notifications");
      set({ notifications: response.data, isLoading: false });

      const unreadNotifications = response.data.filter(
        (notification) => !notification.read_at
      );
      set({ unreadNotifications, unreadCount: unreadNotifications.length });
    } catch (error) {
      toast.error("Failed to fetch notifications");
      console.error("Error in getNotifications:", error);
      set({ isLoading: false });
    }
  },

  getUnreadNotifications: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/api/notifications/unread");
      set({
        unreadNotifications: response.data,
        unreadCount: response.data.length,
        isLoading: false,
      });
    } catch (error) {
      toast.error("Failed to fetch unread notifications");
      console.error("Error in getUnreadNotifications:", error);
      set({ isLoading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      await axiosInstance.post(`/api/notifications/${id}/mark-as-read`);
      set((state) => {
        const updatedNotifications = state.notifications.map((notification) =>
          notification.id === id
            ? { ...notification, read_at: true }
            : notification
        );
        const updatedUnreadNotifications = state.unreadNotifications.filter(
          (notification) => notification.id !== id
        );
        return {
          notifications: updatedNotifications,
          unreadNotifications: updatedUnreadNotifications,
          unreadCount: updatedUnreadNotifications.length,
        };
      });
    } catch (error) {
      toast.error("Failed to mark notification as read");
      console.error("Error in markAsRead:", error);
    }
  },

  markAllAsRead: async () => {
    try {
      await axiosInstance.post(`/api/notifications/mark-all-as-read`);
      set((state) => ({
        notifications: state.notifications.map((notification) => ({
          ...notification,
          read_at: true,
        })),
        unreadNotifications: [],
        unreadCount: 0,
      }));
    } catch (error) {
      console.error("Error in markAllAsRead:", error);
    }
  },
}));
