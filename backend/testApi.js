const API_BASE = 'https://ghumakkad-backend.onrender.com/';
let token = '';
let destinationId = '';
let tripId = '';

const testApi = async () => {
  try {
    console.log('--- STARTING API TESTS ---');

    console.log('\n[1] Testing Auth Signup...');
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test Tester',
          email: `test${Date.now()}@example.com`,
          password: 'password123'
        })
      });
      const data = await res.json();
      console.log('Signup Response:', res.status, data.name);
      token = data.token;
    } catch (e) {
      console.log('Signup Failed:', e.message);
    }

    console.log('\n[2] Testing Get Destinations...');
    try {
      const res = await fetch(`${API_BASE}/destinations`);
      const data = await res.json();
      console.log('Get Destinations Response:', res.status, `Count: ${data.length}`);
      if(data.length > 0) destinationId = data[0]._id;
    } catch (e) {
      console.log('Get Destinations Failed:', e.message);
    }

    console.log('\n[3] Testing Profile Add to Wishlist...');
    try {
      const res = await fetch(`${API_BASE}/user/wishlist/add`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ destinationId })
      });
      if (!res.ok) {
        const text = await res.text();
        console.log('Add Wishlist Error Payload:', text);
      } else {
        const data = await res.json();
        console.log('Add Wishlist Response:', res.status, `Items: ${data.length}`);
      }
    } catch (e) {
      console.log('Add Wishlist Failed:', e.message);
    }

    console.log('\n[4] Testing Create Trip...');
    try {
      const res = await fetch(`${API_BASE}/trip/create`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          destination: destinationId,
          days: 5,
          budget: 1500
        })
      });
      const data = await res.json();
      console.log('Create Trip Response:', res.status, `Days: ${data.days || data.message || 'unknown'}`);
      tripId = data._id;
    } catch (e) {
      console.log('Create Trip Failed:', e.message);
    }

    console.log('\n[5] Testing AI Chat Placeholder...');
    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ prompt: 'Hello!' })
      });
      const data = await res.json();
      console.log('AI Chat Response:', res.status, data.reply);
    } catch (e) {
      console.log('AI Chat Failed:', e.message);
    }

    console.log('\n--- ALL TESTS COMPLETED ---');
  } catch (error) {
    console.error('Fatal Error during execution:', error.message);
  }
};

testApi();
