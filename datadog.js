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
  };

  script.onerror = function () {
    console.error('Datadog RUM script failed to load.');
  };

  document.head.appendChild(script);
})();