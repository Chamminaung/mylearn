import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import Constants from 'expo-constants';
import { v4 as uuidv4 } from 'uuid';

let cachedId = null;

export async function getDeviceInfo() {
  let uniqueId = 'unknown';
  let osName = Platform.OS;
  let osVersion = '';
  let brand = '';
  let model = '';
  let isDevice = true;

  try {
    if (Platform.OS === 'android') {
      // ✅ FIX IS HERE
      uniqueId = Application.getAndroidId();
      osVersion = Device.osVersion ?? '';
      brand = Device.brand ?? '';
      model = Device.modelName ?? '';

    } else if (Platform.OS === 'ios') {
      uniqueId = await Application.getIosIdForVendorAsync();
      osVersion = Device.osVersion ?? '';
      brand = 'Apple';
      model = Device.modelName ?? '';

    } else if (Platform.OS === 'web') {
      uniqueId =
        cachedId ||
        (cachedId =
          localStorage.getItem('webDeviceId') ||
          (() => {
            const id = 'web-' + uuidv4();
            localStorage.setItem('webDeviceId', id);
            return id;
          })());

      osVersion = navigator.userAgent;
      brand = 'Web Browser';
      model = navigator.platform ?? 'unknown';
      isDevice = false;
    }
  } catch (e) {
    console.warn('Device info error:', e);
  }

  return {
    id: uniqueId,
    platform: osName,
    osVersion,
    brand,
    model,
    isDevice,
    expoId: Constants.installationId ?? 'none',
  };
}
