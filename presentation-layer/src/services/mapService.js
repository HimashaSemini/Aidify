export const getWarehouses = async () => {
  // Fetch from backend: /api/warehouses
  // Mocked for now
  return [
    { id: 1, name: 'Colombo Warehouse', lat: 6.9271, lng: 79.8612, address: 'Colombo 01' },
    { id: 2, name: 'Kandy Warehouse', lat: 7.2906, lng: 80.6337, address: 'Kandy' },
  ];
};

export const getDonations = async () => {
  // Fetch from backend: /api/donations
  // Mocked for now
  return [
    { id: 1, donorName: 'John Doe', itemName: 'Clothes', status: 'Pending', lat: 6.9147, lng: 79.9737 },
    { id: 2, donorName: 'Jane Smith', itemName: 'Books', status: 'Delivered', lat: 7.2906, lng: 80.6337 },
  ];
};
