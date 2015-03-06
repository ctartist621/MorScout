#!/bin/bash

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1
-keystore ~/Desktop/moscoutRelease/androids/morscout.keystore ./platforms/android/ant-build/CordovaApp-release-unsigned.apk morscout && jarsigner -verify -verbose -certs ./platforms/android/ant-build/CordovaApp-release-unsigned.apk && zipalign -v 4 ./platforms/android/ant-build/CordovaApp-release-unsigned.apk morscout-signed.apk
