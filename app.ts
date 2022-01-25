import { PrismaClient } from '@prisma/client'
import express, { NextFunction, Request, Response } from 'express'

import { body, validationResult } from 'express-validator'

const prisma = new PrismaClient()

const app = express()
app.use(express.json())

// ToDos:
// create all the functions
// validate data
// check the functions with Postman
// refractor the code

// schemas:
// user --> address
// collection --> name
// nFT --> tokenId

// const userValidationRules = [
//   body('image').isJSON().withMessage('image must be a JSON'),
//   body('userName').isLength({ min: 1 }).withMessage('userName must not be empty'),
//   body('companyName').isString().withMessage('companyName must be a string'),
//   body('description').isString().withMessage('description must be a string'),
//   body('email').isString().withMessage('email must be a string'),
//   body('mainLink').isString().withMessage('mainLink must be a string'),
//   body('facebookLink').isString().withMessage('facebookLink must be a string'),
//   body('instagramLink').isString().withMessage('instagramLink must be a string'),
//   body('twitterLink').isString().withMessage('twitterLink must be a string'),
//   body('linkedInLink').isString().withMessage('linkedInLink must be a string'),
//   body('role')
//     .isIn(['ADMIN', 'USER', 'SUPERADMIN', undefined])
//     .withMessage(`Role must be one of 'ADMIN', 'USER', 'SUPERADMIN'`),
// ]

// const nftValidationRules = [

// ]

// const collectionValidationRules = [
//   body('name').isLength({ min: 1 }).withMessage('Name must not be empty')
// ]

// const simpleVadationResult = validationResult.withDefaults({
//   formatter: (err) => err.msg,
// })

// const checkForErrors = (req: Request, res: Response, next: NextFunction) => {
//   const errors = simpleVadationResult(req)
//   if (!errors.isEmpty()) {
//     return res.status(400).json(errors.mapped())
//   }
//   next()
// }

app.get('/', (req, res) => {
  res.send('Tokenverse Backend')
})

app.post('/users', async (req: Request, res: Response) => {
  const { address } = req.body
  try {
    const user = await prisma.user.create({
      data: {
        address,
        userName: address,
      },
    })
    return res.json(user)
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ error: `Error in the server while creating user ${address}` })
  }
})

