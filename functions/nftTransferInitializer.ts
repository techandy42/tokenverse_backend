const nftTransferInitializer = (nft: any) => {
  const data = {
    name: nft.name,
    // changed names
    image: nft.image,
    animationUrl: nft.animationUrl,
    //
    isMetadataFrozen: nft.isMetadataFrozen,
    collection: nft.collection,
    saleType: nft.saleType,
    collectibleCategory: nft.collectibleCategory,
    productKeyAccessTokenCategory: nft.productKeyAccessTokenCategory,
    productKeyVirtualAssetCategory: nft.productKeyVirtualAssetCategory,
    isSensitiveContent: nft.isSensitiveContent,
    descriptions: nft.descriptions,
    blockchainType: nft.blockchainType,
    tokenId: nft.tokenId,
    itemId: nft.itemId,
    ercType: nft.ercType,
    // newly added fields
    images: true,
    externalUrl: true,
    youtubeUrl: true,
    description: true,
    attributes: true,
    //
  }
  return data
}

export default nftTransferInitializer
