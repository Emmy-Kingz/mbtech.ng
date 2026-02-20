<div align="center">
<img src="logo.png" alt="MBTECH NG Logo" width="150" /><h1>MBTECH NG Platform Documentation</h1><p>
<strong>A complete, modern digital ecosystem designed to bridge the gap between technology education, digital services, talent placement, and e-commerce in Africa.</strong>
</p>
</div><hr /><h2>🚀 Project Overview</h2>
<p>
<b>MBTECH NG</b> is a unified web platform comprising an educational academy, a tech hardware store, a talent connection pool, and an automated admin management system. The platform is built from the ground up with a strong focus on <strong>Mobile-First UX</strong>, <strong>Real-Time Data Sync</strong>, and <strong>Direct Customer Communication</strong> via WhatsApp API.
</p><h2>🏗️ Tech Stack & Architecture</h2>
<p>
The platform operates on a serverless, highly scalable frontend architecture, utilizing CDNs to bypass the need for a traditional Node.js/NPM build step, allowing for rapid deployment and instant previews.
</p><table width="100%">
<tr>
<td width="30%"><strong>Core</strong></td>
<td>HTML5, CSS3, Vanilla JavaScript</td>
</tr>
<tr>
<td><strong>Framework</strong></td>
<td>React 18 (via ESM/CDN) & Babel Standalone</td>
</tr>
<tr>
<td><strong>Styling & UI</strong></td>
<td>Tailwind CSS, Lucide React (Icons), Chart.js (Data Vis)</td>
</tr>
<tr>
<td><strong>Database & Backend</strong></td>
<td>Firebase (Firestore V10) & Google Apps Script (Sheets)</td>
</tr>
<tr>
<td><strong>Authentication</strong></td>
<td>Firebase Auth (Anonymous & Admin Email/Password)</td>
</tr>
</table><h2>🗺️ Platform Ecosystem</h2>
<p>The platform is divided into 6 core modules. Click to expand each section below:</p><details>
<summary><b>1. Landing Page (<code>index.html</code>)</b></summary>
<blockquote>
<p>The front door to the ecosystem.</p>
<ul>
<li><b>Features:</b> Animated hero section, journey/statistics counter, dynamic FAQs, and a real-time "Upcoming Events" grid that automatically pulls published events from the Firebase Database.</li>
</ul>
</blockquote>
</details><details>
<summary><b>2. The Academy Hub (<code>course.html</code>)</b></summary>
<blockquote>
<p>A dynamic, multi-view portal for education.</p>
<ul>
<li><b>Features:</b> Contains three distinct sub-views (Digital School, Tech Academy, Academic Tutorials). Features interactive Radar/Bar charts (Chart.js) to show skill demand, and complex form handling that syncs user choices to Google Sheets before redirecting to WhatsApp.</li>
</ul>
</blockquote>
</details><details>
<summary><b>3. Talent & Gig Pool (<code>connect.html</code>)</b></summary>
<blockquote>
<p>Where students and professionals find opportunities.</p>
<ul>
<li><b>Features:</b> A sleek application form for NYSC Corpers, Students, Graduates, and Tutors. Uses a floating action button (FAB) that dynamically transitions to invite users to the official Telegram channel after a set duration.</li>
</ul>
</blockquote>
</details><details>
<summary><b>4. E-Commerce Platform (<code>store.html</code>)</b></summary>
<blockquote>
<p>A fully functional tech store built with React inside an HTML file.</p>
<ul>
<li><b>Features:</b> Real-time product catalog pulling from Firebase, category filtering, persistent shopping cart drawer, and a dual-checkout system (Bank Transfer & WhatsApp Checkout). Includes a "Request Product" modal for custom sourcing.</li>
</ul>
</blockquote>
</details><details>
<summary><b>5. News & Insights (<code>info.html</code>)</b></summary>
<blockquote>
<p>The brand's mini-blog and update center.</p>
<ul>
<li><b>Features:</b> React-powered news feed that listens to the <code>mbtech_updates</code> Firebase collection. Beautiful UI for reading articles, complete with social sharing buttons and dynamic publishing dates.</li>
</ul>
</blockquote>
</details><details>
<summary><b>6. Unified Command Center (<code>admin.html</code>)</b></summary>
<blockquote>
<p>A secure, locked-down portal for business management.</p>
<ul>
<li><b>Security:</b> Protected by Firebase Authentication (whitelisted admin emails only) and strict Content Security Policies (CSP).</li>
<li><b>Store Management:</b> Add/delete products, manage live stock levels, flag "Featured" items, track revenue, and update order fulfillment statuses.</li>
<li><b>Event Management:</b> Create upcoming classes/bootcamps and view live tables of student registrations.</li>
<li><b>Content Management (CMS):</b> Draft, edit, and instantly publish news articles directly to <code>info.html</code>.</li>
</ul>
</blockquote>
</details><h2>🎨 UI/UX Highlights</h2>
<ul>
<li><strong>Mobile App Feel:</strong> Across all pages, the platform utilizes a fixed, bottom navigation bar on mobile devices, complete with <code>safe-area-inset</code> support for iOS home indicators.</li>
<li><strong>Glassmorphism:</strong> Navigation bars use backdrop-blur effects to blend seamlessly over complex backgrounds.</li>
<li><strong>Brand Consistency:</strong> Strict adherence to the MBTECH color palette: Brand Blue (<code>#0056b3</code>), Brand Orange (<code>#f97316</code>), and Brand Green (<code>#059669</code>).</li>
<li><strong>Smart Modals:</strong> Legal documents (Privacy Policy, Terms of Service, Refund Policy) open in lightweight, scrollable modals rather than navigating the user away from their current page.</li>
</ul><h2>🔒 Security Measures</h2>
<ol>
<li><strong>Admin Protection:</strong> The admin dashboard hides all data and routes unauthorized users back to the login screen.</li>
<li><strong>Honeypot Fields:</strong> Forms include hidden honeypot fields to trap and block automated spam bots.</li>
<li><strong>Rate Limiting:</strong> LocalStorage tracking prevents users from spamming the checkout or messaging logic.</li>
<li><strong>Content Security Policy (CSP):</strong> The Admin dashboard strictly defines which external scripts and connections are allowed, mitigating Cross-Site Scripting (XSS) attacks.</li>
</ol><h2>⚙️ Data Flow & Integrations</h2>
<ul>
<li><strong>Tier 1 Data (Low Security/High Volume):</strong> General inquiries, connect applications, and course registrations are pushed via <code>fetch</code> API to a <strong>Google Apps Script</strong> which populates a Google Sheet for easy, spreadsheet-style reading by staff.</li>
<li><strong>Tier 2 Data (High Security/Dynamic):</strong> Store Inventory, Orders, Blog Posts, and Events are stored in <strong>Firebase Firestore</strong>. This allows the Store, Info, and Index pages to update instantly without requiring a page refresh.</li>
<li><strong>Customer Routing:</strong> To minimize backend overhead, all critical transactional data (Orders, Specific Course bookings) concludes by generating a perfectly formatted text string and opening the native <strong>WhatsApp</strong> application to directly message the MBTECH support line.</li>
</ul><hr />
<p align="center">
<i>Documentation built and finalized: February 2026</i>
</p>
