'use client';

import React, { useEffect, useState } from 'react';
import { DeviceUUID } from 'device-uuid';

export function DeviceInfo() {
  const [uuid, setUuid] = useState<string | null>(null);
  const [browser, setBrowser] = useState('');
  const [os, setOs] = useState('');

  useEffect(() => {
    const device = new DeviceUUID();
    const info = device.parse();

    setUuid(device.get());
    setBrowser(info.browser);
    setOs(info.os);
  }, []);

  if (!uuid) return <p>Loading...</p>;

  return (
    <div>
      <p>UUID: {uuid}</p>
      <p>Browser: {browser}</p>
      <p>OS: {os}</p>
    </div>
  );
}
