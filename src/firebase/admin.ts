import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

const app = getApps()[0] ?? initializeApp({ credential: applicationDefault(), projectId: process.env.FIREBASE_PROJECT_ID })
export const adminAuth = getAuth(app)
export const db = getFirestore(app)
export const bucket = getStorage(app).bucket()
