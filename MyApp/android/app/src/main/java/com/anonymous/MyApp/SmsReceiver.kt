package com.anonymous.MyApp

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.provider.Telephony
import com.facebook.react.HeadlessJsTaskService

class SmsReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    if (intent.action != Telephony.Sms.Intents.SMS_RECEIVED_ACTION) {
      return
    }

    val messages = Telephony.Sms.Intents.getMessagesFromIntent(intent)

    if (messages.isEmpty()) {
      return
    }

    val sender = messages.first().originatingAddress ?: "Unknown"

    val body = messages.joinToString(separator = "") {
      it.messageBody ?: ""
    }

    val timestamp = messages.first().timestampMillis

    if (body.isBlank()) {
      return
    }

    val serviceIntent = Intent(context, SmsHeadlessTaskService::class.java).apply {
      putExtra("id", "incoming-$timestamp-$sender")
      putExtra("sender", sender)
      putExtra("body", body)
      putExtra("date", timestamp)
      putExtra("read", false)
    }

    context.startService(serviceIntent)
    HeadlessJsTaskService.acquireWakeLockNow(context)
  }
}
