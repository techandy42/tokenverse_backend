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
    images: nft.images,
    externalUrl: nft.externalUrl,
    youtubeUrl: nft.youtubeUrl,
    description: nft.description,
    attributes: nft.attributes,
    //
  }
  return data
}

export default nftTransferInitializer
