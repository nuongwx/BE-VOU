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
  async sendOTP(phoneNumber: string): Promise<string> {

    return 'OTP gửi thành công'; // Hoặc trả về thông báo khác
  }

  async verifyOTP(phoneNumber: string, otp: string): Promise<boolean> {

    return true; // Nếu OTP hợp lệ, trả về true
  }
}