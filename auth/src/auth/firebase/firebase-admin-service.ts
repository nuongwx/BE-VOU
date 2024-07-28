import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
if (!serviceAccountPath) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_PATH environment variable is not set');
}

const absoluteServiceAccountPath = path.resolve(
  process.cwd(), // Ensure it's relative to the project root
  serviceAccountPath
);

const serviceAccount = require(absoluteServiceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

@Injectable()
export class FirebaseAdminService {
  async sendOTP(phoneNumber: string) {
    try {
      const verificationId = await admin.auth().createUser({
        phoneNumber: phoneNumber,
      });
      return verificationId;
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new Error('Failed to send OTP');
    }
  }

  async verifyOTP(sessionCookie: string): Promise<boolean> {
    try {
      const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie);
      return !!decodedClaims;
    } catch (error) {
      return false;
    }
  }
}
