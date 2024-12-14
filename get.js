const { default: axios } = require("axios");

const baseUrl = '';
const api_key = '';
const authorization = '';

const postData ={
    entry: {
        title: '',
        field_name: ''

    }
}
 
async function data() {

    try {
        const response = await axios.post(baseUrl, postData){
            header {
                api_key= api_key,
                authorization= authorization,
            }

            console.log(success)
        }
        
    } catch (error) {
        error(stats, error)
    }
}


