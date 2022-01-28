import { PrismaClient } from '@prisma/client'
import express, { Request, Response } from 'express'
import {
  selectionUser,
  selectionCollection,
  selectionNFT,
} from '../constants/selections'

const prisma = new PrismaClient()
const router = express.Router()

router.post('/:address', async (req: Request, res: Response) => {
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
    let name = `collection-${collectionId}`
    // checks if there exists a collection
    let collection = await prisma.collection.findUnique({
      where: { name },
    })
    // creates the collection with the name `collection#${lastId}`
    if (!collection) {
      collection = await prisma.collection.create({
        data: {
          name,
          user: { connect: { address } },
        },
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

router.get('/:name', async (req: Request, res: Response) => {
  const name = req.params.name
  try {
    const collection = await prisma.collection.findUnique({
      where: { name },
      select: {
        ...selectionCollection,
        user: {
          select: {
            ...selectionUser,
          },
        },
        nfts: {
          select: {
            ...selectionNFT,
          },
        },
      },
    })
    return res.json(collection)
  } catch (error) {
    console.log(error)
    return res
      .status(400)
      .json({ error: `No collection with the name ${name} is found` })
  }
})

router.put('/change-name/:name', async (req: Request, res: Response) => {
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
      .status(400)
      .json({ error: `Error on updating collection: ${name}` })
  }
})

router.put('/change-info/:name', async (req: Request, res: Response) => {
  const name = req.params.name
  const { newName, image, description } = req.body
  const data =
    image === null
      ? { name: newName, description }
      : { name: newName, description, image }
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
      data: data,
    })
    return res.json(collection)
  } catch (error) {
    console.log(error)
    return res
      .status(400)
      .json({ error: `Error on updating collection: ${name}` })
  }
})

router.delete('/:name', async (req: Request, res: Response) => {
  const name = req.params.name
  try {
    let collection = await prisma.collection.findUnique({
      where: { name },
      select: {
        nfts: {
          select: {
            tokenId: true,
          },
        },
      },
    })
    if (!collection) throw { error: `Collection ${name} does not exists` }
    if (collection?.nfts.length > 0)
      throw {
        error: `Collection ${name} contains one or more NFTs, the collection must be empty in order it to be deleted`,
      }
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

router.get('/', async (req: Request, res: Response) => {
  try {
    const collections = await prisma.collection.findMany({
      select: {
        ...selectionCollection,
        user: {
          select: {
            ...selectionUser,
          },
        },
        nfts: {
          select: {
            ...selectionNFT,
            borrower: {
              select: {
                ...selectionUser,
              },
            },
          },
        },
      },
    })
    res.json(collections)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'Error occurred while fetching collections' })
  }
})

export default router
