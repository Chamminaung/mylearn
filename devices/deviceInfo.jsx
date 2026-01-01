import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Device from 'expo-device';

const DeviceInfoDisplay = () => {
  const [deviceInfo, setDeviceInfo] = useState({});

  useEffect(() => {
    async function fetchDeviceInfo() {
      setDeviceInfo({
        brand: Device.brand, // e.g., "Apple" or "Samsung"
        manufacturer: Device.manufacturer, // e.g., "Apple" or "Google"
        modelName: Device.modelName, // e.g., "iPhone 13" or "SM-G998B"
        osName: Device.osName, // e.g., "iOS" or "Android"
        osVersion: Device.osVersion, // e.g., "17.0" or "13"
        // Get the unique name set by the user (not a hardware ID)
        deviceName: Device.deviceName,
        // Check if the device is a physical device or an emulator/simulator
        isRealDevice: Device.isDevice, 
      });
    }

    fetchDeviceInfo();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Device Details:</Text>
      <Text>• **Brand:** {deviceInfo.brand}</Text>
      <Text>• **Model:** {deviceInfo.modelName}</Text>
      <Text>• **OS:** {deviceInfo.osName} {deviceInfo.osVersion}</Text>
      <Text>• **User Name:** {deviceInfo.deviceName}</Text>
      <Text>• **Physical Device:** {deviceInfo.isRealDevice ? 'Yes' : 'No (Simulator/Emulator)'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
});

export default DeviceInfoDisplay;