adb uninstall com.JQM.test && adb install ./platforms/android/ant-build/CordovaApp-debug.apk && adb shell monkey -p com.JQM.test -c android.intent.category.LAUNCHER 1
