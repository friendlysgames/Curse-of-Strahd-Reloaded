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



/*Journal Anchor Links integration: https://foundryvtt.com/packages/jal */

/* ------------------------------------------------------------- */
/*   © Copyright 2023, aMediocreDad                              */
/*                                                               */
/*   Distributed in accordance with Foundry Gaming LLC.          */
/*   LIMITED LICENSE AGREEMENT FOR MODULE DEVELOPMENT            */
/*                                                               */
/*   You may use this software free of charge as long as it      */
/*   adheres to the above limited license agreement. For more    */
/*   information visit: https://foundryvtt.com/article/license/  */
/*                                                               */
/* ------------------------------------------------------------- */

// Why doesn't this just exist in core foundry?
Hooks.on("activateNote", (note, options) => {
	options.anchor = note.document.flags.anchor?.slug;
});

function getOptions(page, current) {
	let options = "<option></option>";

	for (const key in page?.toc) {
		const section = page.toc[key];
		options += `<option value="${section.slug}"${
			section.slug === current ? " selected" : ""
		}>${section.text}</option>`;
	}

	return options;
}

Hooks.on("renderNoteConfig", async (app, html, data) => {
	let select = $(
		`<div class='form-group'><label>Page Section:</label><div class='form-fields'><select name="flags.anchor.slug">${getOptions(
			data.document.page,
			data.document.flags.anchor?.slug
		)}</select></div></div>`
	);
	const pageid = html.find("select[name='pageId']");
	pageid.parent().parent().after(select);

	// on change of page or journal entry
	function _updateSectionList() {
		const newjournalid = app.form.elements.entryId?.value;
		const newpageid = app.form.elements.pageId?.value;
		const journal = game.journal.get(newjournalid);
		const newpage = journal?.pages.get(newpageid);
		app.form.elements["flags.anchor.slug"].innerHTML = getOptions(
			newpage,
			data.document.flags.anchor?.slug
		);
	}
	html.find("select[name='entryId']").change(_updateSectionList);
	pageid.change(_updateSectionList);

	// Force a recalculation of the height (for the additional field)
	if (!app._minimized) {
		let pos = app.position;
		pos.height = "auto";
		app.setPosition(pos);
	}
});

// This runs only on canvas drop and after the renderNoteConfig hook above.
// It ensures that we have fill the html of the NoteConfig window with the correct data on first drop.
Hooks.on("dropCanvasData", (_, data) => {
	if (!(data.type === "JournalEntryPage" && data.anchor)) return;
	const { anchor } = data;

	Hooks.once("renderNoteConfig", (_, html, { label }) => {
		html.find("input[name='text']").val(`${label}: ${anchor.name}`);
		html.find(`option[value=${anchor.slug}]`).attr("selected", true);
	});
});