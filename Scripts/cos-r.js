///Silvered Ammunition Script
Hooks.on("dnd5e.preRollDamage", (item, config) => {
    if(item.system.consume?.type === "ammo" && !!item.system.consume.target) {
        let ammoName = item.actor?.items?.get(item.system.consume.target).name.toLowerCase();
        if (!ammoName) return;
        if (ammoName.includes("silvered")) foundry.utils.setProperty(item,"system.properties.sil",true);
        if (ammoName.includes("magical")) foundry.utils.setProperty(item,"system.properties.mgc",true);
        if (ammoName.includes("adamantine")) foundry.utils.setProperty(item,"system.properties.ada",true);
        else return;
    }
})

Hooks.on('renderPause', (app, [html], options) => {
    const img = html.querySelector('img')
    if (!img) return;
    img.src = 'modules/curse-of-strahd-reloaded/pause_icon.webp'
      // Set the image to display at 2x its original size
    img.style.transform = 'scale(2)';
  });

  Hooks.once("init", () => {
    CONFIG.DND5E.rules.dazed = "Compendium.curse-of-strahd-reloaded.curse-of-strahd-reloaded-journals.JournalEntry.x5iZhF70zzKkfSyw.JournalEntryPage.aGhbXkt49e83Vb4T";
  });

  