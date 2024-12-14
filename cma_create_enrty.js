//const baseUrl = 'https://api.contentstack.io/v3/content_types/{{content_type_uid}}/entries?locale={{locale}}';
//const apiKey = '{{api_key}}';
//const managementToken = '{{management_token}}';
const config = {
    baseUrl: 'https://api.contentstack.io/v3/content_types/workflow_update/entries?', // Add base url for cda based on the cs instance  
    headers: {
      'api_key': 'bltd3b768d12a0534d5', // add stack API key 
      'authorization': 'csed1f87972997f07dd43e7e77', // add delivery token
    },
    params: {
        //init: true,
        //environment: 'environment', // Replace with your environment name
        //content_type_uid: 'workflow_update', // Replace with your content type UID
        //locale: 'en-us', // Replace with your locale code
        //start_from: '{iso_date}', // Replace with your ISO date
        //type: 'entry_published', // Replace with the desired type
      },
    };
    

const postData = {
  entry: {
    title: "example2",
    //url: "/example2"
  }
};

async function createData() {
  try {
    const response = await fetch(config.baseUrl, {
      method: 'POST',
      headers: {
        'api_key': config.headers.api_key,
        'authorization': config.headers.authorization,
        
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      // Handle errors based on the response status
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Success:', result);
  } catch (error) {
    // Logs any error occurred during the fetch request
    console.error('Error:', error);
  }
}

createData();
