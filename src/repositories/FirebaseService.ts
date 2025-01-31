import admin from "firebase-admin";
import { getStorage, Storage } from "firebase-admin/storage";
import {
  FIREBASE_SETTINGS_KEYS,
  FIREBASE_SETTINGS_TYPES,
} from "@/config/settings/STORAGE_SETTINGS_KEYS";
import SettingRepository from "@/repositories/SettingRepository";

class FirebaseService {
  private static instance: FirebaseService;
  private settingRepository: SettingRepository;
  private bucket: ReturnType<Storage["bucket"]> | null = null;

  private constructor() {
    this.settingRepository = new SettingRepository();
  }

  static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }
  async isFirebaseAvailable(): Promise<boolean> {
    try {
      const firebaseConfig = (await this.settingRepository.findByKey(
        FIREBASE_SETTINGS_KEYS.FIREBASE,
        "production"
      )) as FIREBASE_SETTINGS_TYPES[typeof FIREBASE_SETTINGS_KEYS.FIREBASE];

      return !!(firebaseConfig && firebaseConfig.bucket);
    } catch {
      return false;
    }
  }

  async initFirebase() {
    if (this.bucket) return;

    const firebaseConfig = (await this.settingRepository.findByKey(
      FIREBASE_SETTINGS_KEYS.FIREBASE,
      "production"
    )) as FIREBASE_SETTINGS_TYPES[typeof FIREBASE_SETTINGS_KEYS.FIREBASE];

    if (!firebaseConfig) {
      throw new Error("Firebase settings not found.");
    }

    if (!admin.apps.length) {
      const formattedServiceAccount: admin.ServiceAccount = {
        projectId: firebaseConfig.serviceAccount.project_id,
        clientEmail: firebaseConfig.serviceAccount.client_email,
        privateKey: firebaseConfig.serviceAccount.private_key,
      };

      admin.initializeApp({
        credential: admin.credential.cert(formattedServiceAccount),
        storageBucket: firebaseConfig.bucket,
      });
    }

    this.bucket = getStorage().bucket();
  }

  getBucket(): ReturnType<Storage["bucket"]> {
    if (!this.bucket) {
      throw new Error("Firebase has not been initialized.");
    }
    return this.bucket;
  }
}

export default FirebaseService;
