const fs = require("fs");
const path = require("path");
const {
  withAndroidManifest,
  withDangerousMod,
} = require("expo/config-plugins");

function addPermission(androidManifest, permissionName) {
  const manifest = androidManifest.manifest;

  if (!manifest["uses-permission"]) {
    manifest["uses-permission"] = [];
  }

  const alreadyExists = manifest["uses-permission"].some((permission) => {
    return permission.$?.["android:name"] === permissionName;
  });

  if (!alreadyExists) {
    manifest["uses-permission"].push({
      $: {
        "android:name": permissionName,
      },
    });
  }
}

function addReceiver(application, receiverName) {
  if (!application.receiver) {
    application.receiver = [];
  }

  const alreadyExists = application.receiver.some((receiver) => {
    return receiver.$?.["android:name"] === receiverName;
  });

  if (alreadyExists) {
    return;
  }

  application.receiver.push({
    $: {
      "android:name": receiverName,
      "android:permission": "android.permission.BROADCAST_SMS",
      "android:exported": "true",
    },
    "intent-filter": [
      {
        $: {
          "android:priority": "999",
        },
        action: [
          {
            $: {
              "android:name": "android.provider.Telephony.SMS_RECEIVED",
            },
          },
        ],
      },
    ],
  });
}

function addService(application, serviceName) {
  if (!application.service) {
    application.service = [];
  }

  const alreadyExists = application.service.some((service) => {
    return service.$?.["android:name"] === serviceName;
  });

  if (alreadyExists) {
    return;
  }

  application.service.push({
    $: {
      "android:name": serviceName,
      "android:enabled": "true",
      "android:exported": "false",
    },
  });
}

function getAndroidPackageName(config) {
  return config.android?.package ?? "com.anonymous.MyApp";
}

function getAndroidPackagePath(packageName) {
  return packageName.split(".").join(path.sep);
}

function createSmsReceiverKt(packageName) {
  return `package ${packageName}

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
`;
}

function createSmsHeadlessTaskServiceKt(packageName) {
  return `package ${packageName}

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
`;
}

function withBackgroundSmsManifest(config) {
  return withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;
    const manifest = androidManifest.manifest;

    addPermission(androidManifest, "android.permission.READ_SMS");
    addPermission(androidManifest, "android.permission.RECEIVE_SMS");
    addPermission(androidManifest, "android.permission.WAKE_LOCK");

    const application = manifest.application?.[0];

    if (!application) {
      throw new Error("AndroidManifest.xml is missing <application>.");
    }

    addReceiver(application, ".SmsReceiver");
    addService(application, ".SmsHeadlessTaskService");

    return config;
  });
}

function withBackgroundSmsKotlinFiles(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const packageName = getAndroidPackageName(config);
      const packagePath = getAndroidPackagePath(packageName);

      const targetDir = path.join(
        config.modRequest.platformProjectRoot,
        "app",
        "src",
        "main",
        "java",
        packagePath
      );

      fs.mkdirSync(targetDir, { recursive: true });

      fs.writeFileSync(
        path.join(targetDir, "SmsReceiver.kt"),
        createSmsReceiverKt(packageName)
      );

      fs.writeFileSync(
        path.join(targetDir, "SmsHeadlessTaskService.kt"),
        createSmsHeadlessTaskServiceKt(packageName)
      );

      return config;
    },
  ]);
}

function withBackgroundSms(config) {
  config = withBackgroundSmsManifest(config);
  config = withBackgroundSmsKotlinFiles(config);

  return config;
}

module.exports = withBackgroundSms;