(() => {
  "use strict";

  const GA_MEASUREMENT_ID = "G-P9N8NSE7PL";
  const hasValidMeasurementId = /^G-[A-Z0-9]{6,}$/.test(GA_MEASUREMENT_ID);

  if (!hasValidMeasurementId) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID);

  const sendEvent = (eventName, parameters = {}) => {
    window.gtag("event", eventName, parameters);
  };

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
