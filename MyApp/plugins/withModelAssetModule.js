const fs = require("fs");
const path = require("path");
const { withDangerousMod } = require("expo/config-plugins");

function getAndroidPackageName(config) {
  return config.android?.package ?? "com.anonymous.MyApp";
}

function getAndroidPackagePath(packageName) {
  return packageName.split(".").join(path.sep);
}

function createModelAssetModuleKt(packageName) {
  return `package ${packageName}

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
`;
}

function createModelAssetPackageKt(packageName) {
  return `package ${packageName}

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class ModelAssetPackage : ReactPackage {
  override fun createNativeModules(
    reactContext: ReactApplicationContext
  ): List<NativeModule> {
    return listOf(ModelAssetModule(reactContext))
  }

  override fun createViewManagers(
    reactContext: ReactApplicationContext
  ): List<ViewManager<*, *>> {
    return emptyList()
  }
}
`;
}

function patchMainApplication(mainApplicationPath) {
  if (!fs.existsSync(mainApplicationPath)) {
    throw new Error(
      `MainApplication.kt was not found at: ${mainApplicationPath}`
    );
  }

  let content = fs.readFileSync(mainApplicationPath, "utf8");

  if (content.includes("ModelAssetPackage()")) {
    return;
  }

  const packageListPattern = /PackageList\(this\)\.packages\.apply\s*\{/;

  if (!packageListPattern.test(content)) {
    throw new Error(
      "Could not find PackageList(this).packages.apply { in MainApplication.kt"
    );
  }

  content = content.replace(
    packageListPattern,
    (match) => `${match}
            add(ModelAssetPackage())`
  );

  fs.writeFileSync(mainApplicationPath, content);
}

function copyOnnxModel(projectRoot, androidProjectRoot) {
  const source = path.join(
    projectRoot,
    "assets",
    "ml",
    "final_model",
    "model.onnx"
  );

  if (!fs.existsSync(source)) {
    throw new Error(`model.onnx was not found at: ${source}`);
  }

  const destinationDir = path.join(
    androidProjectRoot,
    "app",
    "src",
    "main",
    "assets",
    "ml"
  );

  const destination = path.join(destinationDir, "model.onnx");

  fs.mkdirSync(destinationDir, { recursive: true });
  fs.copyFileSync(source, destination);
}

function withModelAssetModule(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const packageName = getAndroidPackageName(config);
      const packagePath = getAndroidPackagePath(packageName);

      const packageDir = path.join(
        config.modRequest.platformProjectRoot,
        "app",
        "src",
        "main",
        "java",
        packagePath
      );

      fs.mkdirSync(packageDir, { recursive: true });

      fs.writeFileSync(
        path.join(packageDir, "ModelAssetModule.kt"),
        createModelAssetModuleKt(packageName)
      );

      fs.writeFileSync(
        path.join(packageDir, "ModelAssetPackage.kt"),
        createModelAssetPackageKt(packageName)
      );

      patchMainApplication(path.join(packageDir, "MainApplication.kt"));

      copyOnnxModel(
        config.modRequest.projectRoot,
        config.modRequest.platformProjectRoot
      );

      return config;
    },
  ]);
}

module.exports = withModelAssetModule;