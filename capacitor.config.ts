import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.mide.ionic.kuechentimer',
  appName: 'Küchen-Timer',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
