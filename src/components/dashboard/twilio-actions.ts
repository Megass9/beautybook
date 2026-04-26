"use server";

import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function sendAppointmentSMS(to: string, message: string) {
  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER, // Veya WhatsApp için 'whatsapp:+14155238886'
      to: to.startsWith('+') ? to : `+90${to.replace(/\D/g, '')}`
    });

    return { success: true, sid: response.sid };
  } catch (error: any) {
    console.error("Twilio Error:", error);
    return { success: false, error: error.message };
  }
}