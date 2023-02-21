const kultLogger = (...content) => {
  const isDebugging = game.settings.get("k4lt", "debug");
  isDebugging && console.info("K4lt |", ...content);
};

export const registerLogger = () => {
  window.kultLogger = kultLogger;
};
