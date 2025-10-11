import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type UserCredential,
} from "firebase/auth";
import { auth } from "@/core/firebase";

export async function loginWithEmail(email: string, password: string): Promise<UserCredential> {
  // TODO: Enhance with error handling and toast notifications.
  return signInWithEmailAndPassword(auth, email, password);
}

export async function registerWithEmail(
  email: string,
  password: string,
): Promise<UserCredential> {
  // TODO: Extend with display name, profile image, and onboarding.
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function logout(): Promise<void> {
  // TODO: Clear local Zustand stores when logging out.
  await signOut(auth);
}
