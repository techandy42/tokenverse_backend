export const selectionUser = {
  email: true,
  address: true,
  companyName: true,
  createdAt: true,
  description: true,
  facebookLink: true,
  image: true,
  instagramLink: true,
  linkedInLink: true,
  mainLink: true,
  twitterLink: true,
  userName: true,
  verified: true,
  verificationDate: true,
  role: true,
  likedNfts: true,
  cartNfts: true,
}

export const selectionNFT = {
  createdAt: true,
  name: true,
  blockchainType: true,
  // changed names
  image: true,
  animationUrl: true,
  //
  price: true,
  isOnSale: true,
  isOnLease: true,
  isOnAuction: true,
  isMetadataFrozen: true,
  isSensitiveContent: true,
  tokenId: true,
  itemId: true,
  startSaleDate: true,
  endSaleDate: true,
  saleType: true,
  collectibleCategory: true,
  productKeyAccessTokenCategory: true,
  productKeyVirtualAssetCategory: true,
  ercType: true,
  likes: true,
  descriptions: true,
  // newly added fields
  images: true,
  externalUrl: true,
  youtubeUrl: true,
  description: true,
  attributes: true,
  //
}

export const selectionReview = {
  rating: true,
  comment: true,
  title: true,
}

export const selectionCollection = {
  uuid: true,
  image: true,
  description: true,
  createdAt: true,
  name: true,
  isNameModified: true,
}
