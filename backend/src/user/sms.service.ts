import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsService {
  async sendVerificationCode(phone: string, code: string): Promise<void> {
    // In a real application, you would integrate with an SMS gateway provider.
    // For this example, we'll just log the code to the console.
    console.log(`Sending verification code ${code} to ${phone}`);
    return Promise.resolve();
  }
}