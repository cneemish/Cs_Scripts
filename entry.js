

const axios = require('axios');
  
const baseUrl = 'https://api.contentstack.io/v3/content_types/workflow_update/entries?locale=en-us';
const apiKey = 'bltd3b768d12a0534d5';
const authorization = 'csed1f87972997f07dd43e7e77';

const postData = {
  entry: {
    title: "example2"  }
};

async function createData() {
    try {
      const response = await axios.post(baseUrl, postData, {
        headers: {
          'api_key': apiKey,
          'authorization': authorization,
          'Content-Type': 'application/json',
        }
      });
      console.log('Success:', response.data);
    } catch (error) {
      if (error.response) {
        console.error('Error:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error:', error.message);
      }
    }
  }
  
  createData();
