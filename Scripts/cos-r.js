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