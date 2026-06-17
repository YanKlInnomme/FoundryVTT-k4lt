// k4lt.js
import {
  addk4ltLinksToSettings,
  registerk4ltSettings
} from "./modules/settings.js";
import {
  registerk4ltDocuments
} from "./modules/register-documents.js";
import Hotbar from "./modules/hotbar.js";
import registerHandlebarsHelpers from "./modules/helpers.js";
import k4ltMJHoldTracker from "./applications/mj-hold-tracker.js";
import k4ltItemViewer from "./applications/item-viewer.js";
import k4ltShareDialog from "./applications/share-dialog.js";
const templatePaths = [
  "systems/k4lt/templates/partials/armor-viewer.hbs",
  "systems/k4lt/templates/partials/darksecret-viewer.hbs",
  "systems/k4lt/templates/partials/default-viewer-header.hbs",
  "systems/k4lt/templates/partials/dramatichook-card.hbs",
  "systems/k4lt/templates/partials/dramatichook-viewer-header.hbs",
  "systems/k4lt/templates/partials/dramatichook-viewer.hbs",
  "systems/k4lt/templates/partials/gear-viewer.hbs",
  "systems/k4lt/templates/partials/move-viewer.hbs",
  "systems/k4lt/templates/partials/relationship-card.hbs",
  "systems/k4lt/templates/partials/relationship-viewer-header.hbs",
  "systems/k4lt/templates/partials/relationship-viewer.hbs",
  "systems/k4lt/templates/partials/trait-viewer.hbs",
  "systems/k4lt/templates/partials/weapon-viewer.hbs",
  "systems/k4lt/templates/partials/drop-item.hbs",
];
async function preloadHandlebarTemplates() {
  kultLogger("Loading templates:", templatePaths);
  return foundry.applications.handlebars.loadTemplates(templatePaths);
}
const systemId = "k4lt";
const kultLogger = (...content) => {
  const isDebugging = game.settings.get(systemId, "debug");
  isDebugging && console.info("K4lt |", ...content);
};
const registerkultLogger = () => {
  window.kultLogger = kultLogger;
};
Hooks.once("init", () => {
  registerkultLogger();
  registerk4ltSettings(systemId);
  registerk4ltDocuments(systemId);
  registerHandlebarsHelpers();
  preloadHandlebarTemplates();
  console.log("K4LT | System Initialized");
});
Hooks.on("renderSettings", addk4ltLinksToSettings);
Hooks.on(
  "hotbarDrop",
  (bar, data, slot) => {
    if (data.type !== "Item") {
      return;
    }
    Hotbar.createK4ltMacro(
      data,
      slot
    );
    return false;
  }
);
let holdTracker;
/* -------------------------------------- */
/* OPEN TRACKER                           */
/* -------------------------------------- */
Hooks.once("ready", () => {
  if (!game.user.isGM)
    return;
  holdTracker =
    new k4ltMJHoldTracker();
  holdTracker.render(true);
});
/* -------------------------------------- */
/* AUTO REFRESH                           */
/* -------------------------------------- */
function refreshHoldTracker() {
  if (
    !game.user.isGM ||
    !holdTracker ||
    !holdTracker.rendered
  ) return;
  holdTracker.render(false);
}
/* Item tokens */
Hooks.on(
  "updateItem",
  refreshHoldTracker
);
Hooks.on(
  "createItem",
  refreshHoldTracker
);
Hooks.on(
  "deleteItem",
  refreshHoldTracker
);
/* Actor rename / ownership / create */
Hooks.on(
  "updateActor",
  refreshHoldTracker
);
Hooks.on(
  "createActor",
  refreshHoldTracker
);
Hooks.on(
  "deleteActor",
  refreshHoldTracker
);
/* ===================================== */
/* CHAT : RELOAD REQUESTS                */
/* ===================================== */
Hooks.on(
  "renderChatMessageHTML",
  (message, html) => {
    /* ========================= */
    /* SAFE RELOAD               */
    /* ========================= */
    html.querySelectorAll(
        '[data-reload="safe"]'
      )
      .forEach(btn => {
        btn.addEventListener(
          "click",
          async ev => {
            const actor =
              game.actors.get(
                ev.currentTarget
                .dataset.actor
              );
            const item =
              actor.items.get(
                ev.currentTarget
                .dataset.item
              );
            /* recharge */
            await item.update({
              "system.ammo.value":
                item.system.ammo.max
            });
            ui.notifications.info(
              game.i18n.format(
                "k4lt.reload.Reloaded",
                {
                  item: item.name
                }
              )
            );
          });
      });
    /* ========================= */
    /* UNDER PRESSURE            */
    /* ========================= */
    html.querySelectorAll(
        '[data-reload="pressure"]'
      )
      .forEach(btn => {
        btn.addEventListener(
          "click",
          async ev => {
            const actor =
              game.actors.get(
                ev.currentTarget
                .dataset.actor
              );
            const item =
              actor.items.get(
                ev.currentTarget
                .dataset.item
              );
            /* joueurs propriétaires */
            const owners =
              game.users.filter(
                u =>
                actor.testUserPermission(
                  u,
                  "OWNER"
                )
              );
            /* chercher move */
const pressureMove = actor.items.find(
  i =>
    i.type === "move"
    &&
    (
      i.flags?.babele?.originalName ===
      "Act Under Pressure"
      ||
      i.name ===
      "Act Under Pressure"
    ),
);
  kultLogger("PRESSURE MOVE",pressureMove);
            /* sécurité */
            if (!pressureMove) {
              ui.notifications.warn(
                game.i18n.format(
                  "k4lt.reload.NoPressureMove",
                  {
                    actor: actor.name
                  }
                )
              );
              return;
            }
            /* whisper joueur */
            await ChatMessage.create({
              whisper:
                owners.map(
                  u => u.id
                ),
              content: `
                <p>
                ${game.i18n.format("k4lt.reload.RequestGM", {
                  item: item.name
                })}
                </p>
                <button
                class="k4lt-chat-btn
                k4lt-chat-btn-danger"
                data-roll-reload
                data-actor="${actor.id}"
                data-move="${pressureMove.id}"
                >
                  <i class="fas fa-dice-d10"></i>
                  ${game.i18n.localize(
                  "k4lt.reload.Roll"
                  )}
                </button>
              `
            });
          });
      });
  });
