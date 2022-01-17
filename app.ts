import { PrismaClient } from '@prisma/client'
import express, { NextFunction, Request, Response } from 'express'

import { body, validationResult } from 'express-validator'

const prisma = new PrismaClient()

const app = express()
app.use(express.json())

app.get('/users/:address', async (req: Request, res: Response) => {
  const address = req.params.address
  try {
    const user = await prisma.users.findUnique({
      where: { address },
      select: {
        userName: true,
        companyName: true,
        email: true,
        createdAt: true,     
        description: true,   
        image: true,
        facebookLink: true,  
        instagramLink: true, 
        linkedInLink: true,  
        mainLink: true,      
        twitterLink: true,   
        collections: {
            select: {
                name: true,
                nfts: {
                    select: {
                      tokenId: true
                    }
                }      
            }
        },
      }
    })
    return res.json(user)
  } catch (error) {
    console.log(error)
    return res.status(404).json({ error: 'User not found' })
  }
})

app.put('/users/:address', async (req: Request, res: Response) => {
  const address = req.params.address
  const {
    image,
    userName,
    companyName,
    description,
    email,
    mainLink,
    facebookLink,
    instagramLink,
    twitterLink,
    linkedInLink,
  } = req.body
  try {
    let user = await prisma.users.findUnique({ where: { address } })
    if (!user) throw { user: `Cannot find the user: ${address}` }
    user = await prisma.users.update({
      where: { address },
      data: {
        image,
        userName,
        companyName,
        description,
        email,
        mainLink,
        facebookLink,
        instagramLink,
        twitterLink,
        linkedInLink,
      },
    })
    return res.json(user)
  } catch (error) {
    console.log(error)
    return res.status(404).json({ error: 'User not found' })
  }
})

app.post('/nfts', async (req: Request, res: Response) => {
  const {
    address,
    nftName,
    collectionName,
    blockchainType,
    fileUrl,
    multimediaFile,
    tokenId,
  } = req.body
  try {
    // create user if user doesn't exist
    let fetchedUser = await prisma.users.findUnique({ where: { address } })
    if (!fetchedUser) {
      fetchedUser = await prisma.users.create({
        data: { address, userName: address },
      })
    }
    // create collection if collection doesn't exist
    let fetchedCollection = await prisma.collections.findUnique({
      where: { collectionName },
    })
    if (!fetchedCollection) {
      fetchedCollection = await prisma.collections.create({
        data: { collectionName },
        user: { connect: { address } },
      })
    }
    const nft = await prisma.nfts.create({ data: {
            creator: address,
            name: nftName,
            blockchainType,
            fileUrl,
            multimediaFile,
            tokenId,
        }, 
        user: { connect: { address } } }, 
        collection: { connect: { name: collectionName } 
    })
    return res.json(nft)
  } catch (error) {
    console.log(error)
  }
})

app.put('/nfts/:tokenId', async (req: Request, res: Response) => {
    const tokenId = req.params.tokenId
    // put in the necessary fields for updating a NFT
    const {} = req.body
    try {
      let nft = await prisma.nfts.findUnique({ where: { tokenId } })
      if (!nft) throw { error: `Cannot find the NFT: ${tokenId}` }
      nft = await prisma.nfts.update({
        where: { tokenId },
        // change relationship with collection if needed
        // put in the necessary fields for updating a NFT
        data: {},
      })
      return res.json(nft)
    } catch (error) {
        console.log(error)
        return res
        .status(404)
        .json({ error: `Error on updating nft: ${tokenId}` })
    }
})

app.delete('/collections/:tokenId', async (req: Request, res: Response) => {
  const tokenId = req.params.tokenId
  try {
    await prisma.nfts.delete({
      where: { tokenId },
    })
    return res.json({ message: `Deleted the NFT: ${tokenId}` })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: `Error in the server while deleting NFT: ${tokenId}`,
    })
  }
})

// add in buying and selling NFTs
app.put('/nfts/transfer/:tokenId', async (req: Request, res: Response) => {
    const tokenId = req.params.tokenId
    const { sellerAddress, buyerAddress } = req.body
    try {
      let nft = await prisma.nfts.findUnique({ where: { tokenId } })
      if (!nft) throw { error: `Cannot find the NFT: ${tokenId}` }
      nft = await prisma.nfts.update({
        where: { tokenId },
        data: {},
      })
      return res.json(nft)
    } catch (error) {
        console.log(error)
        return res
        .status(404)
        .json({ error: `Error on updating nft: ${tokenId}` })
    }
})

app.get('/collections/:name', async (req: Request, res: Response) => {
  const name = req.params.name
  try {
    const collection = await prisma.collections.findUnique({
      where: { name },
      select: {
          name: true,
          nfts: {
            select: {
              tokenId: true,
            }
          }
      }
    })
    return res.json(collection)
  } catch (error) {
    console.log(error)
    return res.status(404).json({ user: 'User not found' })
  }
})

app.get('/collections/last-id', async (req: Request, res: Response) => {
  try {
    const lastId = await prisma.collections.findMany({
      orderBy: { id: 'desc' },
      take: 1,
      select: {
        id: true
      }
    })
    return res.json(lastId)
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error:
        'Error in the server while searching for the last id of the collections',
    })
  }
})

app.put('/collections/:name', async (req: Request, res: Response) => {
  const name = req.params.name
  const { newName } = req.body
  try {
    let collection = await prisma.collections.findUnique({ where: { name } })
    if (!collection) throw { error: `Cannot find the collection: ${name}` }
    collection = await prisma.collections.update({
      where: { name },
      data: {
        name: newName,
      },
    })
    return res.json(collection)
  } catch (error) {
    console.log(error)
    return res
      .status(404)
      .json({ error: `Error on updating collection: ${name}` })
  }
})

app.delete('/collections/:name', async (req: Request, res: Response) => {
  const name = req.params.name
  try {
    await prisma.collections.delete({
      where: { name },
    })
    return res.json({ message: `Deleted the collection: ${name}` })
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ error: `Error in the server while deleting collection: ${name}` })
  }
})

app.listen(5000, () => console.log('Server running at http://localhost:5000'))
