const axios = require('axios');

const FLASK_API_URL = 'https://python-flask-zlw4.onrender.com'; // même valeur que ton env

async function testCall() {
  try {
    const res = await axios.get(`${FLASK_API_URL}/recommander`, {
      params: { user_id: '67f1791bd4b37eec7256fe0a' },
    });
    console.log(res.data);
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
  }
}

testCall();
