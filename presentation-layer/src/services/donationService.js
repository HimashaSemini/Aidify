import api from './api';

export const getDonations = async () => {
  const response = await api.get('/donations');
  return response.data;
};

export const createDonation = async (donationData) => {
  const response = await api.post('/donations', donationData);
  return response.data;
};
