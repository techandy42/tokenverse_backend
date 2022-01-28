import { PrismaClient } from '@prisma/client'
import express, { Request, Response } from 'express'
import {
  selectionUser,
  selectionCollection,
  selectionNFT,
} from '../constants/selections'
import {
  nftPostValidationRules,
  nftPutSaleValidationRules,
  checkForErrors,
  isUrlValid,
} from '../functions/validations'

const prisma = new PrismaClient()
const router = express.Router()

router.post(
  '/',
  nftPostValidationRules,
  checkForErrors,
  async (req: Request, res: Response) => {
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
      const fileUrlValidity =
        fileUrl === '' || isUrlValid(fileUrl) ? true : false
      if (!fileUrlValidity) throw { error: 'Invalid fileUrl' }
      const data = {
        multimediaFile: multimediaFileTypeChecked,
        name,
        blockchainType,
        fileUrl,
        tokenId: parseInt(tokenId),
        itemId: parseInt(itemId),
        collection,
        ercType,
        like: new Array(),
      }
      const nft = await prisma.nFT.create({
        data: {
          ...data,
          user: { connect: { address } },
          borrower: { connect: { address } },
          creator: { connect: { address } },
          collection: { connect: { name: collection } },
        },
      })
      return res.json(nft)
    } catch (error) {
      console.log(error)
      return res
        .status(400)
        .json({ error: `Error while creating the token ${tokenId}` })
    }
  },
)

router.put('/on-market/:tokenId', async (req: Request, res: Response) => {
  let tokenId: string | number = req.params.tokenId
  tokenId = parseInt(tokenId)
  const {
    price,
    isMetadataFrozen,
    startSaleDate,
    endSaleDate,
    saleType,
    collectibleCategory,
    productKeyRealLifeAssetCategory,
    productKeyVirtualAssetCategory,
    isSensitiveContent,
    properties,
    leasePrice,
  } = req.body
  const propertiesTypeChecked = properties === null ? undefined : properties
  try {
    let nft = await prisma.nFT.findUnique({
      where: { tokenId },
    })
    const data = !nft?.isMetadataFrozen
      ? {
          price: parseInt(price),
          isOnMarket: true,
          isMetadataFrozen,
          startSaleDate,
          endSaleDate,
          saleType,
          collectibleCategory,
          productKeyRealLifeAssetCategory,
          productKeyVirtualAssetCategory,
          isSensitiveContent,
          properties: propertiesTypeChecked,
          leasePrice: parseInt(leasePrice),
        }
      : {
          price: parseInt(price),
          isOnMarket: true,
          startSaleDate,
          endSaleDate,
          saleType,
          collectibleCategory,
          productKeyRealLifeAssetCategory,
          productKeyVirtualAssetCategory,
          leasePrice: parseInt(leasePrice),
        }
    let modifiedNft = await prisma.nFT.update({
      where: { tokenId },
      data: data,
    })
    res.json(modifiedNft)
  } catch (error) {
    console.log(error)
    return res
      .status(400)
      .json({ error: `Error while putting token ${tokenId} on sale` })
  }
})

router.put('/off-market/:tokenId', async (req: Request, res: Response) => {
  let tokenId: string | number = req.params.tokenId
  tokenId = parseInt(tokenId)
  try {
    const data = {
      price: 0,
      leasePrice: 0,
      isOnMarket: false,
      startSaleDate: new Date(),
      endSaleDate: new Date(),
    }
    let nft = await prisma.nFT.update({
      where: { tokenId },
      data: data,
    })
    res.json(nft)
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ error: `Error while putting token ${tokenId} off sale` })
  }
})

router.put(
  '/edit/:tokenId',
  checkForErrors,
  async (req: Request, res: Response) => {
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
    const multimediaFileTypeChecked =
      multimediaFile === null ? undefined : multimediaFile
    const propertiesTypeChecked = properties === null ? undefined : properties
    try {
      const fileUrlValidity =
        fileUrl === '' || isUrlValid(fileUrl) ? true : false
      if (!fileUrlValidity) throw { error: 'Invalid fileUrl' }
      let nft = await prisma.nFT.findUnique({
        where: { tokenId },
        select: {
          ...selectionNFT,
          user: {
            select: {
              ...selectionUser,
            },
          },
          borrower: {
            select: {
              ...selectionUser,
            },
          },
          creator: {
            select: {
              ...selectionUser,
            },
          },
          collection: {
            select: {
              ...selectionCollection,
            },
          },
        },
      })
      let exisitingCollection = await prisma.collection.findUnique({
        where: { name: collection },
      })
      if (!exisitingCollection)
        throw { error: `Collection with name ${collection} does not exist` }
      if (!nft) throw { error: `NFT with tokenId ${tokenId} does not exist` }
      if (nft?.isMetadataFrozen)
        throw { error: `NFT with tokenId ${tokenId} has its metadata frozen` }
      // delete the old NFT
      await prisma.nFT.delete({ where: { tokenId } })
      // create a new NFT with modified data
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
        blockchainType: nft.blockchainType,
        tokenId: nft.tokenId,
        itemId: nft.itemId,
        ercType: nft.ercType,
        like: new Array(),
      }
      const newNft = await prisma.nFT.create({
        data: {
          ...data,
          user: { connect: { address: nft.user.address } },
          borrower: { connect: { address: nft.borrower.address } },
          creator: { connect: { address: nft.creator.address } },
          collection: { connect: { name: collection } },
        },
      })
      res.json(newNft)
    } catch (error) {
      console.log(error)
      return res
        .status(400)
        .json({ error: `Error while updating the token ${tokenId}` })
    }
  },
)

