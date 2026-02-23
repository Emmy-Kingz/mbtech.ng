/**
 * MBTECH Feature Promoter Bot
 * * Features:
 * 1. Intelligently suggests other parts of the platform (Course, Store, Connect, Info).
 * 2. Never suggests the page the user is currently on.
 * 3. Uses Session Storage so if a user dismisses it, it won't bother them again during that visit.
 * 4. Beautifully styled to match the MBTECH ecosystem.
 */

class FeaturePromoterBot {
    constructor() {
        this.delay = 30000; // Wait 30 seconds before showing (change to 60000 for 60s)
        this.sessionKey = 'mbtech_promo_dismissed';
        
        // The different features of the platform
        this.prompts = [
            { 
                id: 'course', 
                message: 'Looking to level up your skills? 🚀 Explore our 100% practical Tech & Design courses.', 
                btnText: 'View Academy', 
                url: 'course.html',
                icon: '👨‍💻'
            },
            { 
                id: 'store', 
                message: 'Need premium gadgets or reliable solar gear? ☀️ Visit our tech store today.', 
                btnText: 'Shop Now', 
                url: 'store.html',
                icon: '🛒'
            },
            { 
                id: 'connect', 
                message: 'Searching for tech gigs or NYSC IT placements? 🤝 Join our Talent Pool.', 
                btnText: 'Get Connected', 
                url: 'connect.html',
                icon: '💼'
            },
            { 
                id: 'info', 
                message: 'Stay updated with the latest tech insights and academy news! 📰', 
                btnText: 'Read News', 
                url: 'info.html',
                icon: '💡'
            }
        ];
    }

    init() {
        // If the user already closed the bot this session, leave them alone
        if (sessionStorage.getItem(this.sessionKey)) return;

        // Determine which page the user is currently on based on the URL
        const currentPath = window.location.pathname.toLowerCase();
        
        // Filter out the prompt for the current page
        const availablePrompts = this.prompts.filter(prompt => !currentPath.includes(prompt.url));

        // If there are valid prompts to show, pick a random one
        if (availablePrompts.length > 0) {
            const randomPrompt = availablePrompts[Math.floor(Math.random() * availablePrompts.length)];
            
            // Wait for the specified delay, then show the prompt
            setTimeout(() => {
                this.showPrompt(randomPrompt);
            }, this.delay);
        }
    }

    showPrompt(promptData) {
        this.injectStyles();

        // Create the bot container
        const botUI = document.createElement('div');
        botUI.id = 'mbtech-promo-bot';
        botUI.className = 'mbtech-promo-bot-container';

        // Build the HTML structure
        botUI.innerHTML = `
            <div class="promo-bot-header">
                <div class="promo-bot-title">
                    <span class="pulse-dot"></span> MBTECH Assistant
                </div>
                <button class="promo-bot-close" aria-label="Close">&times;</button>
            </div>
            <div class="promo-bot-body">
                <div class="promo-bot-icon">${promptData.icon}</div>
                <div class="promo-bot-text">${promptData.message}</div>
            </div>
            <a href="${promptData.url}" class="promo-bot-btn">${promptData.btnText}</a>
        `;

        document.body.appendChild(botUI);

        // Add event listener to the close button
        const closeBtn = botUI.querySelector('.promo-bot-close');
        closeBtn.addEventListener('click', () => {
            botUI.classList.add('hide');
            // Remember that the user closed it so we don't annoy them on the next page
            sessionStorage.setItem(this.sessionKey, 'true');
            
            // Remove from DOM after animation finishes
            setTimeout(() => botUI.remove(), 400);
        });
    }

    injectStyles() {
        // Only inject styles once
        if (document.getElementById('mbtech-promo-styles')) return;

        const style = document.createElement('style');
        style.id = 'mbtech-promo-styles';
        style.textContent = `
            .mbtech-promo-bot-container {
                position: fixed;
                bottom: 30px;
                left: 30px;
                width: 320px;
                background: #ffffff;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05);
                z-index: 9999;
                font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
                overflow: hidden;
                transform: translateX(-120%);
                animation: slideInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }

            .mbtech-promo-bot-container.hide {
                animation: slideOutLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }

            .promo-bot-header {
                background: #f8fafc;
                padding: 12px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #f1f5f9;
            }

            .promo-bot-title {
                font-size: 12px;
                font-weight: 800;
                color: #0f172a;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .pulse-dot {
                width: 8px;
                height: 8px;
                background-color: #0056b3;
                border-radius: 50%;
                animation: botPulse 2s infinite;
            }

            .promo-bot-close {
                background: none;
                border: none;
                font-size: 20px;
                line-height: 1;
                color: #94a3b8;
                cursor: pointer;
                transition: color 0.2s;
            }
            .promo-bot-close:hover { color: #0f172a; }

            .promo-bot-body {
                padding: 20px;
                display: flex;
                gap: 16px;
                align-items: flex-start;
            }

            .promo-bot-icon {
                font-size: 28px;
                background: #f1f5f9;
                width: 48px;
                height: 48px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 14px;
                flex-shrink: 0;
            }

            .promo-bot-text {
                font-size: 14px;
                color: #475569;
                line-height: 1.5;
            }

            .promo-bot-btn {
                display: block;
                margin: 0 20px 20px;
                padding: 12px;
                background: linear-gradient(135deg, #0056b3, #004494);
                color: white;
                text-align: center;
                text-decoration: none;
                font-weight: 700;
                font-size: 14px;
                border-radius: 12px;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            
            .promo-bot-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 20px rgba(0, 86, 179, 0.2);
            }

            @keyframes slideInLeft {
                from { transform: translateX(-120%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }

            @keyframes slideOutLeft {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(-120%); opacity: 0; }
            }

            @keyframes botPulse {
                0% { box-shadow: 0 0 0 0 rgba(0, 86, 179, 0.4); }
                70% { box-shadow: 0 0 0 6px rgba(0, 86, 179, 0); }
                100% { box-shadow: 0 0 0 0 rgba(0, 86, 179, 0); }
            }

            /* Responsive: Show at the bottom on mobile instead of left */
            @media (max-width: 640px) {
                .mbtech-promo-bot-container {
                    left: 20px;
                    right: 20px;
                    bottom: 80px; /* Above mobile bottom nav */
                    width: auto;
                    transform: translateY(150%);
                    animation: slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .mbtech-promo-bot-container.hide {
                    animation: slideOutDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes slideInUp {
                    from { transform: translateY(150%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes slideOutDown {
                    from { transform: translateY(0); opacity: 1; }
                    to { transform: translateY(150%); opacity: 0; }
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize the bot when the script loads
const promoBot = new FeaturePromoterBot();
promoBot.init();
