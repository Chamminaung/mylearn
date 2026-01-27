import { registerDevice } from '@/api/apiCalls';
import HomeScreen from '@/screens/HomeScreen';
import { getDeviceInfo } from '@/utils/deviceInfo';
import * as Application from 'expo-application';
import { useEffect } from 'react';


export default function Index() {

  const appVersion =
      Application.nativeApplicationVersion || "1.0.0";
  useEffect(() => {
    const register = async () => {
      const deviceInfo = await getDeviceInfo();
      await registerDevice(deviceInfo.id, deviceInfo.platform, appVersion);
    };
    register();
  }, []);

  return (
    <HomeScreen />
  );
}
