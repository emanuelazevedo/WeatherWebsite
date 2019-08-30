const http = require('http');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const os = require('os');

const server = http.createServer((req, res) => {
    if(req.url === '/'){
        fs.readFile(
            path.join(__dirname, 'public', 'index.html'),
            (err, content) => {
                if(err) throw err;
                res.writeHead(200, { 'Content-Type' : 'text/html' });
                res.end(content);
            }
        )
    }

    if (req.url === '/api/weather') {

        var date = new Date();

        //Chamada a API
        axios.get('https://api.weatherbit.io/v2.0/current?city=Aveiro&key=6accba4c460e4434ba36f3d1a5ac1031')
            .then(response => {
                const data = response.data.data;
                res.writeHead(200, { 'Content-Type': 'application/json' });
                // res.end(JSON.stringify(data[0].city_name));
                res.end(JSON.stringify(data[0].city_name));

            })
            .catch(error => {
                console.log("Error:" + error);
            });


        //Ficheiro de logs(momento, plataforma e cidades)
        fs.appendFile('logs.txt', 
        date + " - " + os.platform + " Searched for:" + "\n", 
        (err) => {
            if (err) throw err;
            console.log('The "data to append" was appended to file!');
        });




        // let body = '';
        // req.on('data', chunk => {
        //     body += chunk.toString(); // convert Buffer to string
        // });
        // req.on('end', () => {
        //     console.log(parse(body));
        //     res.end('ok');
        // });
    }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));