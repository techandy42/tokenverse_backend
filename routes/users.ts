import { PrismaClient } from '@prisma/client'
import express, { Request, Response } from 'express'
import {
  selectionUser,
  selectionCollection,
  selectionNFT,
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
        nftslease: {
          select: {
            ...selectionNFT,
          },
        },
        nftscreated: {
          select: {
            ...selectionNFT,
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
