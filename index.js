const express = require('express');

const server = express();

server.use(express.json());

//Query params = ?teste=1
//Route params = /users/1
//Request body = { "name": "Paulo", "email": "contato@paulotx.com.br" }

//req = representa todos os dados da requisição
//res = resposta

const users = ['Paulo', 'Edson', 'Leandro'];
//Middleware de log , faz o log a cada requisição.
//Esse é um middleware global
server.use((req, res, next) => {
    
    console.time('Request'); //Medir o tempo da requisição. Quanto tempo levou...
    console.log(`Método: ${req.method}; URL: ${req.url}`);

    next();

    console.timeEnd('Request');// Mediu até aqui.

});
//Esse middleware é local
function checkUserExists(req, res, next) {

    if (!req.body.name) {

        return res.status(400).json({ error: 'User name is required' });  

    }

    return next();

}
//Esse middleware é local
function checkUserInArray (req, res, next) {

    const user = users[req.params.index];

    if (!user) {

        return res.status(400).json({ error: 'User does not exists' });  

    }

    req.user = user;

    return next();

}

//Mostra todos os usuários
server.get('/users', (req, res) => {

    return res.json(users);

})
//Mostra um usuário.
server.get('/users/:index', checkUserInArray, (req, res) => {

    return res.json(req.user);

});
//Cria um usuário
server.post('/users', checkUserExists, (req, res) => {

    const { name } = req.body;
    users.push(name);
    return res.json(users);    

})
//Edita um usuário.
server.put('/users/:index', checkUserExists, checkUserInArray, (req, res) => {

    const { index } = req.params;
    const { name } = req.body;
    users[index] = name;
    return res.json(users);

})
//Deleta um usuário.    
server.delete('/users/:index', checkUserInArray, (req, res) => {

    const { index } = req.params;
    users.splice(index, 1);
    return res.send();//Só retornará o http code.

})
//Server in port 3000
server.listen(3000);