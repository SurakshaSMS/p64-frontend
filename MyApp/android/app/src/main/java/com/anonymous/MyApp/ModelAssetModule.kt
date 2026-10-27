package com.anonymous.MyApp

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.File

class ModelAssetModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return "ModelAssetModule"
  }

  @ReactMethod
  fun copyOnnxModelToFiles(promise: Promise) {
    try {
      val outputFile = File(reactContext.filesDir, "model.onnx")

      if (outputFile.exists() && outputFile.length() > 0) {
        promise.resolve(outputFile.absolutePath)
        return
      }

      reactContext.assets.open("ml/model.onnx").use { inputStream ->
        outputFile.outputStream().use { outputStream ->
          inputStream.copyTo(outputStream)
        }
      }

      promise.resolve(outputFile.absolutePath)
    } catch (error: Exception) {
      promise.reject("MODEL_COPY_FAILED", error)
    }
  }
}
