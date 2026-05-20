(() => {
  'use strict';

  const FEATURE_KEYS = [
    'canvas',
    'webgl',
    'audio',
    'fonts',
    'mediaDevices',
    'networkInfo',
    'timezone',
    'incognitoDetection',
  ];

  const PRESET_METHODS = {
    minimal: ['basic'],
    standard: ['basic', 'canvas', 'webgl', 'timezone'],
    comprehensive: ['basic', ...FEATURE_KEYS],
  };

  const els = {};
  let DeviceUUIDClass = null;
  let device = null;
  let latestBasicUuid = '';
  let latestAdvancedUuid = '';

  const $ = (id) => document.getElementById(id);

  const setText = (id, value) => {
    const element = els[id] || $(id);
    if (element) element.textContent = value == null || value === '' ? '-' : String(value);
  };

  const formatBoolean = (value) => {
    if (value === true) return 'Yes';
    if (value === false) return 'No';
    return String(value || 'No');
  };

  const formatDuration = (value) =>
    typeof value === 'number' && Number.isFinite(value) ? `${Math.round(value)} ms` : '-';

  const formatTimestamp = (value) => {
    if (!value) return '-';
    return new Date(value).toLocaleString();
  };

  const clearChildren = (node) => {
    while (node.firstChild) node.removeChild(node.firstChild);
  };

  const appendDefinition = (container, label, value) => {
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = label;
    dd.textContent = value == null || value === '' ? '-' : String(value);
    container.append(dt, dd);
  };

  const renderDefinitions = (container, entries) => {
    clearChildren(container);
    for (const [label, value] of entries) appendDefinition(container, label, value);
  };

  const setStatus = (message, type = 'pending') => {
    els.libraryStatus.textContent = message;
    els.libraryStatus.className = `status-line status-${type}`;
  };

  const setStatusMessage = (element, message, type = '') => {
    element.textContent = message;
    element.className = type ? `status-line status-${type}` : 'status-line';
  };

  const setAdvancedStatus = (message, type = '') => {
    setStatusMessage(els.advancedStatus, message, type);
  };

  const getFeatureSupport = (feature) => {
    if (!DeviceUUIDClass?.isFeatureSupported) return false;
    try {
      return DeviceUUIDClass.isFeatureSupported(feature);
    } catch {
      return false;
    }
  };

  const renderFeatureSupport = () => {
    clearChildren(els.featureSupport);
    for (const feature of FEATURE_KEYS) {
      const supported = getFeatureSupport(feature);
      const chip = document.createElement('span');
      chip.className = `chip ${supported ? 'chip-ok' : 'chip-warn'}`;
      chip.textContent = `${feature}: ${supported ? 'supported' : 'limited'}`;
      els.featureSupport.appendChild(chip);
    }
  };

  const renderAgentInfo = (info, container) => {
    renderDefinitions(container, [
      ['Browser', `${info.browser} ${info.version}`.trim()],
      ['Operating system', info.os],
      ['Platform', info.platform],
      ['Language', info.language],
      ['Resolution', Array.isArray(info.resolution) ? info.resolution.join(' x ') : '-'],
      ['Color depth', `${info.colorDepth} bits`],
      ['Pixel depth', `${info.pixelDepth} bits`],
      ['CPU cores', info.cpuCores],
      ['Desktop', formatBoolean(info.isDesktop)],
      ['Mobile', formatBoolean(info.isMobile)],
      ['Tablet', formatBoolean(info.isTablet)],
      ['Touch screen', formatBoolean(info.isTouchScreen)],
      ['Bot', formatBoolean(info.isBot)],
      ['Smart TV', formatBoolean(info.isSmartTV)],
    ]);
  };

  const renderComponents = (components) => {
    renderDefinitions(
      els.syncComponents,
      Object.entries(components).map(([key, value]) => [key, value])
    );
  };

  const generateBasicUuid = (customData = '') => {
    if (!device) return;
    latestBasicUuid = device.get(customData || undefined);
    setText('basicUuid', latestBasicUuid);
    renderComponents(device.getComponents());
  };

  const parseUserAgent = () => {
    if (!device) return;
    const source = els.userAgentInput.value.trim();
    const info = device.parse(source || undefined);
    renderAgentInfo(info, els.uaResults);
  };

  const getSelectedMode = () => {
    const selected = document.querySelector('input[name="mode"]:checked');
    return selected?.value || 'preset';
  };

  const getCustomOptions = () => {
    const options = {};
    document.querySelectorAll('input[name="feature"]').forEach((input) => {
      options[input.value] = input.checked;
    });
    options.timeout = Number.parseInt(els.timeout.value, 10) || 5000;
    options.methodTimeout = Number.parseInt(els.methodTimeout.value, 10) || 1000;
    return options;
  };

  const getEnabledMethods = (mode, options) => {
    if (mode === 'preset') return PRESET_METHODS[els.presetSelect.value] || ['basic'];
    return ['basic', ...FEATURE_KEYS.filter((feature) => options[feature])];
  };

  const runPreset = async (preset) => {
    if (preset === 'minimal') return device.getDetailedAsync('minimal');
    if (preset === 'comprehensive') return device.getDetailedAsync('comprehensive');
    return device.getDetailedAsync('standard');
  };

  const renderComponentTable = (components) => {
    clearChildren(els.componentTable);
    for (const component of Object.values(components)) {
      const row = document.createElement('tr');
      const status = component.success ? 'success' : 'blocked';
      const cells = [
        component.name,
        status,
        component.value || 'unavailable',
        formatDuration(component.duration),
      ];
      for (const value of cells) {
        const cell = document.createElement('td');
        cell.textContent = value;
        row.appendChild(cell);
      }
      els.componentTable.appendChild(row);
    }
  };

  const renderAdvancedResult = (details, enabledMethods) => {
    latestAdvancedUuid = details.uuid;
    const components = Object.values(details.components);
    const succeeded = components.filter((component) => component.success).length;
    const blocked = components.length - succeeded;

    setText('advancedUuid', details.uuid);
    setText('advancedConfidence', `${Math.round(details.confidence * 100)}%`);
    setText('advancedDuration', formatDuration(details.duration));
    setText('advancedTimestamp', formatTimestamp(details.timestamp));
    setText('advancedMethods', enabledMethods.join(', '));
    setText('advancedCounts', `${succeeded} succeeded / ${blocked} blocked`);
    renderComponentTable(details.components);
  };

  const resetAdvanced = () => {
    latestAdvancedUuid = '';
    setAdvancedStatus('Advanced fingerprinting has not run.');
    for (const id of [
      'advancedUuid',
      'advancedConfidence',
      'advancedDuration',
      'advancedTimestamp',
      'advancedMethods',
      'advancedCounts',
    ]) {
      setText(id, '-');
    }
    els.componentTable.innerHTML =
      '<tr><td colspan="4">Run advanced fingerprinting to populate components.</td></tr>';
  };

  const copyText = async (value, label, statusTarget) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setStatusMessage(statusTarget, `${label} copied to clipboard.`, 'ok');
    } catch {
      setStatusMessage(statusTarget, 'Clipboard access was blocked by the browser.', 'warn');
    }
  };

  const setAdvancedLoading = (isLoading) => {
    els.runAdvanced.disabled = isLoading;
    els.runAdvanced.setAttribute('aria-busy', String(isLoading));
    els.runAdvanced.textContent = isLoading ? 'Running...' : 'Run advanced fingerprint';
  };

  const runAdvanced = async () => {
    if (!device) return;
    const mode = getSelectedMode();
    const options = mode === 'custom' ? getCustomOptions() : null;
    const enabledMethods = getEnabledMethods(mode, options || {});

    setAdvancedLoading(true);
    setAdvancedStatus('Collecting fingerprint components...', 'pending');

    try {
      const details =
        mode === 'preset'
          ? await runPreset(els.presetSelect.value)
          : await device.getDetailedAsync(options);
      renderAdvancedResult(details, enabledMethods);
      setAdvancedStatus('Advanced fingerprint run complete.', 'ok');
    } catch (error) {
      setAdvancedStatus(error?.message || 'Advanced fingerprinting failed.', 'error');
    } finally {
      setAdvancedLoading(false);
    }
  };

  const toggleModePanels = () => {
    const isCustom = getSelectedMode() === 'custom';
    els.presetPanel.classList.toggle('hidden', isCustom);
    els.customPanel.classList.toggle('hidden', !isCustom);
  };

  const bindEvents = () => {
    els.customDataForm.addEventListener('submit', (event) => {
      event.preventDefault();
      generateBasicUuid(els.customData.value.trim());
    });
    els.useCurrentUa.addEventListener('click', () => {
      els.userAgentInput.value = navigator.userAgent;
      parseUserAgent();
    });
    els.parseUserAgent.addEventListener('click', parseUserAgent);
    els.runAdvanced.addEventListener('click', runAdvanced);
    els.resetResults.addEventListener('click', resetAdvanced);
    els.copyBasic.addEventListener('click', () => copyText(latestBasicUuid, 'Basic UUID', els.basicStatus));
    els.copyAdvanced.addEventListener('click', () =>
      copyText(latestAdvancedUuid, 'Advanced UUID', els.advancedStatus)
    );
    document.querySelectorAll('input[name="mode"]').forEach((input) => {
      input.addEventListener('change', toggleModePanels);
    });
  };

  const cacheElements = () => {
    Object.assign(els, {
      libraryStatus: $('library-status'),
      featureSupport: $('feature-support'),
      basicStatus: $('basic-status'),
      basicUuid: $('basic-uuid'),
      customDataForm: $('custom-data-form'),
      customData: $('custom-data'),
      browserInfo: $('browser-info'),
      syncComponents: $('sync-components'),
      userAgentInput: $('user-agent-input'),
      uaResults: $('ua-results'),
      useCurrentUa: $('use-current-ua'),
      parseUserAgent: $('parse-user-agent'),
      presetPanel: $('preset-panel'),
      customPanel: $('custom-panel'),
      presetSelect: $('preset-select'),
      timeout: $('timeout'),
      methodTimeout: $('method-timeout'),
      runAdvanced: $('run-advanced'),
      resetResults: $('reset-results'),
      copyBasic: $('copy-basic'),
      copyAdvanced: $('copy-advanced'),
      advancedStatus: $('advanced-status'),
      advancedUuid: $('advanced-uuid'),
      advancedConfidence: $('advanced-confidence'),
      advancedDuration: $('advanced-duration'),
      advancedTimestamp: $('advanced-timestamp'),
      advancedMethods: $('advanced-methods'),
      advancedCounts: $('advanced-counts'),
      componentTable: $('component-table'),
    });
  };

  const init = () => {
    cacheElements();
    DeviceUUIDClass = window.DeviceUUID || window.DeviceUUIDModule?.DeviceUUID;

    if (!DeviceUUIDClass) {
      setStatus('Browser bundle not found at assets/index.browser.min.js.', 'error');
      els.runAdvanced.disabled = true;
      return;
    }

    device = new DeviceUUIDClass();
    setStatus('Loaded and ready.', 'ok');
    renderFeatureSupport();
    bindEvents();

    const info = device.parse();
    latestBasicUuid = device.get();
    setText('basicUuid', latestBasicUuid);
    renderAgentInfo(info, els.browserInfo);
    renderComponents(device.getComponents());
    els.userAgentInput.value = navigator.userAgent;
    renderAgentInfo(info, els.uaResults);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
