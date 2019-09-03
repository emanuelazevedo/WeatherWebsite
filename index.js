const http = require('http');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const os = require('os');
const request = require('request');

//Chamada a API request
const apiCallRequest = (callback, cities) => {
    
    console.log('callback', cities)
    let teste = [];
    let size = cities.length;
    cities.forEach((city, index) => {
        
        console.log('city', city)
        console.log('index', index)
        request('https://api.weatherbit.io/v2.0/current?city='+city+'&key=6accba4c460e4434ba36f3d1a5ac1031', { json: true }, (err, res, body) => {
            if (err) {
                return callback("Erro na chamada "+err);
            }
            const data = body.data;

            dataResult = {
                city: data[0].city_name,
                sunrise: data[0].sunrise,
                sunset: data[0].sunset,
                temp: data[0].temp,
            }
            console.log('dataResultCallback', dataResult)
            // return callback(dataResult);
            teste.push(dataResult);
            console.log('teste', teste)

            //verifica se o array foi todo percorrido
            if((index+1)==size){
                console.log('return', teste)
                return callback(teste);
            }
            
        });
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
            console.log('postBody', postBody)
            var cities = postBody.city;
            //Chamada a API enviando um array com as cidades que pretendo pesquisar
            apiCallRequest(function (response) {
                console.log('response', response)
                res.write(JSON.stringify(response));
                res.end();
            }, cities);
            
        });
        
    
        //Ficheiro de logs(momento, plataforma e cidades)
        function createLog(data){
            let cities = " ";
            let temperatures = " ";
            // console.log('data', data)
            data.forEach(test => {
                // console.log('data', test)
                cities += test.city + " ";
                temperatures += test.temp + "º ";
            });

            fs.appendFile('logs.txt', 
            new Date() + " - " + os.platform + " Searched for:" + cities + "and got temperatures:"+ temperatures + "\n", 
            (err) => {
                if (err) throw "Erro aqui: " + err;
                console.log("Error while creating log");
            });
        }
        
    }
});


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));