router.put(
  '/transfer/:tokenId',
  nftPutSaleValidationRules,
  checkForErrors,
  async (req: Request, res: Response) => {
    let tokenId: string | number = req.params.tokenId
    tokenId = parseInt(tokenId)
    const { address } = req.body
    try {
      let nft = await prisma.nFT.findUnique({
        where: { tokenId },
        select: {
          ...selectionNFT,
          user: {
            select: {
              ...selectionUser,
            },
          },
          borrower: {
            select: {
              ...selectionUser,
            },
          },
          creator: {
            select: {
              ...selectionUser,
            },
          },
          collection: {
            select: {
              ...selectionCollection,
            },
          },
        },
      })
      if (!nft) throw { error: `NFT with tokenId ${tokenId} does not exist` }
      // delete the old NFT
      await prisma.nFT.delete({ where: { tokenId } })
      // create a new NFT with modified data
      const multimediaFileTypeChecked = JSON.stringify(nft.multimediaFile)
      const propertiesTypeChecked = JSON.stringify(nft.properties)
      const data = {
        name: nft.name,
        fileUrl: nft.fileUrl,
        multimediaFile: multimediaFileTypeChecked,
        isMetadataFrozen: nft.isMetadataFrozen,
        saleType: nft.saleType,
        collectibleCategory: nft.collectibleCategory,
        productKeyRealLifeAssetCategory: nft.productKeyRealLifeAssetCategory,
        productKeyVirtualAssetCategory: nft.productKeyVirtualAssetCategory,
        isSensitiveContent: nft.isSensitiveContent,
        properties: propertiesTypeChecked,
        blockchainType: nft.blockchainType,
        tokenId: nft.tokenId,
        itemId: nft.itemId,
        ercType: nft.ercType,
        like: new Array(),
        price: 0,
        isOnMarket: false,
        startSaleDate: new Date(),
        endSaleDate: new Date(),
      }
      const newNft = await prisma.nFT.create({
        data: {
          ...data,
          user: { connect: { address } },
          borrower: { connect: { address } },
          creator: { connect: { address: nft.creator.address } },
          collection: { connect: { name: nft.collection.name } },
        },
      })
      res.json(newNft)
    } catch (error) {
      console.log(error)
      return res
        .status(400)
        .json({ error: `Error while updating the token ${tokenId}` })
    }
  },
)

router.put(
  '/lease/:tokenId',
  nftPutSaleValidationRules,
  checkForErrors,
  async (req: Request, res: Response) => {
    let tokenId: string | number = req.params.tokenId
    tokenId = parseInt(tokenId)
    const { address, startLeaseDate, endLeaseDate } = req.body
    try {
      let nft = await prisma.nFT.findUnique({
        where: { tokenId },
        select: {
          ...selectionNFT,
          user: {
            select: {
              ...selectionUser,
            },
          },
          borrower: {
            select: {
              ...selectionUser,
            },
          },
          creator: {
            select: {
              ...selectionUser,
            },
          },
          collection: {
            select: {
              ...selectionCollection,
            },
          },
        },
      })
      if (!nft) throw { error: `NFT with tokenId ${tokenId} does not exist` }
      // delete the old NFT
      await prisma.nFT.delete({ where: { tokenId } })
      // create a new NFT with modified data
      const multimediaFileTypeChecked = JSON.stringify(nft.multimediaFile)
      const propertiesTypeChecked = JSON.stringify(nft.properties)
      const data = {
        name: nft.name,
        fileUrl: nft.fileUrl,
        multimediaFile: multimediaFileTypeChecked,
        isMetadataFrozen: nft.isMetadataFrozen,
        saleType: nft.saleType,
        collectibleCategory: nft.collectibleCategory,
        productKeyRealLifeAssetCategory: nft.productKeyRealLifeAssetCategory,
        productKeyVirtualAssetCategory: nft.productKeyVirtualAssetCategory,
        isSensitiveContent: nft.isSensitiveContent,
        properties: propertiesTypeChecked,
        blockchainType: nft.blockchainType,
        tokenId: nft.tokenId,
        itemId: nft.itemId,
        ercType: nft.ercType,
        like: new Array(),
        priceLease: 0,
        isOnMarket: false,
        startLeaseDate,
        endLeaseDate,
      }
      const newNft = await prisma.nFT.create({
        data: {
          ...data,
          user: { connect: { address: nft.user.address } },
          borrower: { connect: { address } },
          creator: { connect: { address: nft.creator.address } },
          collection: { connect: { name: nft.collection.name } },
        },
      })
      res.json(newNft)
    } catch (error) {
      console.log(error)
      return res
        .status(400)
        .json({ error: `Error while updating the token ${tokenId}` })
    }
  },
)

router.delete('/:tokenId', async (req: Request, res: Response) => {
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

router.get('/', async (req: Request, res: Response) => {
  try {
    const nfts = await prisma.nFT.findMany({})
    res.json(nfts)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'Error occurred while fetching NFTs' })
  }
})

router.get('/:tokenId', async (req: Request, res: Response) => {
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
      .status(400)
      .json({ error: `Error occurred while fetching NFT: ${tokenId}` })
  }
})

export default router
