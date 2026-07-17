# PathBloom Beta Release Checklist

This checklist separates automated validation from physical-device and store-console work. A green GitHub workflow does not replace Android testing.

## 1. Automated validation

Run from the repository root:

```powershell
npm install
npm run validate:content
npm run validate:i18n
npm run validate:release
npm run test:release
npm run test:ui
npm run test:content
npm run test:world
npm run build
```

Required result:

- No missing Arabic content-pack text.
- No invalid content follow-ups or choices.
- Save corruption and backup recovery tests pass.
- Starter journey rewards are granted once.
- English and Arabic onboarding render correctly.
- Phase-one and phase-two UI tests pass.
- World simulation tests pass.
- Production Vite build succeeds.

## 2. Android build

```powershell
npx cap sync android
cd android
.\gradlew clean assembleDebug
.\gradlew bundleRelease
```

Debug APK:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

Release bundle:

```text
android/app/build/outputs/bundle/release/app-release.aab
```

Before uploading a release bundle:

- Use the correct signing key and protect its passwords.
- Increase `versionCode` for every uploaded build.
- Keep `package.json` version and Android `versionName` aligned.
- Confirm the package ID remains `com.pathbloom.lifesimulator`.
- Do not commit signing keys, passwords, or private Play Console files.

## 3. Save reliability tests on a phone

- Start a new life and advance several years.
- Force-close the app immediately after aging up, then reopen it.
- Confirm the HUD displays a successful autosave state.
- Use several save slots and confirm each one loads independently.
- Confirm a second save creates a visible backup-ready status.
- Temporarily corrupt a development save and confirm the backup is restored.
- Delete a slot and confirm its primary, temporary, and backup copies disappear.
- Load an old pre-Phase-3 save and confirm it migrates without data loss.
- Continue as a child after death and confirm the new generation saves correctly.

## 4. First-session retention flow

Test in English and Arabic:

- New players see the full-screen introduction once.
- Skip disables the guided starter journey.
- Completing onboarding enables the journey card.
- The journey card appears inside the scrollable story feed, not over navigation.
- Each starter reward is granted only once.
- Goal buttons open the correct existing destination.
- Education, relationship, adulthood, and influence unlock tips appear once.
- Milestone notifications do not block decisions or Android navigation.
- Restarting the app preserves the guided-journey preference.

## 5. UI and accessibility

Test at minimum:

- Compact Android phone around 360 px wide.
- Typical 1080p Android phone.
- Tablet or resizable emulator.
- English LTR and Arabic RTL.
- Western and Arabic digit preferences.
- Android large font setting.
- TalkBack focus order for navigation, decisions, onboarding, and save slots.
- Reduced-motion system setting.
- Keyboard opening in search, Content Studio, and numeric dialogs.
- Display cutout, status bar, navigation bar, and gesture safe areas.
- Android back navigation from every full-screen destination and bottom sheet.

## 6. Performance and stability

- Test on a low-memory or older Android device.
- Confirm the automatic `performance-lite` profile removes expensive blur and animation.
- Simulate a life beyond age 80 and inspect timeline scrolling.
- Use Smart +5 and Smart +12 repeatedly.
- Open and close World, Assets, Relationships, and Content Studio many times.
- Watch `adb logcat` for `AndroidRuntime`, `chromium`, `Capacitor`, and memory warnings.
- Confirm the app resumes after being backgrounded for several minutes.
- Confirm no duplicate milestone sounds or repeated unlock notifications.

Useful logs:

```powershell
adb logcat -c
adb logcat | Select-String "AndroidRuntime|chromium|Capacitor|PathBloom|OutOfMemory"
```

## 7. Store presentation

Prepare separate English and Arabic assets:

- App title and short description.
- Full store description.
- Phone screenshots showing Life, Decisions, Activities, World, and Arabic RTL.
- Tablet screenshots when tablet support is advertised.
- Feature graphic.
- Current launcher icon and adaptive icon preview.
- Privacy policy hosted on a public HTTPS page.
- Support email and support page.
- Content-rating questionnaire.
- Data-safety form matching actual collection and storage behavior.

Do not advertise cloud saves, online multiplayer, or data collection features unless they are implemented and verified.

## 8. Beta sign-off

A beta is ready only when:

- All GitHub workflows pass on the exact release commit.
- The APK installs cleanly on a fresh device.
- An old save and a new save both work.
- English and Arabic core flows pass.
- No blocking crash appears during a 30-minute play session.
- Save recovery has been tested intentionally.
- At least one low-end Android device completes a long-life session.
- Known issues are documented for testers.
