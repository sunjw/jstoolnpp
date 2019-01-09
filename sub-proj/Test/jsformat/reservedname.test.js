.catch(msg => console.log(`${msg}`))
.then(() => {
	if (browser) {
		browser.close();
		browser = undefined;
	}
})

lksjdflas = {

	// wait for "Positions" pseudo-button to be available
	this.waitForSelectorTest('[data-ctcname="NavigationItem_lNavi"]', "Find positions pseudo-button.")
	.waitForIdle()

	// click the "button"
	.then(function () {
		test.info("Switching to positions view.");
		this.click('[data-ctcname="NavigationItem_lNavi"]');
	})

}
