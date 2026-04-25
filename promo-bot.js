/**
 * MBTECH Assistant Bot v3.2 - Lightweight REST API Version
 * - Reads live courses, products, and gigs from Firestore via REST (Zero SDK conflicts)
 * - Does not use bot.json (Config is embedded)
 * - Works without any user sign-in (anonymous or otherwise)
 * - Auto-fills forms if user is logged in (detects from DOM)
 */

class MbtechAssistant {
    constructor() {
        this.logoUrl = 'logo.png';
        this.fallbackLogo = 'https://placehold.co/100x100?text=MB';
        this.isOpen = false;
        this.userName = '';
        this.userEmail = '';
        this.cookiesAccepted = localStorage.getItem('mbtech_cookie_consent') === 'true';
        this.hasGreeted = false;

        // --- BOT CONFIGURATION ---
        this.botName = 'MBTECH AI';
        this.greetingKnown = "Welcome back {name}! 👋 I am {botName}. Need help finding a specific course, gadget, or gig today?";
        this.greetingUnknown = "Hi there! 👋 I am {botName}. How can I assist you with your tech journey today?";

        // Dynamic data stores
        this.dynamicCourses = [];
        this.dynamicProducts = [];
        this.dynamicGigs = [];

        // Static fallback data (used only if internet drops)
        this.staticCourses = [
            { title: 'Frontend Development', url: 'course.html', price: '₦100,000' },
            { title: 'Solar & Hybrid Inverter', url: 'course.html', price: '₦150,000' },
            { title: 'UI/UX Product Design', url: 'course.html', price: '₦50,000' }
        ];
        this.staticProducts = [
            { title: '5KVA Hybrid Inverter', url: 'store.html', price: '₦1,200,000' },
            { title: 'MacBook Pro M3', url: 'store.html', price: '₦2,800,000' },
            { title: 'Student Power Bank', url: 'store.html', price: '₦150,000' }
        ];
        this.staticFaqs = {
            'location': 'We are located in Ikorodu, Lagos, Nigeria, but we operate globally online! 🌍',
            'certificate': 'Yes! All our Academy courses come with recognized, verifiable certificates upon graduation. 🎓',
            'payment': 'We securely process payments via Paystack, bank transfers, and automated WhatsApp checkouts. 💳',
            'contact': 'You can reach human support at support@mbtech.ng or call/WhatsApp +234 708 467 2771. 📞'
        };

        // Firebase REST API details
        this.apiKey = "AIzaSyDRkEVsI2swGV5cgn_0gMHTIWUbLhsacfY";
        this.projectId = "mbtechstore-17984";
        this.appId = "mbtech-public-store";
        this.baseUrl = `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents/artifacts/${this.appId}/public/data/`;
    }

    async init() {
        this.injectStyles();
        this.renderCookieBanner();
        this.renderBotUI();

        await this.loadFirebaseDataREST();

        this.setupEventListeners();
        this.checkUserState();
        setInterval(() => this.checkUserState(), 2000);

        this.trackEvent('PageView');
    }

