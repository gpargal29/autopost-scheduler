import API from './api';

export const getSocialAccounts = async () => {
  const response = await API.get('/social-accounts');
  return response.data;
};

export const getConnectedPlatforms = async () => {
  try {
    const data = await getSocialAccounts();
    if (data.success && Array.isArray(data.accounts)) {
      return data.accounts
        .filter((acc) => acc.isConnected)
        .map((acc) => acc.platform);
    }
  } catch (err) {
    console.error('Failed to fetch connected social accounts:', err);
  }
  return [];
};
