function ask_user_permission() {
	if (!window.abc) {
		var tmp = navigator.xr.requestSession;
		navigator.xr.requestSession = function (mode, enabledFeatures = {}) {
			if (window.confirm("Allow WebXR?")) {
				navigator.xr.requestSession = tmp;
				console.log(navigator.xr.requestSession);
				return navigator.xr.requestSession(mode, enabledFeatures);
			}
		}
		window.abc = true;
	}
}

function inject_my_script(tabId, changeInfo, tab) {
	if (changeInfo.status = "loading") {
		chrome.scripting.executeScript(
			{
				target: {tabId: tabId},
				func: ask_user_permission,
				world: "MAIN"
			},
			() => {console.log("injected func")}
		);
	}

}

chrome.tabs.onUpdated.addListener(inject_my_script);