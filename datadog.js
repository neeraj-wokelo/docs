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
    // Runs only after DD_RUM is initialized. Attempts to fetch the current
    // user's profile from the akta.pro API and, on success, links that identity
    // to the RUM session. If the access token has expired, refreshes it once
    // and retries the profile call once. Every step is silent: no UI, no
    // errors, no retries beyond the single chain below.
    //
    // Anonymous visitors will hit /user/profile, get 401, and the funnel ends
    // silently — the wasted request is cheap and avoids depending on the
    // `akta_logged_in` cookie (which may be HttpOnly, may be scoped to a
    // different path, or may not exist on every subdomain).
    //
    // Debug: set `window.__AKTA_IDENTITY_DEBUG__ = true` in DevTools before
    // reload to see step-by-step logs.
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

  function debug() {
    if (!window.__AKTA_IDENTITY_DEBUG__) return;
    var args = Array.prototype.slice.call(arguments);
    args.unshift('[akta-identity]');
    try { console.log.apply(console, args); } catch (_) {}
  }

  function linkIdentity() {
    if (identityStarted) return;
    identityStarted = true;

    debug('funnel begin');

    fetchWithTimeout(API_BASE + PROFILE_PATH, { method: 'GET', credentials: 'include' }, FETCH_TIMEOUT_MS)
      .then(function (res) {
        debug('profile response', res && res.status);
        if (res && res.status === 401) {
          return tryRefreshThenProfile();
        }
        return res;
      })
      .then(applyProfileToDatadog)
      .catch(function (err) {
        debug('funnel error', err && err.message);
        /* swallow — silent in production */
      });
  }

  function tryRefreshThenProfile() {
    debug('attempting token refresh');
    return fetchWithTimeout(API_BASE + REFRESH_PATH, { method: 'POST', credentials: 'include' }, FETCH_TIMEOUT_MS)
      .then(function (refreshRes) {
        debug('refresh response', refreshRes && refreshRes.status);
        if (!refreshRes || !(refreshRes.status >= 200 && refreshRes.status < 300)) {
          return null;
        }
        return fetchWithTimeout(API_BASE + PROFILE_PATH, { method: 'GET', credentials: 'include' }, FETCH_TIMEOUT_MS);
      });
  }

  function applyProfileToDatadog(res) {
    if (!res || !(res.status >= 200 && res.status < 300)) return;
    return res.json().then(function (u) {
      if (!u || !u.id) {
        debug('profile body had no id', u);
        return;
      }
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
        debug('identity linked', { id: u.id, email: u.email, name: name });
      } catch (e) {
        debug('setUser threw', e && e.message);
      }
    }, function (parseErr) {
      debug('profile body parse error', parseErr && parseErr.message);
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
})();