import { NextFunction, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'

export const userPostValidationRules = [body('address').isEthereumAddress()]

export function isEmailValid(email: string) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true
  }
  return false
}

export function isUrlValid(url: string) {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ) // fragment locator
  return !!pattern.test(url)
}

export const nftPostValidationRules = [body('address').isEthereumAddress()]

export const nftPutSaleValidationRules = [body('address').isEthereumAddress()]

const simpleVadationResult = validationResult.withDefaults({
  formatter: (err) => err.msg,
})

export const checkForErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = simpleVadationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.mapped())
  }
  next()
}
