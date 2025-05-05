const axios = require('axios');

const testLogin = async () => {
  try {
    const response = await axios.post('http://localhost:3001/api/admin/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });
    console.log('Login Response:', response.data);
  } catch (error) {
    console.error('Error during login:', error.response.data);
  }
};

testLogin();
