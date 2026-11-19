(() => {
  "use strict";

  // Remplacez cette valeur par l'identifiant de mesure GA4 (format : G-XXXXXXXXXX).
  // L'ancien dépôt ne contenait aucun identifiant actif : googleAnalyticsID était vide.
  const GA_MEASUREMENT_ID = "G-P9N8NSE7PL";
  const CONSENT_STORAGE_KEY = "portfolio_analytics_consent";
  const hasValidMeasurementId =
    /^G-[A-Z0-9]{6,}$/.test(GA_MEASUREMENT_ID) &&
    GA_MEASUREMENT_ID !== "G-XXXXXXXXXX";

  const banner = document.querySelector("[data-cookie-banner]");
  const acceptButton = document.querySelector("[data-cookie-accept]");
  const rejectButton = document.querySelector("[data-cookie-reject]");
  const settingsButton = document.querySelector("[data-cookie-settings]");

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  // Aucun stockage Analytics ni publicitaire n'est autorisé par défaut.
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied"
  });
  window.gtag("js", new Date());

  let analyticsLoaded = false;

  function readConsent() {
    try {
      return window.localStorage.getItem(CONSENT_STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function saveConsent(value) {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
    } catch (error) {
      // Le site reste utilisable même si le navigateur bloque le stockage local.
    }
  }

  function sendEvent(eventName, parameters = {}) {
    if (!analyticsLoaded || readConsent() !== "granted") return;
    window.gtag("event", eventName, parameters);
  }

  function loadAnalytics() {
    if (!hasValidMeasurementId || analyticsLoaded) return;

    window["ga-disable-" + GA_MEASUREMENT_ID] = false;
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" +
      encodeURIComponent(GA_MEASUREMENT_ID);
    document.head.appendChild(script);

    window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
    analyticsLoaded = true;

    sendEvent("page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname
    });
  }

  function applyConsent(granted, persist = true) {
    const value = granted ? "granted" : "denied";
    if (persist) saveConsent(value);

    if (!granted && hasValidMeasurementId) {
      // Désactive les envois futurs après un retrait du consentement.
      window["ga-disable-" + GA_MEASUREMENT_ID] = true;
    }

    window.gtag("consent", "update", {
      analytics_storage: value,
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });

    if (granted) loadAnalytics();
    if (banner) banner.hidden = true;
  }

  function openConsentSettings() {
    if (!banner) return;
    banner.hidden = false;
    if (rejectButton) rejectButton.focus();
  }

  acceptButton?.addEventListener("click", () => applyConsent(true));
  rejectButton?.addEventListener("click", () => applyConsent(false));
  settingsButton?.addEventListener("click", openConsentSettings);

  // Ne charge pas le script Google tant que le visiteur n'a pas accepté.
  const savedConsent = readConsent();
  if (savedConsent === "granted") {
    applyConsent(true, false);
  } else if (savedConsent === "denied") {
    applyConsent(false, false);
  } else if (banner) {
    banner.hidden = false;
  }

  // Mesure des interactions utiles du portfolio, uniquement après consentement.
  document.addEventListener("click", event => {
    const link = event.target.closest("a");
    if (!link) return;

    const projectCard = link.closest(".project-card");
    if (projectCard) {
      sendEvent("project_open", {
        project_id: projectCard.id || "project",
        link_text: (link.innerText || link.getAttribute("aria-label") || "project").trim().slice(0, 80)
      });
      return;
    }

    const href = link.getAttribute("href") || "";
    if (href.toLowerCase().includes("cv_abdelhakim_seddik")) {
      sendEvent("cv_download", { file_name: "CV_Abdelhakim_SEDDIK.pdf" });
      return;
    }

    if (href.startsWith("mailto:")) {
      sendEvent("contact_click", { contact_method: "email" });
      return;
    }

    if (href.startsWith("tel:")) {
      sendEvent("contact_click", { contact_method: "phone" });
      return;
    }

    if (link.hostname && link.hostname !== window.location.hostname) {
      sendEvent("outbound_click", {
        link_domain: link.hostname,
        link_text: (link.innerText || link.getAttribute("aria-label") || "external link").trim().slice(0, 80)
      });
    }
  });
})();
