(function () {
    'use strict';

    const consentKey = 'cookieConsent';
    const measurementId = 'G-0DVRF6HCWZ';
    const disableKey = `ga-disable-${measurementId}`;
    const scriptId = 'google-analytics-script';

    function readConsent() {
        try {
            return localStorage.getItem(consentKey);
        } catch (error) {
            return null;
        }
    }

    function writeConsent(value) {
        try {
            localStorage.setItem(consentKey, value);
        } catch (error) {
            // The choice still applies for the current page when storage is unavailable.
        }
    }

    function loadGoogleAnalytics() {
        if (document.getElementById(scriptId)) {
            return;
        }

        window[disableKey] = false;
        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function () {
            window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', measurementId);

        const script = document.createElement('script');
        script.id = scriptId;
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        document.head.appendChild(script);
    }

    function disableGoogleAnalytics() {
        window[disableKey] = true;

        document.cookie.split(';').forEach((cookie) => {
            const name = cookie.split('=')[0].trim();
            if (/^(_ga|_gid|_gat|_gac_)/.test(name)) {
                document.cookie = `${name}=; Max-Age=0; path=/`;
                document.cookie = `${name}=; Max-Age=0; path=/; domain=.eurekaengine.co.uk`;
            }
        });
    }

    function hideBanner(banner) {
        banner.classList.remove('show');
        banner.addEventListener('transitionend', () => banner.remove(), { once: true });
    }

    function showConsentBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookieNotification';
        banner.className = 'cookie-notification';
        banner.setAttribute('role', 'region');
        banner.setAttribute('aria-label', 'Analytics cookie consent');
        banner.innerHTML = `
            <div class="cookie-content">
                <div class="cookie-text">
                    <p><strong>We use analytics cookies</strong></p>
                    <p>With your permission, Google Analytics helps us understand how the site is used. Declining will not affect the site. See our <a href="privacy-policy.html">Privacy Policy</a>.</p>
                </div>
                <div class="cookie-buttons">
                    <button type="button" class="cookie-accept">Accept analytics</button>
                    <button type="button" class="cookie-decline">Decline</button>
                </div>
            </div>`;

        banner.querySelector('.cookie-accept').addEventListener('click', () => {
            writeConsent('accepted');
            hideBanner(banner);
            loadGoogleAnalytics();
        });

        banner.querySelector('.cookie-decline').addEventListener('click', () => {
            writeConsent('declined');
            hideBanner(banner);
            disableGoogleAnalytics();
        });

        document.body.appendChild(banner);
        requestAnimationFrame(() => requestAnimationFrame(() => banner.classList.add('show')));
    }

    function initializeAnalyticsConsent() {
        const consent = readConsent();
        if (consent === 'accepted') {
            loadGoogleAnalytics();
        } else if (consent === 'declined') {
            disableGoogleAnalytics();
        } else {
            showConsentBanner();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAnalyticsConsent, { once: true });
    } else {
        initializeAnalyticsConsent();
    }
}());