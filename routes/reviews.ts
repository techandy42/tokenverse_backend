import { PrismaClient } from '@prisma/client'
import express, { Request, Response } from 'express'
import {
  selectionUser,
  selectionCollection,
  selectionNFT,
  selectionReview,
} from '../constants/selections'
import {
  reviewPostValidationRules,
  checkForErrors,
} from '../functions/validations'

const prisma = new PrismaClient()
const router = express.Router()

/* Fetches a review */
router.get('/:id', async (req: Request, res: Response) => {
  let id: string | number = req.params.id
  id = parseInt(id)
  try {
    const review = await prisma.review.findUnique({
      where: { id },
      select: {
        ...selectionReview,
      },
    })
    return res.json(review)
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: `Cannot find the review with id: ${id}`,
    })
  }
})

/* Creates a review */
router.post(
  '/',
  reviewPostValidationRules,
  checkForErrors,
  async (req: Request, res: Response) => {
    const { address, tokenId, rating, comment, title } = req.body
    const ratingTypeChecked = parseInt(rating)
    try {
      const data = {
        rating: ratingTypeChecked,
        comment,
        title,
      }
      const review = await prisma.review.create({
        data: {
          ...data,
          nft: { connect: { tokenId } },
          user: { connect: { address } },
        },
      })
      return res.json(review)
    } catch (error) {
      console.log(error)
      return res.status(400).json({
        error: `Error while creating the review of user address: ${address}`,
      })
    }
  },
)

/* Modifies a review */
router.put('/:id', async (req: Request, res: Response) => {
  let id: string | number = req.params.id
  id = parseInt(id)
  const { rating, comment, title } = req.body
  const ratingTypeChecked = parseInt(rating)
  try {
    const data = {
      rating: ratingTypeChecked,
      comment,
      title,
    }
    const review = await prisma.review.update({
      where: { id },
      data: { ...data },
    })
    return res.json(review)
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      error: `Error while editing the review with id: ${id}`,
    })
  }
})

/* Deletes a review */
router.delete('/:id', async (req: Request, res: Response) => {
  let id: string | number = req.params.id
  id = parseInt(id)
  try {
    await prisma.review.delete({ where: { id } })
    return res.json({ message: `Deleted the review with id: ${id}` })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: `Cannot find the review with id: ${id}`,
    })
  }
})

export default router
