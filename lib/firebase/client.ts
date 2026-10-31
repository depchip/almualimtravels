import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

import { firebaseConfig } from "@/lib/firebase/config";

// Only import this module from blog/admin code, never from the root layout,
// so the Firebase SDK stays out of the rest of the site's bundles.
// Check for the default app by name: the public blog creates its own named app in the same runtime.
export const firebaseApp: FirebaseApp = getApps().some((app) => app.name === "[DEFAULT]")
  ? getApp()
  : initializeApp(firebaseConfig);
export const auth: Auth = getAuth(firebaseApp);
export const db: Firestore = getFirestore(firebaseApp);

// Must match the UID list in firestore.rules. The rules are the real check;
// this only decides what the admin UI shows.
export const ADMIN_UIDS = ["0z5mSAy9WncLHiLd209Rmhy5zgn1"];

export function isAdminUid(uid: string | null | undefined) {
  return !!uid && ADMIN_UIDS.includes(uid);
}