    // ------------------- FIREBASE REST API (NO SDK NEEDED) -------------------
    async loadFirebaseDataREST() {
        // Helper to convert Firestore REST JSON to normal JS Object
        const parseFirestoreDoc = (doc) => {
            const data = {};
            if (doc.fields) {
                for (const key in doc.fields) {
                    const type = Object.keys(doc.fields[key])[0];
                    const val = doc.fields[key][type];
                    data[key] = (type === 'integerValue' || type === 'doubleValue') ? Number(val) : 
                                (type === 'booleanValue') ? Boolean(val) : val;
                }
            }
            return data;
        };

        try {
            // 1. Fetch Courses
            const cRes = await fetch(`${this.baseUrl}mbtech_courses?key=${this.apiKey}`);
            if (cRes.ok) {
                const cJson = await cRes.json();
                if (cJson.documents) {
                    this.dynamicCourses = cJson.documents.map(d => {
                        const data = parseFirestoreDoc(d);
                        return {
                            title: data.title || 'Untitled Course',
                            url: 'course.html',
                            price: `₦${(data.price || 0).toLocaleString()}`
                        };
                    });
                }
            }

            // 2. Fetch Products
            const pRes = await fetch(`${this.baseUrl}mbtech_products?key=${this.apiKey}`);
            if (pRes.ok) {
                const pJson = await pRes.json();
                if (pJson.documents) {
                    this.dynamicProducts = pJson.documents.map(d => {
                        const data = parseFirestoreDoc(d);
                        return {
                            title: data.name || data.title || 'Untitled Product',
                            url: 'store.html',
                            price: `₦${(data.price || 0).toLocaleString()}`
                        };
                    });
                }
            }

            // 3. Fetch Gigs
            const gRes = await fetch(`${this.baseUrl}mbtech_gigs?key=${this.apiKey}`);
            if (gRes.ok) {
                const gJson = await gRes.json();
                if (gJson.documents) {
                    this.dynamicGigs = [];
                    gJson.documents.forEach(d => {
                        const data = parseFirestoreDoc(d);
                        if (data.status !== 'Closed') {
                            const currencySymbol = data.currency === 'USD' ? '$' : '₦';
                            this.dynamicGigs.push({
                                title: data.title || 'Tech Opportunity',
                                url: 'connect.html',
                                price: data.rate ? `${currencySymbol}${Number(data.rate).toLocaleString()}/${data.rateType || 'Task'}` : 'Negotiable'
                            });
                        }
                    });
                }
            }

        } catch (err) {
            console.warn("REST API fetch failed, using static fallbacks:", err);
            this.dynamicCourses = [...this.staticCourses];
            this.dynamicProducts = [...this.staticProducts];
            this.dynamicGigs = [];
        }
    }

    // ------------------- DETECT LOGGED-IN USERS FROM PAGE -------------------
    checkUserState() {
        const desktopEmailEl = document.getElementById('nav-user-email');
        const mobileEmailEl = document.getElementById('mobile-user-email');
        
        let emailRaw = '';
        if (desktopEmailEl && desktopEmailEl.innerText) emailRaw = desktopEmailEl.innerText;
        else if (mobileEmailEl && mobileEmailEl.innerText) emailRaw = mobileEmailEl.innerText;

        if (emailRaw && emailRaw !== this.userEmail) {
            this.userEmail = emailRaw;
            let rawName = emailRaw.split('@')[0].split(/[._-]/)[0];
            this.userName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
            this.autoFillForms();
        }
    }

    autoFillForms() {
        if (!this.userEmail) return;
        const nameInputs = document.querySelectorAll('input[name="name"], input[name="Name"], #checkout-name, #tutor-name, #req-name, #co-name');
        const emailInputs = document.querySelectorAll('input[type="email"], input[name="email"], input[name="Email"], #checkout-email, #tutor-email, #co-email');
        nameInputs.forEach(input => { if (!input.value && this.userName) input.value = this.userName; });
        emailInputs.forEach(input => { if (!input.value) input.value = this.userEmail; });
    }

