(function () {
  var script = document.createElement('script');
  script.src = 'https://www.datadoghq-browser-agent.com/us1/v5/datadog-rum.js';
  script.type = 'text/javascript';
  script.async = true;

  script.onload = function () {
    window.DD_RUM.init({
      applicationId: 'f040bf65-29e7-46af-9292-3cc51ecbb954',
      clientToken: 'pub0646eca4b51034910052bb1667044dfd',
      site: 'datadoghq.com',
      service: 'aktapro-docs',
      env: 'production',
      version: '1.0.0',
      sessionSampleRate: 100,
      sessionReplaySampleRate: 20,
      trackUserInteractions: true,
      trackResources: true,
      trackLongTasks: true,
      defaultPrivacyLevel: 'mask-user-input',
    });

    window.DD_RUM.startSessionReplayRecording();

    // -----------------------------------------------------------------------------
    // Silent identity funnel
    // -----------------------------------------------------------------------------
    // Runs only after DD_RUM is initialized. If the visitor is logged in to the
    // main akta.pro app (signalled by the cross-subdomain `akta_logged_in`
    // cookie), pull the user profile from the API and link it to the RUM
    // session. If the access token has expired, refresh it once and retry the
    // profile call once. Every step is silent: no UI, no errors, no retries
    // beyond the single chain below.
    // -----------------------------------------------------------------------------
    try {
      linkIdentity();
    } catch (_) {
      /* never throw from this script */
    }
  };

  script.onerror = function () {
    console.error('Datadog RUM script failed to load.');
  };

  document.head.appendChild(script);

  // ---------------------------------------------------------------------------
  // Identity funnel
  // ---------------------------------------------------------------------------
  var API_BASE = 'https://api.akta.pro';
  var PROFILE_PATH = '/api/v1/user/profile';
  var REFRESH_PATH = '/api/v1/auth/refresh';
  var FETCH_TIMEOUT_MS = 5000;
  var identityStarted = false;

  function linkIdentity() {
    if (identityStarted) return;
    identityStarted = true;

    if (!hasLoggedInCookie()) return;

    fetchWithTimeout(API_BASE + PROFILE_PATH, { method: 'GET', credentials: 'include' }, FETCH_TIMEOUT_MS)
      .then(function (res) {
        if (res && res.status === 401) {
          return tryRefreshThenProfile();
        }
        return res;
      })
      .then(applyProfileToDatadog)
      .catch(swallow);
  }

  function tryRefreshThenProfile() {
    return fetchWithTimeout(API_BASE + REFRESH_PATH, { method: 'POST', credentials: 'include' }, FETCH_TIMEOUT_MS)
      .then(function (refreshRes) {
        // Single refresh attempt — if it didn't succeed, give up silently.
        if (!refreshRes || !(refreshRes.status >= 200 && refreshRes.status < 300)) {
          return null;
        }
        return fetchWithTimeout(API_BASE + PROFILE_PATH, { method: 'GET', credentials: 'include' }, FETCH_TIMEOUT_MS);
      });
  }

  function applyProfileToDatadog(res) {
    if (!res || !(res.status >= 200 && res.status < 300)) return;
    return res.json().then(function (u) {
      if (!u || !u.id) return;
      var name = [u.first_name, u.last_name].filter(Boolean).join(' ') || undefined;

      try {
        window.DD_RUM.setUser({
          id: u.id,
          email: u.email,
          name: name,
        });
        window.DD_RUM.setUserProperty('email_verified', u.email_verified ? 'true' : 'false');
        window.DD_RUM.setUserProperty('active_package_type', u.active_package_type || '');
        window.DD_RUM.setUserProperty('plan_code', (u.active_subscription && u.active_subscription.plan && u.active_subscription.plan.plan_code) || '');
        window.DD_RUM.setUserProperty('is_admin', u.is_admin ? 'true' : 'false');
      } catch (_) {
        /* swallow */
      }
    }, swallow);
  }

  function hasLoggedInCookie() {
    return document.cookie.split(';').some(function (c) {
      return c.trim().indexOf('akta_logged_in=') === 0;
    });
  }

  function fetchWithTimeout(url, init, timeoutMs) {
    var controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    var timer = null;
    var signal = controller ? controller.signal : undefined;

    if (controller) {
      timer = setTimeout(function () {
        try { controller.abort(); } catch (_) {}
      }, timeoutMs);
    }

    var fetchInit = Object.assign({}, init, signal ? { signal: signal } : {});

    return fetch(url, fetchInit).finally(function () {
      if (timer) clearTimeout(timer);
    });
  }

  function swallow() {
    /* intentionally empty — every silent step ends here */
  }
})();