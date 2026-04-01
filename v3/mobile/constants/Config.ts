import Constants from 'expo-constants';

const DEV_API_URL = 'http://10.0.2.2:3000'; // Change to your local IP if using physical device
const PROD_API_URL = 'https://swalf-api.onrender.com'; // Actual production URL

const getEnvVars = () => {
  if (__DEV__) {
    return {
      apiUrl: DEV_API_URL,
      socketUrl: `${DEV_API_URL}/chat`,
    };
  } else {
    return {
      apiUrl: PROD_API_URL,
      socketUrl: `${PROD_API_URL}/chat`,
    };
  }
};

export default getEnvVars();
