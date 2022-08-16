//importin packages
const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const axios = require('axios');


//constants
const appid = "f1ec8910be37f5f35898902c0268f95e"
const units = "metric";
const baseURL = "https://api.openweathermap.org/data/2.5/weather?q=";
const port = process.env.PORT || 8000;


//creating server
const app = express();

app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.sendFile(__dirname+"/index.html")
})

app.post('/home',(req,res) => {

    console.log(req.body.cityNames);
    let city_names = req.body.cityNames;
    if(!Array.isArray(city_names)) city_names = [city_names]
    let url_list = [];
    city_names.forEach((city_name)=>{
        
        const url = baseURL+ city_name +"&appid="+ appid +"&units="+units;
        url_list.push(url);
          
    })
    let axios_get_array = [];
    url_list.forEach((URL)=>{
      axios_get_array.push(axios.get(URL));
    })

    axios
    .all(axios_get_array)
    .then(
      axios.spread((...responses) => {
        let result = "";
        responses.forEach((resp)=>{
            console.log(resp.data);
            result += "<h1>The temprature in "+ resp.data.name +" is " +resp.data.main.temp +"C. <h1>"
        })
        res.send(result);
      })
    )
    .catch(errors => {
      console.error(errors);
    });    

    
})

app.listen(port, () => {
    console.log(`app is running at ${port}....`);
});
