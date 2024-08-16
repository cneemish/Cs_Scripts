const axios = require('axios');
const fs = require('fs');
const json2xls = require('json2xls'); // Assuming you're using json2xls for Excel export
const path = require('path'); 
const outputDirectory = './output'; // Creates a directory named 'output' in the same folder as your script
fs.mkdirSync(outputDirectory, { recursive: true }); // 'recursive: true' allows creating nested directories if needed
const filePath = path.join(outputDirectory, 'contentstack_data_prod.xlsx');


const config = {
    baseUrl: '{contentstack cdn base url}', // Add base url for cda based on the cs instance  
    headers: {
      'api_key': 'stack api key', // add stack API key 
      'access_token': 'delivery token', // add delivery token
    },

 params: {
    init: true,
    environment: 'environment', // Replace with your environment name
    content_type_uid: 'content type UID', // Replace with your content type UID
    // locale: '{locale_code}', // Replace with your locale code
    //start_from: '{iso_date}', // Replace with your ISO date
    type: 'entry_published', // Replace with the desired type
  },
};

async function fetchDataAndExport() {
    let allData = [];
    let nextPageToken = null;
  
do {
       if (nextPageToken) {
         config.params.pagination_token = nextPageToken;
          delete config.params.init; 
       } else if (config.params.sync_token) { // Check for sync_token
         delete config.params.init; 
        }
    
   // do {
     // if (nextPageToken) {
       // config.params.pagination_token = nextPageToken; 
        //delete config.params.init; //deletes the init
      //} 
  
      try {
        const response = await axios.get(config.baseUrl, {
          headers: config.headers,
          params: config.params,
        });
  
        allData = allData.concat(response.data.items); 
        nextPageToken = response.data.pagination_token;
  
       // if (response.data.sync_token) { // Check for sync_token and break if found
         // console.log('Sync token received. Stopping the process.');
         // break;
       // }
  
      } catch (error) {
        console.error('Error fetching data:', error);
        break; 
      }
    } while (nextPageToken); 

  const xls = json2xls(allData);
  fs.writeFileSync('contentstack_data_prod.xlsx', xls, 'binary');
  console.log('Data exported to', filePath); 
}

fetchDataAndExport();