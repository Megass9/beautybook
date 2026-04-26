"use server";

import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function sendAppointmentSMS(to: string, message: string) {
  try {
    const cleanPhone = to.replace(/\D/g, '');
    // Başında 0 varsa kaldır, başında 90 varsa kaldır ki temiz numara kalsın
    const normalizedPhone = cleanPhone.startsWith('0') 
      ? cleanPhone.substring(1) 
      : cleanPhone.startsWith('90') 
        ? cleanPhone.substring(2) 
        : cleanPhone;

    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+90${normalizedPhone}`
    });

    return { success: true, sid: response.sid };
  } catch (error: any) {
    console.error("Twilio Error:", error);
    return { success: false, error: error.message };
  }
}