import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as serviceAccount from './firebase-service-account.json'
dotenv.config();


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
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
