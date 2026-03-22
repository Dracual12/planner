"use client";

import { useState, useEffect, useCallback } from "react";

type PermissionState = "default" | "granted" | "denied";

export function useNotifications() {
  const [permission, setPermission] = useState<PermissionState>("default");
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    const isSupported = typeof window !== "undefined" && "Notification" in window;
    setSupported(isSupported);
    if (isSupported) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!supported) return "denied" as const;
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, [supported]);

  const sendNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!supported || permission !== "granted") return;
      return new Notification(title, {
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-192x192.png",
        ...options,
      });
    },
    [supported, permission]
  );

  return {
    permission,
    supported,
    requestPermission,
    sendNotification,
  };
}
