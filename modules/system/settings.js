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

  game.settings.register("k4lt", "debug", debugSetting);
};