/* ===================================== */
/* GLOBAL CHAT BUTTONS                   */
/* ===================================== */
Hooks.once(
  "ready",
  () => {
    document.addEventListener(
      "click",
      async ev => {
        const btn =
          ev.target.closest(
            "[data-roll-reload]"
          );
        if (!btn)
          return;
        const actor =
          game.actors.get(
            btn.dataset.actor
          );
        if (!actor)
          return;
        await actor.moveroll(
          btn.dataset.move
        );
      });
  });
Hooks.once("ready", () => {
  game.socket.on(
    "system.k4lt",
    async data => {
      kultLogger(
        "Socket received",
        game.user.name,
        data,
      );
      if (
        data.users?.length &&
        !data.users.includes(
          game.user.id,
        )
      ) {
        return;
      }
      switch (data.type) {
        case "showItemViewer": {
          const item =
            await fromUuid(
              data.uuid,
            );
          if (!item) {
            kultLogger(
              "Unable to resolve item",
              data.uuid,
            );
            return;
          }
          new k4ltItemViewer(
            item,
          ).render(true);
          break;
        }
      }
    },
  );
const ImagePopout =
  foundry.applications.apps.ImagePopout;
const originalShareImage =
  ImagePopout.prototype.shareImage;
ImagePopout.prototype.shareImage =
  function(options = {}) {
    new k4ltShareDialog({
      onShare: users => {
        originalShareImage.call(
          this,
          {
            ...options,
            users,
          },
        );
      },
    }).render(true);
  };
});
