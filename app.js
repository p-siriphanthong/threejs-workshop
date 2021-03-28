import express from 'express'

const app = express()
const port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.set('views', './views')
app.use('/three', express.static('ThreeJS'))
app.use('/dat.gui', express.static('node_modules/dat.gui'))
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send('ThreeJSDemo')
})

const addPage = (r, t, v = 'preview') => {
  app.get(r, (req, res) => {
    res.render(v, { go_to: t })
  })
}

addPage('/ex1', 'Ex1')
addPage('/ex2', 'Ex2')
addPage('/ex3', 'Ex3')
addPage('/ex4', 'Ex4')
addPage('/ex5', 'Ex5')
addPage('/ex6', 'Ex6')
addPage('/ex6-2', 'Ex6-2')
addPage('/ex7', 'Ex7')
addPage('/ex8', 'Ex8')
addPage('/ex9', 'Ex9')
addPage('/ex10', 'Ex10')
addPage('/ex11', 'Ex11')
addPage('/ex12', 'Ex12')

addPage('/ar-model', 'AR-Model')
addPage('/ar-dino', 'ARDino')
addPage('/vr-dino', 'VRDino')
addPage('/test', 'Test')

addPage('/workshop-1', 'workshop-1')
addPage('/workshop-2', 'workshop-2')
addPage('/workshop-3', 'workshop-3')
addPage('/workshop-4', 'workshop-4')
addPage('/workshop-5', 'workshop-5')
addPage('/workshop-6', 'workshop-6')
addPage('/workshop-7', 'workshop-7')

app.listen(port, () => {
  console.log('Starting server. PORT:' + port)
})
