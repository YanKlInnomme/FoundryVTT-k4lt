export const registerSystemSettings = function () {
  game.settings.register("k4lt", "debug", {
    name: game.i18n.localize("k4lt.Settings.Debug"),
    hint: game.i18n.localize("k4lt.Settings.DebugHint"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    requiresReload: true,
  });
};
