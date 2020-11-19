const express = require('express')

const mongoose = require('mongoose')

const PORT = 3333

const app = express()

//Middlaware:  fazer aplicação entender json
app.use(express.json())

// Conectando com banco de dados
mongoose.connect('mongodb+srv://todo:todo@cluster0.p8rn3.mongodb.net/todo?retryWrites=true&w=majority', {
   useUnifiedTopology: true,
   useNewUrlParser: true
}, () => console.log('Connected to database'))

// Definindo schemas
const UserSchema = new mongoose.Schema({username: String})
const User = mongoose.model('User', UserSchema)

const TodoSchema = new mongoose.Schema({description: String, done: Boolean, user: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'User'
} })

const Todo = mongoose.model('Todo', TodoSchema)

// Definindo as rotas
// Criando a primeira rota
app.get('/', (req, res) => {console.log('hello world!')})

// Logar usuário
app.post('/session', async(req, res) => {
   const {username} = req.body
   let user = ''
   try {
      const user = User.findOne({username})
      console.log('Achou ',user)
      // Se user não existir
      if(!user){
         user = await User.create({username})
         console.log('Criou ',user)
      }
      return res.status(200).send(user)
   } catch(err) {
      return res.status(400).send(err)
   }
})

// Criar todo POST
app.post('/todo/:user_id', async (req, res) => {
   const {description, done} = req.body
   const {user_id} = req.params
   try {
      const newTodo = await Todo.create({description, done, user: user_id})
      return res.status(200).send(newTodo)
   } catch (error) {
      return res.status(4000).send(error)
   }
})

// Listar todo GET

// Atualizar todo PATCH / PUT
// Deletar todo DELETE

// Rodando o projeto
app.listen(PORT, () => console.log(`server running on port ${PORT}`))
