import * as Application from 'expo-application';
import Constants from 'expo-constants';

// You would need to install a UUID library: npm install uuid
// Then configure it for Expo web, or simply use a simple custom generator if preferred.
import { v4 as uuidv4 } from 'uuid'; 

// Use this variable name for localStorage for web
const WEB_STORAGE_KEY = 'my_app_unique_web_id';

export async function getDeviceId() {
  // 1. Check if running in a browser environment (Web)
  if (Constants.platform.web) {
    let webId = localStorage.getItem(WEB_STORAGE_KEY);
    if (!webId) {
      // Generate and store a new UUID if one doesn't exist
      webId = uuidv4(); 
      localStorage.setItem(WEB_STORAGE_KEY, webId);
    }
    return webId;
  }
  
  // 2. Check if running on a native mobile app
  if (Constants.platform.ios) {
    // Returns the installation ID for Android/iOS
    const installationId = await Application.getIosIdForVendorAsync();
    return installationId;
  }
  if (Constants.platform.android) {
    // Returns the installation ID for Android/iOS
    const installationId = await Application.getAndroidId();
    return installationId;
  }

  // Fallback for any unexpected environment
  return 'unknown_device_id';
}