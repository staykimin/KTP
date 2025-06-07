FingerprintJS.load().then(fp => {
	fp.get().then(result => {
		const visitorId = result.visitorId;
		localStorage.setItem("fp_id", visitorId);

		// Override fetch biar semua request ke backend otomatis bawa header fingerprint
		const originalFetch = window.fetch;
		window.fetch = function (url, options = {}) {
			options.headers = {
				...(options.headers || {}),
				"HI": visitorId,
			};
			return originalFetch(url, options);
		};
	});
});