import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { getDeviceInfo } from '../utils/deviceInfo';

export default function DeviceScreen() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    (async () => {
      const deviceInfo = await getDeviceInfo();
      //console.log('Device Info:', deviceInfo);
      setInfo(deviceInfo);
    })();
  }, []);

  if (!info) return <Text>Loading device info...</Text>;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 20 }}>📱 Device Info</Text>
      {Object.entries(info).map(([key, value]) => (
        <Text key={key}>
          {key}: {String(value)}
        </Text>
      ))}
    </View>
  );
}
