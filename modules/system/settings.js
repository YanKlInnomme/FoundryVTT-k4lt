export const registerSystemSettings = function () {
    game.settings.register("k4lt", "pausePath", {
        name: game.i18n.localize("k4lt.Settings.PauseIcon"),
        hint: game.i18n.localize("k4lt.Settings.PauseIconHint"),
        scope: "world",
        config: true,
        default: "systems/k4lt/assets/pausebg.png",
        type: String,
        filePicker: true,
        onChange: () => window.location.reload()
    });
    game.settings.register("k4lt", "pauseOpacity", {
        name: game.i18n.localize("k4lt.Settings.Opacity"),
        hint: game.i18n.localize("k4lt.Settings.OpacityHint"),
        scope: "world",
        config: true,
        default: 50,
        type: Number,
        onChange: () => window.location.reload()
    });
    game.settings.register("k4lt", "pauseText", {
        name: game.i18n.localize("k4lt.Settings.PauseText"),
        hint: game.i18n.localize("k4lt.Settings.PauseTextHint"),
        scope: "world",
        config: true,
        default: game.i18n.localize("k4lt.Settings.Paused"),
        type: String,
        onChange: () => window.location.reload()
    });
    game.settings.register("k4lt", "pauseSpeed", {
        name: game.i18n.localize("k4lt.Settings.RotationSpeed"),
        hint: game.i18n.localize("k4lt.Settings.RotationSpeedHint"),
        scope: "world",
        config: true,
        default: "5",
        type: Number,
        onChange: () => window.location.reload()
    });
    game.settings.register("k4lt", "debug", {
        name: game.i18n.localize("k4lt.Settings.Debug"),
        hint: game.i18n.localize("k4lt.Settings.DebugHint"),
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
        onChange: () => window.location.reload()
    });
};


