function is_xr_available() {
	if ("xr" in window.navigator) {
		console.log("XR available");
		return true;
	} else {
		console.log("XR not available");
		return false;
	}
}


async function session_type_support_check(session_type) {
	var is_supported = await navigator.xr.isSessionSupported(session_type);
	return is_supported;
}


async function session_types_check(user_fingerprint) {
	user_fingerprint['supported_session_types'] = [];
	const session_types = ["immersive-ar", "immersive-vr", "inline"];
	for (let session_type of session_types) {
		let supported = await session_type_support_check(session_type);
		if (supported) {
			user_fingerprint['supported_session_types'].push(session_type);
		}
		console.log(`support for ${session_type}: ${supported}`);
	}
}

function fingerprint_xr_session(xr_session, session_type, user_fingerprint) {
	user_fingerprint[session_type] = {};
	user_fingerprint[session_type]["num_controllers"] = xr_session.inputSources.length;
	try {
		user_fingerprint[session_type]["handset_id"] = xr_session[
			Object.getOwnPropertySymbols(xr_session)[1]
		].device.gamepads[0].id;
	} catch (error) {
		user_fingerprint[session_type]["handset_id"] = null;
	}


	try {
		user_fingerprint[session_type]["handset_has_position"]  = xr_session[
			Object.getOwnPropertySymbols(xr_session)[1]
		].device.gamepads[0].pose.hasPosition;
	} catch (error) {
		user_fingerprint[session_type]["handset_has_position"] = null;
	}
}

async function session_types_fingerprint(user_fingerprint) {
	for (let session_type of user_fingerprint['supported_session_types']) {
		var xr_session = await navigator.xr.requestSession(session_type);
		fingerprint_xr_session(xr_session, session_type, user_fingerprint);
	}
}

function send_fingerprint(user_fingerprint) {
	data = JSON.stringify({"fingerprint": user_fingerprint});
	console.log("data: ", data);
	fetch('http://localhost:3000/log/fingerprint', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: data
	})
	.then(data => {
		console.log('Sent fingerprint');
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}

async function fingerprint() {
	user_fingerprint = {};
	user_fingerprint['has_xr'] = is_xr_available();

	if (user_fingerprint['has_xr']) {
		// continue with additional fingerprinting
		await session_types_check(user_fingerprint);
		await session_types_fingerprint(user_fingerprint);
	}

	send_fingerprint(user_fingerprint);
}

fingerprint();


/*
[References]
[1]: https://www.w3schools.com/js/js_arrays.asp
[2]: https://developer.mozilla.org/en-US/docs/Web/API/XRSession



*/