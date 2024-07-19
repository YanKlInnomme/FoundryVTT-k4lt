export const registerSystemSettings = () => {
  const debugSetting = {
    name: game.i18n.localize("k4lt.Settings.Debug"),
    hint: game.i18n.localize("k4lt.Settings.DebugHint"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    onChange: value => {
      if (value) {
        // Code à exécuter lorsque la valeur de "debug" change à true
      } else {
        // Code à exécuter lorsque la valeur de "debug" change à false
      }
    }
  };

  const lowSpecSetting = {
    name: game.i18n.localize("k4lt.Settings.LowSpec"),
    hint: game.i18n.localize("k4lt.Settings.LowSpecHint"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    onChange: value => {
      applyLowSpecCSS(value);
    }
  };

  game.settings.register("k4lt", "debug", debugSetting);
  game.settings.register("k4lt", "lowSpec", lowSpecSetting);

  // Appliquer le style au chargement initial
  const isLowSpec = game.settings.get("k4lt", "lowSpec");
  applyLowSpecCSS(isLowSpec);
};

const getAssetPath = (filename) => {
  return `systems/k4lt/assets/${filename}`;
};

const applyLowSpecCSS = (isLowSpec) => {
  const css = isLowSpec ? `
    .kult-sheet {
      background: url(${getAssetPath('background-sheet.webp')});
      background-repeat: no-repeat;
      background-size: 100% 100%;
      padding: 10px;
      color: rgb(32, 32, 32);
      border: none;
    }
  ` : `
    .kult-sheet {
      background: url(${getAssetPath('background-sheet.svg')});
      background-repeat: no-repeat;
      background-size: 100% 100%;
      padding: 10px;
      color: rgb(32, 32, 32);
      border: none;
    }
  `;
  addCSS(css, 'low-spec-style');
};

const addCSS = (css, id) => {
  let style = document.getElementById(id);
  if (!style) {
    style = document.createElement('style');
    style.id = id;
    document.head.appendChild(style);
  }
  style.innerHTML = css;
};
