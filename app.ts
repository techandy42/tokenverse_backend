import express from 'express'

import usersRoutes from './routes/users'
import nftsRoutes from './routes/nfts'
import collectionsRoutes from './routes/collections'
import reviewsRoutes from './routes/reviews'
import cors from 'cors'

const app = express()
app.use(express.json())
// Modify at deployment
app.use(
  cors({
    origin: '*',
  }),
)

// schemas:
// user --> address
// collection --> name
// nFT --> tokenId
// reviews --> id

/* Main */
app.get('/', (req, res) => {
  res.send('Tokenverse Backend')
})

/* Routes */
app.use('/users', usersRoutes)
app.use('/nfts', nftsRoutes)
app.use('/collections', collectionsRoutes)
app.use('/reviews', reviewsRoutes)

app.listen(5000, () => console.log('Server running at http://localhost:5000'))