    // ------------------- BOT UI & MESSAGE HANDLERS -------------------
    renderCookieBanner() {
        if (this.cookiesAccepted) return;
        const banner = document.createElement('div');
        banner.id = 'mbtech-cookie-banner';
        banner.innerHTML = `
            <div class="cookie-content">
                <p>🍪 We use cookies to enhance your experience, analyze site traffic, and personalize marketing. By continuing, you agree to our <a href="#" onclick="if(window.ui) ui.openLegalModal('privacy'); return false;">Privacy Policy</a>.</p>
                <div class="cookie-buttons">
                    <button id="accept-cookies" class="btn-accept">Accept All</button>
                    <button id="decline-cookies" class="btn-decline">Decline</button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);
        document.getElementById('accept-cookies').addEventListener('click', () => {
            localStorage.setItem('mbtech_cookie_consent', 'true');
            this.cookiesAccepted = true;
            banner.classList.add('hide');
            setTimeout(() => banner.remove(), 500);
        });
        document.getElementById('decline-cookies').addEventListener('click', () => {
            localStorage.setItem('mbtech_cookie_consent', 'false');
            banner.classList.add('hide');
            setTimeout(() => banner.remove(), 500);
        });
    }

    trackEvent(eventName, data = {}) {
        if (this.cookiesAccepted && typeof fbq === 'function') {
            try {
                if (eventName === 'PageView') fbq('track', 'PageView');
                else fbq('trackCustom', eventName, data);
            } catch (e) { console.warn("FB Pixel Error:", e); }
        }
    }

    renderBotUI() {
        const container = document.createElement('div');
        container.id = 'mbtech-bot-wrapper';
        container.innerHTML = `
            <div id="mbtech-chat-window" class="chat-window hidden">
                <div class="chat-header">
                    <div class="chat-header-info">
                        <img src="${this.logoUrl}" onerror="this.src='${this.fallbackLogo}'" alt="MBTECH Bot">
                        <div><h4>${this.botName}</h4><span>Online</span></div>
                    </div>
                    <button id="close-chat-btn">&times;</button>
                </div>
                <div id="chat-messages" class="chat-messages no-scrollbar"></div>
                <div class="chat-input-area">
                    <div id="chat-quick-replies" class="quick-replies no-scrollbar">
                        <button class="qr-btn" data-action="courses">📚 Recommend Course</button>
                        <button class="qr-btn" data-action="gigs">💼 View Gigs</button>
                        <button class="qr-btn" data-action="products">🛒 Recommend Product</button>
                        <button class="qr-btn" data-action="faqs">❓ FAQs</button>
                    </div>
                    <form id="chat-form">
                        <input type="text" id="chat-input" placeholder="Type a message..." autocomplete="off">
                        <button type="submit">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                        </button>
                    </form>
                </div>
            </div>
            <button id="mbtech-fab" class="bot-fab">
                <div class="fab-pulse"></div>
                <img src="${this.logoUrl}" onerror="this.src='${this.fallbackLogo}'" alt="Chat">
                <span id="fab-badge" class="fab-badge">1</span>
            </button>
        `;
        document.body.appendChild(container);
    }

    setupEventListeners() {
        const fab = document.getElementById('mbtech-fab');
        const chatWindow = document.getElementById('mbtech-chat-window');
        const closeBtn = document.getElementById('close-chat-btn');
        const chatForm = document.getElementById('chat-form');
        const chatInput = document.getElementById('chat-input');
        const quickReplies = document.querySelectorAll('.qr-btn');

        fab.addEventListener('click', () => {
            this.isOpen = !this.isOpen;
            if (this.isOpen) {
                chatWindow.classList.remove('hidden');
                document.getElementById('fab-badge').style.display = 'none';
                this.trackEvent('BotOpened');
                if (!this.hasGreeted) {
                    const greeting = this.userName 
                        ? this.greetingKnown.replace('{name}', this.userName).replace('{botName}', this.botName)
                        : this.greetingUnknown.replace('{botName}', this.botName);
                    this.addBotMessage(greeting);
                    this.hasGreeted = true;
                }
            } else {
                chatWindow.classList.add('hidden');
            }
        });

        closeBtn.addEventListener('click', () => {
            this.isOpen = false;
            chatWindow.classList.add('hidden');
        });

        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const msg = chatInput.value.trim();
            if (!msg) return;
            this.addUserMessage(msg);
            chatInput.value = '';
            this.showTyping();
            setTimeout(() => this.processUserInput(msg.toLowerCase()), 800);
        });

        quickReplies.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.getAttribute('data-action');
                this.addUserMessage(e.target.innerText);
                this.showTyping();
                setTimeout(() => {
                    if (action === 'courses') this.sendCourseRecommendations();
                    if (action === 'products') this.sendProductRecommendations();
                    if (action === 'gigs') this.sendGigRecommendations();
                    if (action === 'faqs') this.sendFaqs();
                }, 800);
            });
        });
    }

    addUserMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'msg-bubble user-msg';
        msgDiv.innerText = text;
        this.appendMessage(msgDiv);
    }

    addBotMessage(text, html = null) {
        this.removeTyping();
        const msgDiv = document.createElement('div');
        msgDiv.className = 'msg-bubble bot-msg';
        if (html) msgDiv.innerHTML = `<p>${text}</p>${html}`;
        else msgDiv.innerText = text;
        this.appendMessage(msgDiv);
    }

    appendMessage(element) {
        const container = document.getElementById('chat-messages');
        container.appendChild(element);
        container.scrollTop = container.scrollHeight;
    }

    showTyping() {
        const container = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'bot-typing';
        typingDiv.className = 'msg-bubble bot-msg typing-indicator';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        container.appendChild(typingDiv);
        container.scrollTop = container.scrollHeight;
    }

    removeTyping() {
        const typing = document.getElementById('bot-typing');
        if (typing) typing.remove();
    }

    processUserInput(text) {
        this.trackEvent('BotQuerySent', { query: text });
        if (text.includes('course') || text.includes('learn') || text.includes('academy') || text.includes('training')) {
            this.sendCourseRecommendations();
        } else if (text.includes('store') || text.includes('buy') || text.includes('gadget') || text.includes('solar') || text.includes('inverter') || text.includes('laptop')) {
            this.sendProductRecommendations();
        } else if (text.includes('gig') || text.includes('job') || text.includes('internship') || text.includes('work') || text.includes('hire')) {
            this.sendGigRecommendations();
        } else if (text.includes('location') || text.includes('where')) {
            this.addBotMessage(this.staticFaqs['location']);
        } else if (text.includes('certificate')) {
            this.addBotMessage(this.staticFaqs['certificate']);
        } else if (text.includes('pay') || text.includes('price') || text.includes('fee')) {
            this.addBotMessage(this.staticFaqs['payment']);
        } else if (text.includes('contact') || text.includes('support') || text.includes('human')) {
            this.addBotMessage(this.staticFaqs['contact']);
        } else {
            this.addBotMessage(`I'm still learning! You can choose an option below or reach out to our team at support@mbtech.ng.`);
        }
    }

    sendCourseRecommendations() {
        const coursesToShow = this.dynamicCourses.length ? this.dynamicCourses : this.staticCourses;
        let html = '<div class="recommendation-list">';
        coursesToShow.slice(0, 4).forEach(c => {
            html += `<a href="${c.url}" class="rec-card"><div class="rec-title">${c.title}</div><div class="rec-price">${c.price}</div></a>`;
        });
        html += `<a href="course.html" class="rec-more">View All Courses →</a></div>`;
        this.addBotMessage("Here are some of our top-rated training programs:", html);
        this.trackEvent('BotRecommended', { type: 'Course' });
    }

    sendProductRecommendations() {
        const productsToShow = this.dynamicProducts.length ? this.dynamicProducts : this.staticProducts;
        let html = '<div class="recommendation-list">';
        productsToShow.slice(0, 4).forEach(p => {
            html += `<a href="${p.url}" class="rec-card store-card"><div class="rec-title">${p.title}</div><div class="rec-price">${p.price}</div></a>`;
        });
        html += `<a href="store.html" class="rec-more text-emerald-600">Visit Tech Store →</a></div>`;
        this.addBotMessage("Check out our best-selling tech & solar gears:", html);
        this.trackEvent('BotRecommended', { type: 'Product' });
    }

    sendGigRecommendations() {
        if (!this.dynamicGigs || this.dynamicGigs.length === 0) {
            this.addBotMessage("We don't have any open gigs right now, but check back soon or join our talent pool on the Connect page!");
            return;
        }
        let html = '<div class="recommendation-list">';
        this.dynamicGigs.slice(0, 4).forEach(g => {
            html += `<a href="${g.url}" class="rec-card" style="border-color: #8b5cf6;"><div class="rec-title">${g.title}</div><div class="rec-price" style="color: #8b5cf6;">${g.price}</div></a>`;
        });
        html += `<a href="connect.html" class="rec-more" style="color: #8b5cf6;">View All Opportunities →</a></div>`;
        this.addBotMessage("Here are some active gigs and opportunities:", html);
        this.trackEvent('BotRecommended', { type: 'Gig' });
    }

    sendFaqs() {
        let html = '<div class="faq-list">';
        html += `<button class="faq-btn" onclick="document.getElementById('chat-input').value='Where are you located?'; document.getElementById('chat-form').dispatchEvent(new Event('submit'))">📍 Where are you located?</button>`;
        html += `<button class="faq-btn" onclick="document.getElementById('chat-input').value='Do you offer certificates?'; document.getElementById('chat-form').dispatchEvent(new Event('submit'))">🎓 Do I get a certificate?</button>`;
        html += `<button class="faq-btn" onclick="document.getElementById('chat-input').value='How do I pay?'; document.getElementById('chat-form').dispatchEvent(new Event('submit'))">💳 How do I make payments?</button>`;
        html += `</div>`;
        this.addBotMessage("Here are some common questions:", html);
    }

    injectStyles() {
        if (document.getElementById('mbtech-bot-styles')) return;
        const style = document.createElement('style');
        style.id = 'mbtech-bot-styles';
        style.textContent = `
            :root { --bot-blue: #0056b3; --bot-orange: #f97316; --bot-dark: #0f172a; --bot-bg: #f8fafc; }
            #mbtech-cookie-banner { position: fixed; bottom: 0; left: 0; width: 100%; background: rgba(15,23,42,0.95); backdrop-filter: blur(10px); color: white; z-index: 10000; padding: 16px 20px; transition: transform 0.5s ease; box-shadow: 0 -10px 30px rgba(0,0,0,0.1); }
            #mbtech-cookie-banner.hide { transform: translateY(100%); }
            .cookie-content { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 16px; }
            .cookie-content p { margin: 0; font-size: 13px; line-height: 1.5; color: #cbd5e1; }
            .cookie-content a { color: var(--bot-orange); font-weight: bold; text-decoration: underline; }
            .cookie-buttons { display: flex; gap: 12px; flex-shrink: 0; }
            .cookie-buttons button { padding: 8px 16px; border-radius: 8px; font-weight: bold; font-size: 12px; cursor: pointer; border: none; transition: all 0.2s; }
            .btn-accept { background: var(--bot-blue); color: white; }
            .btn-accept:hover { background: #004494; }
            .btn-decline { background: rgba(255,255,255,0.1); color: white; }
            .btn-decline:hover { background: rgba(255,255,255,0.2); }
            .bot-fab { position: fixed; bottom: 30px; right: 30px; width: 60px; height: 60px; background: white; border-radius: 50%; border: 2px solid var(--bot-blue); box-shadow: 0 10px 25px rgba(0,86,179,0.3); cursor: pointer; z-index: 9998; display: flex; align-items: center; justify-content: center; transition: transform 0.3s ease; }
            .bot-fab:hover { transform: scale(1.05); }
            .bot-fab img { width: 36px; height: 36px; object-fit: contain; border-radius: 50%; }
            .fab-pulse { position: absolute; inset: -6px; border-radius: 50%; background: var(--bot-blue); opacity: 0.2; animation: pulseBot 2s infinite; z-index: -1; }
            .fab-badge { position: absolute; top: -4px; right: -4px; background: var(--bot-orange); color: white; font-size: 11px; font-weight: bold; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; }
            .chat-window { position: fixed; bottom: 100px; right: 30px; width: 350px; height: 500px; max-height: 80vh; background: white; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05); z-index: 9999; display: flex; flex-direction: column; overflow: hidden; transform-origin: bottom right; transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
            .chat-window.hidden { opacity: 0; pointer-events: none; transform: scale(0.9) translateY(20px); }
            .chat-header { background: linear-gradient(135deg, var(--bot-blue), #004494); padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; color: white; }
            .chat-header-info { display: flex; align-items: center; gap: 12px; }
            .chat-header-info img { width: 40px; height: 40px; background: white; border-radius: 12px; padding: 4px; object-fit: contain; }
            .chat-header-info h4 { margin: 0; font-size: 14px; font-weight: 800; }
            .chat-header-info span { font-size: 10px; opacity: 0.8; font-weight: 600; display: flex; align-items: center; gap: 4px; }
            .chat-header-info span::before { content: ''; width: 6px; height: 6px; background: #22c55e; border-radius: 50%; display: inline-block; }
            #close-chat-btn { background: none; border: none; color: white; font-size: 24px; cursor: pointer; opacity: 0.7; transition: opacity 0.2s; }
            #close-chat-btn:hover { opacity: 1; }
            .chat-messages { flex: 1; padding: 20px; overflow-y: auto; background: var(--bot-bg); display: flex; flex-direction: column; gap: 12px; }
            .msg-bubble { max-width: 85%; padding: 12px 16px; font-size: 13px; line-height: 1.5; position: relative; animation: popIn 0.3s ease; }
            .bot-msg { background: white; color: var(--bot-dark); border-radius: 16px 16px 16px 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); align-self: flex-start; }
            .bot-msg p { margin: 0; }
            .user-msg { background: var(--bot-blue); color: white; border-radius: 16px 16px 4px 16px; align-self: flex-end; }
            .typing-indicator span { display: inline-block; width: 6px; height: 6px; background: #94a3b8; border-radius: 50%; margin: 0 2px; animation: bounce 1.4s infinite ease-in-out both; }
            .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
            .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
            .recommendation-list { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
            .rec-card { display: block; padding: 10px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; text-decoration: none; color: var(--bot-dark); transition: all 0.2s; }
            .rec-card:hover { border-color: var(--bot-blue); background: white; }
            .store-card:hover { border-color: #059669; }
            .rec-title { font-weight: bold; font-size: 12px; }
            .rec-price { font-size: 11px; color: var(--bot-blue); font-weight: 800; margin-top: 4px; }
            .store-card .rec-price { color: #059669; }
            .rec-more { font-size: 11px; font-weight: bold; color: var(--bot-blue); text-align: center; display: block; margin-top: 4px; text-decoration: none; }
            .faq-list { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
            .faq-btn { background: #f1f5f9; border: none; padding: 8px 12px; border-radius: 8px; font-size: 12px; color: var(--bot-dark); cursor: pointer; text-align: left; transition: background 0.2s; }
            .faq-btn:hover { background: #e2e8f0; }
            .chat-input-area { background: white; border-top: 1px solid #f1f5f9; padding: 12px 16px; }
            .quick-replies { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 4px; }
            .qr-btn { white-space: nowrap; background: white; border: 1px solid var(--bot-blue); color: var(--bot-blue); font-size: 11px; font-weight: bold; padding: 6px 12px; border-radius: 12px; cursor: pointer; transition: all 0.2s; }
            .qr-btn:hover { background: var(--bot-blue); color: white; }
            #chat-form { display: flex; gap: 8px; align-items: center; background: #f1f5f9; border-radius: 20px; padding: 4px 4px 4px 16px; }
            #chat-form input { flex: 1; border: none; background: transparent; font-size: 13px; outline: none; color: var(--bot-dark); }
            #chat-form button { background: var(--bot-blue); color: white; border: none; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s; }
            #chat-form button:hover { transform: scale(1.1); }
            #chat-form button svg { width: 16px; height: 16px; }
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            @keyframes popIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes pulseBot { 0% { transform: scale(0.9); opacity: 0.4; } 70% { transform: scale(1.4); opacity: 0; } 100% { transform: scale(0.9); opacity: 0; } }
            @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
            @media (max-width: 768px) {
                .bot-fab { bottom: 85px; right: 20px; width: 50px; height: 50px; }
                .bot-fab img { width: 30px; height: 30px; }
                .chat-window { bottom: 85px; right: 20px; left: 20px; width: auto; height: calc(100vh - 120px); max-height: 600px; }
                .cookie-content { flex-direction: column; text-align: center; }
                .cookie-buttons { width: 100%; justify-content: center; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const assistant = new MbtechAssistant();
    assistant.init();
});
