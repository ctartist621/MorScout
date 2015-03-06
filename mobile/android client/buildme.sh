cordova build && adb uninstall com.mortorq.morscout && adb install ./platforms/android/ant-build/CordovaApp-debug.apk && adb shell monkey -p com.mortorq.morscout -c android.intent.category.LAUNCHER 1
