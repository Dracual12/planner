import webpush from "web-push";

const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const privateKey = process.env.VAPID_PRIVATE_KEY!;

webpush.setVapidDetails("mailto:planner@example.com", publicKey, privateKey);

export { webpush };
