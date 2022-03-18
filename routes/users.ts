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

/* Creates a user */
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

/* Fetches a user */
router.get('/:address', async (req: Request, res: Response) => {
  const address = req.params.address
  try {
    const user = await prisma.user.findUnique({
      where: { address },
      select: {
        ...selectionUser,
      },
    })
    return res.json(user)
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error: 'User not found' })
  }
})

/* Fetches a user by userName */
router.get('/username/:userName', async (req: Request, res: Response) => {
  const userName = req.params.userName
  try {
    const user = await prisma.user.findUnique({
      where: { userName },
      select: {
        ...selectionUser,
      },
    })
    return res.json(user)
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error: 'User not found' })
  }
})

/* Fetches a user's collections */
router.get('/collections/:address', async (req: Request, res: Response) => {
  const address = req.params.address
  try {
    const userCollections = await prisma.user.findUnique({
      where: { address },
      select: {
        collections: {
          select: {
            ...selectionCollection,
          },
        },
      },
    })
    return res.json(userCollections)
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error: 'User not found' })
  }
})

/* Fetches a user's nfts and nftscreated */
router.get('/nfts/:address', async (req: Request, res: Response) => {
  const address = req.params.address
  try {
    const user = await prisma.user.findUnique({
      where: { address },
      select: {
        nfts: {
          select: {
            ...selectionNFT,
            collection: {
              select: {
                ...selectionCollection,
              },
            },
          },
        },
        nftscreated: {
          select: {
            ...selectionNFT,
            collection: {
              select: {
                ...selectionCollection,
              },
            },
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

/* Fetches all the liked NFT of a user */
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
      const tokenId = likedNftTokenIds[i]
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

/* Fetches all the cart NFT of a user */
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
      const tokenId = cartNftTokenIds[i]
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

/* Adds a liked NFT tokenId to a user */
router.put(
  '/liked/:address',
  checkForErrors,
  async (req: Request, res: Response) => {
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
  },
)

/* Adds a cart NFT tokenId to a user */
router.put(
  '/cart/:address',
  checkForErrors,
  async (req: Request, res: Response) => {
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
  },
)

/* Modifies a user */
router.put('/:address', checkForErrors, async (req: Request, res: Response) => {
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
  const imageTypeChecked = image
  try {
    const imageValidity =
      imageTypeChecked === null || isUrlValid(imageTypeChecked) ? true : false
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
      !imageValidity ||
      !emailValidity ||
      !mainLinkValidity ||
      !facebookLinkValidity ||
      !instagramLinkValidity ||
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

/* Fetches all the likedNfts (tokenIds) from a user */
router.get('/liked-nfts/:address', async (req: Request, res: Response) => {
  const address = req.params.address
  try {
    const user = await prisma.user.findUnique({
      where: { address },
      select: {
        likedNfts: true,
      },
    })
    return res.json(user)
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error: 'User not found' })
  }
})

/* Fetches all the cartNfts (tokenIds) from a user */
router.get('/cart-nfts/:address', async (req: Request, res: Response) => {
  const address = req.params.address
  try {
    const user = await prisma.user.findUnique({
      where: { address },
      select: {
        cartNfts: true,
      },
    })
    return res.json(user)
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error: 'User not found' })
  }
})

export default router
