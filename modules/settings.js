// settings.js
export function addk4ltLinksToSettings(app, html) {
  const gameSettingsHeader = html.querySelector("h4.divider");
  if (!gameSettingsHeader) {
    console.error("No header <h4.divider> found in parameters");
    return;
  }
  const currentLang = game.i18n.lang;
  const logoMap = {
    de: {
      light: "logo-de.svg",
      dark: "logo-de-dark.svg",
    },
    es: {
      light: "logo-es.svg",
      dark: "logo-es-dark.svg",
    },
    fr: {
      light: "logo-fr.svg",
      dark: "logo-fr-dark.svg",
    },
    it: {
      light: "logo-it.svg",
      dark: "logo-it-dark.svg",
    },
    pl: {
      light: "logo-pl.svg",
      dark: "logo-pl-dark.svg",
    },
    "pt-BR": {
      light: "logo-pt-BR.svg",
      dark: "logo-pt-BR-dark.svg",
    },
  };
  const defaultLogos = {
    light: "logo.svg",
    dark: "logo-dark.svg",
  };
  function getCurrentTheme() {
    if (html.classList.contains("theme-dark")) {
      return "dark";
    }
    if (html.classList.contains("theme-light")) {
      return "light";
    }
    return (
      game.settings.get("core", "uiConfig")
        ?.colorScheme
        ?.interface
      || "light"
    );
  }
  function getLogoPath() {
    const theme = getCurrentTheme();
    let logoFile;
    if (logoMap[currentLang]?.[theme]) {
      logoFile = logoMap[currentLang][theme];
    } else if (logoMap[currentLang]) {
      logoFile =
        logoMap[currentLang].light
        || Object.values(logoMap[currentLang])[0];
    } else {
      logoFile =
        defaultLogos[theme]
        || defaultLogos.light;
    }
    return `systems/k4lt/assets/${logoFile}`;
  }
  /* -------------------------------------------- */
  /* CUSTOM SECTION                               */
  /* -------------------------------------------- */
  const section = document.createElement("section");
  section.classList.add(
    "settings",
    "flexcol",
  );
  section.innerHTML = `
    <h4 class="divider">
      ${game.i18n.localize("WORLD.FIELDS.system.label")}
    </h4>
    <div class="k4lt system-badge">
      <img
        class="dynamic-logo"
        src="${getLogoPath()}"
      >
    </div>
  `;
  const linkKeys = [
    {
      icon: "fa-solid fa-cart-shopping",
      key: "Shop",
    },
    {
      icon: "fab fa-github",
      key: "Git",
    },
    {
      icon: "fa-regular fa-mug-hot fa-bounce",
      key: "Donation",
    },
  ];
  for (let i = 0; i < linkKeys.length; i++) {
    const link = linkKeys[i];
    const localizedText = game.i18n.localize(
      `k4lt.links.${link.key}Title`,
    );
    const localizedURL = game.i18n.localize(
      `k4lt.links.${link.key}URL`,
    );
    const linkSection = document.createElement("section");
    linkSection.classList.add(
      "settings",
      "flexcol",
    );
    const button = document.createElement("button");
    button.type = "button";
    button.innerHTML = `
      <i class="${link.icon}"></i>
      ${localizedText}
      <sup>
        <i class="fa-light fa-up-right-from-square"></i>
      </sup>
    `;
    if (i === linkKeys.length - 1) {
      button.style.marginBottom = "1rem";
    }
    button.addEventListener(
      "click",
      (ev) => {
        ev.preventDefault();
        window.open(localizedURL, "_blank");
      },
    );
    linkSection.appendChild(button);
    section.appendChild(linkSection);
  }
  gameSettingsHeader.parentNode.insertBefore(
    section,
    gameSettingsHeader,
  );
  /* -------------------------------------------- */
  /* THEME OBSERVER                               */
  /* -------------------------------------------- */
  const logoImg = section.querySelector(
    ".dynamic-logo",
  );
  const observer = new MutationObserver(
    () => {
      const newSrc = getLogoPath();
      if (logoImg.getAttribute("src") !== newSrc) {
        logoImg.setAttribute("src", newSrc);
      }
    },
  );
  observer.observe(html, {
    attributes: true,
    attributeFilter: ["class"],
  });
}
export const registerk4ltSettings = () => {
  /* -------------------------------------------- */
  /* DEBUG                                        */
  /* -------------------------------------------- */
  game.settings.register(
    "k4lt",
    "debug",
    {
      name: game.i18n.localize(
        "k4lt.settings.Debug",
      ),
      hint: game.i18n.localize(
        "k4lt.settings.DebugHint",
      ),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },
  );
  /* -------------------------------------------- */
  /* HOLD TRACKER POSITION                        */
  /* -------------------------------------------- */
  game.settings.register(
    "k4lt",
    "holdTrackerPosition",
    {
      scope: "client",
      config: false,
      type: Object,
      default: {
        left: null,
        top: null,
        width: 320,
        height: null,
      },
    },
  );
};