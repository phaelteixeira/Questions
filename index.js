const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const connection = require('./database/database')
const Pergunta = require('./database/Pergunta')
const Resposta = require('./database/Resposta')

//Estabelecendo conexao com o Banco de Dados
connection
    .authenticate()
    .then(() => {
        console.log('Conexão estabelecida com sucesso.')
    })
    .catch((err) => {
        console.log(err)
    })

app.set('view engine','ejs')
app.use(express.static('Public'))

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.get('/',(req,res) => {
    Pergunta.findAll( {raw : true, order:[['id','DESC']]} ).then(perguntas => {
        res.render('index',{perguntas: perguntas})
    })
})

app.get('/perguntar',(req,res) => {
    res.render('perguntar')
})

app.post('/salvarpergunta',(req,res) => { 
    let titulo = req.body.titulo
    let descricao = req.body.descricao

    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect('/')
    })
})

app.get('/pergunta/:id',(req,res) => {
    let id = req.params.id

    Pergunta.findOne({
        where: { id : id}
    }).then(perguntas => {

        Resposta.findAll({
            where: { perguntaId : perguntas.id },
            order : [['id','DESC']]
        }).then(respostas => {
            if (perguntas != undefined){
                res.render('pergunta',{
                    pergunta : perguntas,
                    resposta : respostas
                })
            } else { 
                res.redirect('/')
            }
        })
    })
})

app.post('/responder', (req,res) => {
    let corpo = req.body.corpo
    let perguntaId = req.body.perguntaId

    Resposta.create({
        corpo : corpo,
        perguntaId : perguntaId
    }).then(() => {
        res.redirect('/pergunta/' + perguntaId)
    })
    
})

app.listen(8080, () => {
    console.log('Server is running')
})