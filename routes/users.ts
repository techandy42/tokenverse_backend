import { PrismaClient } from '@prisma/client'
import express, { Request, Response } from 'express'
import {
  selectionUser,
  selectionCollection,
  selectionNFT,
  selectionReview,
} from '../constants/selections'
import {
  userPostValidationRules,
  checkForErrors,
  isEmailValid,
  isUrlValid,
} from '../functions/validations'

const prisma = new PrismaClient()
const router = express.Router()

router.post(
  '/',
  userPostValidationRules,
  checkForErrors,
  async (req: Request, res: Response) => {
    const { address } = req.body
    try {
      const user = await prisma.user.create({
        data: {
          address,
          userName: address,
          likedNfts: new Array(),
          cartNfts: new Array(),
        },
      })
      return res.json(user)
    } catch (error) {
      console.log(error)
      return res
        .status(500)
        .json({ error: `Error in the server while creating user ${address}` })
    }
  },
)

router.get('/:address', async (req: Request, res: Response) => {
  const address = req.params.address
  try {
    const user = await prisma.user.findUnique({
      where: { address },
      select: {
        ...selectionUser,
        collections: {
          select: {
            ...selectionCollection,
          },
        },
        nfts: {
          select: {
            ...selectionNFT,
          },
        },
        nftscreated: {
          select: {
            ...selectionNFT,
          },
        },
        reviews: {
          select: {
            ...selectionReview,
          },
        },
      },
    })
    return res.json(user)
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error: 'User not found' })
  }
})

router.get('/liked/:address', async (req: Request, res: Response) => {
  const address = req.params.address
  try {
    const user = await prisma.user.findUnique({
      where: { address },
    })
    if (!user) throw { error: `Cannot find the user: ${address}` }
    // fetch liked nfts
    const likedNftTokenIds = user.likedNfts
    const listLikedNfts = []
    for (let i = 0; i < likedNftTokenIds.length; i++) {
      const tokenId = likedNftTokenIds[0]
      const likedNft = await prisma.nFT.findUnique({
        where: { tokenId },
      })
      if (likedNft) listLikedNfts.push(likedNft)
    }
    return res.json(listLikedNfts)
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error: 'User not found' })
  }
})

router.get('/cart/:address', async (req: Request, res: Response) => {
  const address = req.params.address
  try {
    const user = await prisma.user.findUnique({
      where: { address },
    })
    if (!user) throw { error: `Cannot find the user: ${address}` }
    // fetch cart nfts
    const cartNftTokenIds = user.cartNfts
    const cartLikedNfts = []
    for (let i = 0; i < cartNftTokenIds.length; i++) {
      const tokenId = cartNftTokenIds[0]
      const cartNft = await prisma.nFT.findUnique({
        where: { tokenId },
      })
      if (cartNft) cartLikedNfts.push(cartNft)
    }
    return res.json(cartLikedNfts)
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error: 'User not found' })
  }
})

router.put('/liked/:address', async (req: Request, res: Response) => {
  const address = req.params.address
  const { tokenId } = req.body
  try {
    let user = await prisma.user.findUnique({ where: { address } })
    if (!user) throw { error: `Cannot find the user: ${address}` }
    let nft = await prisma.nFT.findUnique({ where: { tokenId } })
    if (!nft) throw { error: `Cannot find the NFT: ${tokenId}` }
    const likedNfts = user.likedNfts
    user = await prisma.user.update({
      where: { address },
      data: {
        likedNfts: [...likedNfts, tokenId],
      },
    })
    return res.json(user)
  } catch (error) {
    console.log(error)
    return res
      .status(400)
      .json({ error: `User not found or invalid tokenId ${tokenId}` })
  }
})

router.put('/cart/:address', async (req: Request, res: Response) => {
  const address = req.params.address
  const { tokenId } = req.body
  try {
    let user = await prisma.user.findUnique({ where: { address } })
    if (!user) throw { error: `Cannot find the user: ${address}` }
    let nft = await prisma.nFT.findUnique({ where: { tokenId } })
    if (!nft) throw { error: `Cannot find the NFT: ${tokenId}` }
    const cartNfts = user.cartNfts
    user = await prisma.user.update({
      where: { address },
      data: {
        cartNfts: [...cartNfts, tokenId],
      },
    })
    return res.json(user)
  } catch (error) {
    console.log(error)
    return res
      .status(400)
      .json({ error: `User not found or invalid tokenId ${tokenId}` })
  }
})

router.put('/:address', async (req: Request, res: Response) => {
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
  const imageTypeChecked = image === null ? undefined : image
  try {
    const emailValidity = email === '' || isEmailValid(email) ? true : false
    const mainLinkValidity =
      mainLink === '' || isUrlValid(mainLink) ? true : false
    const facebookLinkValidity =
      facebookLink === '' || isUrlValid(facebookLink) ? true : false
    const instagramLinkValidity =
      instagramLink === '' || isUrlValid(instagramLink) ? true : false
    const twitterLinkValidity =
      twitterLink === '' || isUrlValid(twitterLink) ? true : false
    const linkedInLinkValidity =
      linkedInLink === '' || isUrlValid(linkedInLink) ? true : false
    if (
      !emailValidity ||
      !mainLinkValidity ||
      !facebookLinkValidity ||
      !instagramLink ||
      !twitterLinkValidity ||
      !linkedInLinkValidity
    )
      throw { error: 'Invalid email or link input(s)' }
    let user = await prisma.user.findUnique({ where: { address } })
    if (!user) throw { error: `Cannot find the user: ${address}` }
    const data = {
      image: imageTypeChecked,
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
    return res.status(400).json({ error: 'User not found' })
  }
})

export default router
