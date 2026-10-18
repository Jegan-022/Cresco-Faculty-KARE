import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, type Auth } from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  CACHE_SIZE_UNLIMITED,
  type Firestore
} from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig';

// Initialize Firebase App singleton for Faculty Portal
const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth with browser local persistence
export const auth: Auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('[Firebase Auth Faculty] Persistence fallback warning:', err);
});

// Initialize Firebase Firestore with multi-tab offline cache
let firestoreDb: Firestore;
try {
  firestoreDb = initializeFirestore(
    app,
    {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
        cacheSizeBytes: CACHE_SIZE_UNLIMITED,
      }),
    },
    firebaseConfig.firestoreDatabaseId
  );
} catch {
  firestoreDb = getFirestore(app, firebaseConfig.firestoreDatabaseId);
}

export const db: Firestore = firestoreDb;
export default app;
