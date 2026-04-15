<div align="center">
  <a href="https://emmy-kingz.github.io/mbtech.ng/">
    <img src="https://emmy-kingz.github.io/mbtech.ng/logo.png" alt="MBTECH NG Logo" width="120" />
  </a>
  <h1>MBTECH NG Web Platform</h1>
  <p><b>Africa's premier hub for digital skills training, software development, and tech solutions.</b></p>
  <p>
    <a href="https://emmy-kingz.github.io/mbtech.ng/">
      <img src="https://img.shields.io/badge/Website-Live-brightgreen.svg?style=for-the-badge&logo=vercel" alt="Website Live" />
    </a>
    <a href="#-call-for-collaboration">
      <img src="https://img.shields.io/badge/Contributions-Welcome-blue.svg?style=for-the-badge&logo=github" alt="Contributions Welcome" />
    </a>
    <a href="SECURITY.md">
      <img src="https://img.shields.io/badge/Security-Protected-success.svg?style=for-the-badge&logo=shield" alt="Security Protected" />
    </a>
  </p>
</div>

<hr />

## 🌍 About MBTECH NG

**[MBTECH NG](https://emmy-kingz.github.io/mbtech.ng/)** is more than just a website; it is a fully integrated digital ecosystem designed to empower Africa's growing tech workforce. Our mission is to bridge the gap between ambition and opportunity by providing high-quality technical education, premium hardware, and direct connections to the tech industry.

Operating simultaneously as an **Educational Academy**, an **E-Commerce Tech Store**, and a **Talent Connection Pool**, the platform seamlessly blends modern UI/UX design with a robust, highly scalable serverless backend.

<hr />

## ✨ Platform Documentation (Core Modules)

The platform is divided into several interconnected modules, each designed with a specific user journey in mind.

- **🎓 Tech Academy (`course.html`)**  
  Our learning portal features a real-time course catalog synced dynamically with Firebase Firestore. Users can browse curricula, check pricing, and seamlessly enroll or request assignment help directly via WhatsApp integrations.

- **🛒 E-Commerce Store (`store.html`)**  
  A high-performance storefront for tech gadgets, solar equipment, and professional services. It features a fully functional, localized shopping cart, dynamic checkout processes utilizing WhatsApp or manual Bank Transfers, and real-time inventory syncing.

- **🤝 MBTECH Connect (`connect.html`)**  
  A dedicated talent pool gateway. Students and professionals can submit their profiles to apply for tech internships, NYSC PPA placements, and freelance gig opportunities.

- **📰 News & Insights (`info.html`)**  
  A lightweight, lightning-fast mini-blog engine built to deliver tech tips, platform updates, and company news directly to our community.

- **🤖 Intelligent Assistant (Floating Bot)**  
  An AI‑ready chat widget that automatically pulls live courses, products, and news from Firestore (public read). It features cookie consent, Facebook Pixel tracking, and auto‑fills forms for logged‑in users – all without requiring any user authentication.

- **🔐 Secure Admin Workspace (`admin.html`)**  
  A private, highly secured dashboard used to manage the entire platform. Capable of managing store inventory, publishing blog posts, adding/editing courses, and reviewing user leads. Protected by Google OAuth whitelisting and an anti-brute-force passcode system with exponential lockouts.

<hr />

## 🛠️ Technology Stack & Architecture

MBTECH NG utilizes a modern, lightweight **serverless architecture**. It requires no heavy build steps (`npm install`), making it incredibly fast to deploy and easy to contribute to.

| Category | Technology Used |
|----------|----------------|
| **Frontend UI** | HTML5, Tailwind CSS (via CDN) |
| **Frontend Logic** | Vanilla JavaScript (ES Modules) + React 18 (admin panel) |
| **Icons & Assets** | Lucide (via CDN) |
| **Database & Backend** | Google Firebase Firestore |
| **Authentication** | Firebase Auth (Anonymous, Email/Password, Google OAuth) |
| **Data Pipelines** | Google Apps Script (Sheets integration) & WhatsApp API |
| **Bot Intelligence** | Firebase public read + static fallback |

> 💡 **Hybrid Data Logging:** Form submissions (enrollments, connect requests) simultaneously sync to **Firebase Firestore** and **Google Sheets**, ensuring zero data loss and easy administrative access.

<hr />

## 💻 Local Development Setup

Because this project relies on ES Modules and CDN imports, you do not need Node.js to run it. However, you *must* serve the files over a local HTTP server to prevent CORS issues.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Emmy-Kingz/mbtech.ng.git
   cd mbtech.ng
