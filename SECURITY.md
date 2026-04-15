<div align="center">
  <img src="https://emmy-kingz.github.io/mbtech.ng/logo.png" alt="MBTECH NG Logo" width="100" />
  <h1>🛡️ MBTECH NG Security Policy</h1>
  <p><b>Ensuring the safety, privacy, and integrity of our users, students, and clients.</b></p>
</div>

<hr />

## ✅ Supported Versions

We actively maintain and provide security updates for the current production environment of the MBTECH NG platform. Please ensure you are referencing the latest branch before reporting issues.

| Version / Branch | Status | Updates |
|----------------|--------|---------|
| **Latest / Main Branch** | 🟢 Supported | Actively receiving security patches |
| **Legacy / Beta Branches** | 🔴 Unsupported | No longer receiving patches |

<hr />

## 🚨 Reporting a Vulnerability

We take the security of the MBTECH NG platform (Store, Academy, and Connect) very seriously. If you discover a security vulnerability, we kindly ask that you report it to us immediately.

⚠️ **Important:** Please **do not** disclose the vulnerability publicly on GitHub issues or social media until our team has had a chance to investigate and patch the issue.

### How to Report

1. **Email us directly:** Send your report to [emmanuel.amobi03@gmail.com](mailto:emmanuel.amobi03@gmail.com) or [support@mbtech.ng](mailto:support@mbtech.ng).
2. **Include details:** Provide a detailed description of the vulnerability.
3. **Steps to reproduce:** Explain exactly how the vulnerability can be triggered.
4. **Evidence:** (Optional but helpful) Attach screenshots, video recordings, or code snippets.

We aim to acknowledge all reports within **48 hours** and will keep you updated on our progress toward a fix.

<hr />

## 🔐 Built‑in Security Architecture

To assure our users and contributors, the MBTECH NG platform currently implements the following protective measures:

### Authentication & Identity

Powered by Google Firebase Authentication. User identities are verified securely, and **anonymous sign‑in is disabled** for most operations; however, the platform falls back gracefully to static data when needed. The public assistant bot uses **Firestore public read** rules (explicitly allowed for specific collections) – no authentication required.

### Admin Portal Protection

- **OAuth Whitelisting:** Administrator access via Google Sign‑In is strictly locked to pre‑approved management emails.
- **Anti‑Brute‑Force:** Passcode logins feature an exponential lockout mechanism (locking IP/Local Storage for 30 seconds after 5 failed attempts).
- **Cryptography:** Master passcodes are never stored in plain text; they are verified using client‑side `SHA‑256` hashing.

### Database Security (Firestore Rules)

Read and write access to Firebase Firestore is strictly governed by the following rule set:

- **Public Read (Limited):** Only the collections used by the public bot (`mbtech_courses`, `mbtech_products`, `mbtech_updates`) are readable by anyone – matching the information already visible on the website.
- **Public Create (Limited):** Anonymous users may **create** documents in `mbtech_connect_leads`, `mbtech_orders`, and `mbtech_recommendations` to submit forms.
- **Admin Write Only:** All other write operations (updates, deletes) are restricted to pre‑approved Google account emails (the management team).
- **Default Deny:** Any document path not explicitly matched above is completely inaccessible.

### Anti‑Bot & Spam Mitigation

Public‑facing forms (Contact, Enrollment, Assignment Help) utilise hidden honeypot fields to trap automated bots, combined with timestamp‑based rate limiting (one submission per minute) to prevent flooding.

<hr />

<div align="center">
  <p><i>Thank you for helping keep MBTECH NG secure for everyone!</i></p>
  <p><a href="https://emmy-kingz.github.io/mbtech.ng/">Visit the MBTECH NG Platform</a></p>
</div>