app.get('/users/:address', async (req: Request, res: Response) => {
  const address = req.params.address
  try {
    const user = await prisma.user.findUnique({
      where: { address },
      select: {
        role: true,
        address: true,
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
        verified: true,
        verificationDate: true,
        verificationLink: true,
        collections: {
          select: {
            name: true,
          },
        },
        nfts: {
          select: {
            tokenId: true,
            itemId: true,
            reviews: true,
          },
        },
        // may contain a bug
        // @ts-ignore
        nftslease: {
          select: {
            tokenId: true,
            itemId: true,
          },
        },
        //
      },
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
    let user = await prisma.user.findUnique({ where: { address } })
    if (!user) throw { error: `Cannot find the user: ${address}` }
    const data =
      JSON.parse(image) === null
        ? {
            userName,
            companyName,
            description,
            email,
            mainLink,
            facebookLink,
            instagramLink,
            twitterLink,
            linkedInLink,
          }
        : {
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
          }
    user = await prisma.user.update({
      where: { address },
      data: data,
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
    name,
    blockchainType,
    fileUrl,
    multimediaFile,
    tokenId,
    itemId,
    collection,
    ercType,
  } = req.body
  const multimediaFileTypeChecked =
    multimediaFile === null ? undefined : multimediaFile
  try {
    const data = {
      multimediaFile: multimediaFileTypeChecked,
      name,
      blockchainType,
      fileUrl,
      tokenId,
      itemId,
      collection,
      creator: address,
      user: address,
      ercType,
      usersRefunded: new Array(),
    }
    const nft = await prisma.nFT.create({
      data: {
        ...data,
        user: { connect: { address } },
        borrower: { connect: { address } },
        collection: { connect: { name: collection } },
      },
    })
    return res.json(nft)
  } catch (error) {
    console.log(error)
    return res
      .status(404)
      .json({ error: `Error while creating the token ${tokenId}` })
  }
})

// edit
// on-market
// off-market

app.put('/nfts/edit/:tokenId', async (req: Request, res: Response) => {
  let tokenId: string | number = req.params.tokenId
  tokenId = parseInt(tokenId)
  const {
    name,
    fileUrl,
    multimediaFile,
    isMetadataFrozen,
    collection,
    saleType,
    collectibleCategory,
    productKeyRealLifeAssetCategory,
    productKeyVirtualAssetCategory,
    isSensitiveContent,
    properties,
  } = req.body
  try {
    const multimediaFileTypeChecked =
      multimediaFile === null ? undefined : multimediaFile
    const propertiesTypeChecked = properties === null ? undefined : properties
    const data = {
      name,
      fileUrl,
      multimediaFile: multimediaFileTypeChecked,
      isMetadataFrozen,
      saleType,
      collectibleCategory,
      productKeyRealLifeAssetCategory,
      productKeyVirtualAssetCategory,
      isSensitiveContent,
      properties: propertiesTypeChecked,
    }
    let nft = await prisma.nFT.findUnique({ where: { tokenId } })
    if (nft?.isMetadataFrozen)
      throw { error: `NFT with tokenId ${tokenId} has its metadata frozen` }
    // // delete the old NFT
    // await prisma.nFT.delete({ where: { tokenId } })
    // // create a new NFT with modified data
    // const newNft = await prisma.nFT.create({
    //   data: {
    //     ...data,
    //     user: { connect: { nft?.address } },
    //     borrower: { connect: { nft?.address } },
    //     collection: { connect: { name: collection } },
    //   },
    // })
    res.json(newNft)
  } catch (error) {
    console.log(error)
    return res
      .status(404)
      .json({ error: `Error while updating the token ${tokenId}` })
  }
})

// app.put('/nfts/:tokenId', async (req: Request, res: Response) => {
//     const tokenId = req.params.tokenId
//     // put in the necessary fields for updating a NFT
//     const {} = req.body
//     try {
//       let nft = await prisma.nfts.findUnique({ where: { tokenId } })
//       if (!nft) throw { error: `Cannot find the NFT: ${tokenId}` }
//       nft = await prisma.nfts.update({
//         where: { tokenId },
//         // change relationship with collection if needed
//         // put in the necessary fields for updating a NFT
//         data: {},
//       })
//       return res.json(nft)
//     } catch (error) {
//         console.log(error)
//         return res
//         .status(404)
//         .json({ error: `Error on updating nft: ${tokenId}` })
//     }
// })

app.delete('/nfts/:tokenId', async (req: Request, res: Response) => {
  let tokenId: string | number = req.params.tokenId
  tokenId = parseInt(tokenId)
  try {
    let nft = await prisma.nFT.findUnique({ where: { tokenId } })
    if (nft?.isMetadataFrozen)
      throw { error: `NFT with tokenId ${tokenId} has its metadata frozen` }
    await prisma.nFT.delete({
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

// // validate fields
// app.put('/nfts/transfer/:tokenId', async (req: Request, res: Response) => {
//     const tokenId = req.params.tokenId
//     const { sellerAddress, buyerAddress } = req.body
//     try {
//       let nft = await prisma.nfts.findUnique({ where: { tokenId } })
//       if (!nft) throw { error: `Cannot find the NFT: ${tokenId}` }
//       nft = await prisma.nfts.update({
//         where: { tokenId },
//         data: {},
//       })
//       return res.json(nft)
//     } catch (error) {
//         console.log(error)
//         return res
//         .status(404)
//         .json({ error: `Error on updating nft: ${tokenId}` })
//     }
// })

app.post('/collections/:address', async (req: Request, res: Response) => {
  const address = req.params.address
  try {
    const lastId = await prisma.collection.findMany({
      orderBy: { id: 'desc' },
      take: 1,
      select: {
        id: true,
      },
    })
    const collectionId = lastId[0] ? lastId[0].id + 1 : 1
    //modify
    let name = `collection-${collectionId}`
    // checks if there exists a collection
    let collection = await prisma.collection.findUnique({
      where: { name },
    })
    // creates the collection with the name `collection#${lastId}`
    if (!collection) {
      collection = await prisma.collection.create({
        data: { name, user: { connect: { address } } },
      })
    }
    return res.json(collection)
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error:
        'Error in the server while searching for the last id of the collections',
    })
  }
})

app.get('/collections/:name', async (req: Request, res: Response) => {
  const name = req.params.name
  try {
    const collection = await prisma.collection.findUnique({
      where: { name },
      select: {
        name: true,
        user: {
          select: {
            userName: true,
            companyName: true,
            description: true,
            address: true,
            verified: true,
          },
        },
        nfts: {
          select: {
            tokenId: true,
            itemId: true,
            reviews: true,
          },
        },
      },
    })
    return res.json(collection)
  } catch (error) {
    console.log(error)
    return res.status(404).json({ user: 'User not found' })
  }
})

app.put('/collections/:name', async (req: Request, res: Response) => {
  const name = req.params.name
  const { newName } = req.body
  try {
    let collection = await prisma.collection.findUnique({ where: { name } })
    let existingNewNamedCollection = await prisma.collection.findUnique({
      where: { name: newName },
    })
    if (!collection) throw { error: `Cannot find the collection: ${name}` }
    if (existingNewNamedCollection)
      throw { error: `Collection with the name ${newName} already exists` }
    collection = await prisma.collection.update({
      where: { name },
      data: {
        name: newName,
      },
    })
    console.log(collection)
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
    await prisma.collection.delete({
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

/* Functions used for testing purposes */

app.get('/nfts', async (req: Request, res: Response) => {
  try {
    const nfts = await prisma.nFT.findMany({})
    res.json(nfts)
  } catch (error) {
    console.log(error)
    res.status(404).json({ error: 'Error occurred while fetching NFTs' })
  }
})

app.get('/nfts/:tokenId', async (req: Request, res: Response) => {
  let tokenId: string | number = req.params.tokenId
  tokenId = parseInt(tokenId)
  try {
    const nft = await prisma.nFT.findUnique({
      where: { tokenId },
    })
    res.json(nft)
  } catch (error) {
    console.log(error)
    res
      .status(404)
      .json({ error: `Error occurred while fetching NFT: ${tokenId}` })
  }
})

app.get('/collections', async (req: Request, res: Response) => {
  try {
    const collections = await prisma.collection.findMany({
      select: {
        name: true,
        user: {
          select: {
            userName: true,
            companyName: true,
            description: true,
            address: true,
            verified: true,
          },
        },
        nfts: {
          select: {
            tokenId: true,
            itemId: true,
            reviews: true,
          },
        },
      },
    })
    res.json(collections)
  } catch (error) {
    console.log(error)
    res.status(404).json({ error: 'Error occurred while fetching collections' })
  }
})

app.listen(5000, () => console.log('Server running at http://localhost:5000'))
