import express from 'express'

import usersRoutes from './routes/users'
import nftsRoutes from './routes/nfts'
import collectionsRoutes from './routes/collections'

const app = express()
app.use(express.json())

// schemas:
// user --> address
// collection --> name
// nFT --> tokenId

app.get('/', (req, res) => {
  res.send('Tokenverse Backend')
})

app.use('/users', usersRoutes)
app.use('/nfts', nftsRoutes)
app.use('/collections', collectionsRoutes)

app.listen(5000, () => console.log('Server running at http://localhost:5000'))
