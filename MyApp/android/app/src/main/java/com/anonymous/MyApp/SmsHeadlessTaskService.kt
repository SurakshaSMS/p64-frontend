package com.anonymous.MyApp

import android.content.Intent
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.bridge.Arguments
import com.facebook.react.jstasks.HeadlessJsTaskConfig

class SmsHeadlessTaskService : HeadlessJsTaskService() {
  override fun getTaskConfig(intent: Intent?): HeadlessJsTaskConfig? {
    if (intent == null) {
      return null
    }

    val data = Arguments.createMap().apply {
      putString("id", intent.getStringExtra("id"))
      putString("sender", intent.getStringExtra("sender"))
      putString("body", intent.getStringExtra("body"))
      putDouble(
        "date",
        intent.getLongExtra("date", System.currentTimeMillis()).toDouble()
      )
      putBoolean("read", intent.getBooleanExtra("read", false))
    }

    return HeadlessJsTaskConfig(
      "IncomingSmsTask",
      data,
      30000,
      true
    )
  }
}
