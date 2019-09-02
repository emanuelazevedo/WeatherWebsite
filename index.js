const http = require('http');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const os = require('os');
const request = require('request');

//Chamada a API request
const apiCallRequest = (callback, city) => {
    request('https://api.weatherbit.io/v2.0/current?city='+city+'&key=6accba4c460e4434ba36f3d1a5ac1031', { json: true }, (err, res, body) => {
        if (err) {
            return callback(err);
        }
        const data = body.data;
        console.log('callback', callback)
        dataResult = {
            city: data[0].city_name,
            sunrise: data[0].sunrise,
            sunset: data[0].sunset,
            temp: data[0].temp,
        }
        console.log('dataResultCallback', dataResult)
        return callback(dataResult);
    });
}

const server = http.createServer((req, res) => {
    if(req.url === '/'){
        fs.readFile(
            path.join(__dirname, 'public', 'index.html'),
            (err, content) => {
                if(err) throw "Erro na pagina web: " + err;
                res.writeHead(200, { 'Content-Type' : 'text/html' });
                res.end(content);
            }
        )
    }

    if (req.url === '/api/weather' && req.method === 'POST') {

        let body = '';
        
        //receber os dados do POST
        req.on('data', function (chunk) {
            body += chunk;
        });

        req.on('end', function () {

            postBody = JSON.parse(body);
            console.log('postBody', postBody.city1)
            var city1 = postBody.city1;
            apiCallRequest(function (response) {
                //console.log(JSON.stringify(response));
                res.write(JSON.stringify(response));
                res.end();
            }, city1);
            
        });
        
    

        //Chamada a API axios
        function apiCall(city){
        axios.get('https://api.weatherbit.io/v2.0/current?city='+city+'&key=6accba4c460e4434ba36f3d1a5ac1031')
            .then(response => {
                const data = response.data.data;
                // res.writeHead(200, { 'Content-Type': 'application/json' });
                
                
                dataResult = {
                    city: data[0].city_name,
                    sunrise: data[0].sunrise,
                    sunset: data[0].sunset,
                    temp: data[0].temp,
                }
                console.log('return', JSON.stringify(dataResult))
                return JSON.stringify(dataResult);

            })
            .catch(error => {
                console.log("Error:" + error);
            });
        }

        // function dummy(city) {
        //     dataResult = {
        //         city: city,
        //         sunrise: "08:30",
        //         sunset: "18:30",
        //         temp: "13",
        //     }
        //     return dataResult;
        // }

        // //Ficheiro de logs(momento, plataforma e cidades)
        // function createLog(data){
        //     let cities = " ";
        //     let temperatures = " ";
        //     // console.log('data', data)
        //     data.forEach(test => {
        //         // console.log('data', test)
        //         cities += test.city + " ";
        //         temperatures += test.temp + "º ";
        //     });

        //     fs.appendFile('logs.txt', 
        //     new Date() + " - " + os.platform + " Searched for:" + cities + "and got temperatures:"+ temperatures + "\n", 
        //     (err) => {
        //         if (err) throw "Erro aqui: " + err;
        //         console.log("Error while creating log");
        //     });
        // }
        
    }
});


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));