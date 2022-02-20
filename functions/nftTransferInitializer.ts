const nftTransferInitializer = (nft: any) => {
  const data = {
    name: nft.name,
    fileUrl: nft.fileUrl,
    multimediaFileUrl: nft.multimediaFileUrl,
    isMetadataFrozen: nft.isMetadataFrozen,
    collection: nft.collection,
    saleType: nft.saleType,
    collectibleCategory: nft.collectibleCategory,
    productKeyAccessTokenCategory: nft.productKeyAccessTokenCategory,
    productKeyVirtualAssetCategory: nft.productKeyVirtualAssetCategory,
    isSensitiveContent: nft.isSensitiveContent,
    descriptions: nft.descriptions,
    propertiesKey: nft.propertiesKey,
    propertiesValue: nft.propertiesValue,
    imagesKey: nft.imagesKey,
    imagesValue: nft.imagesValue,
    levelsKey: nft.levelsKey,
    levelsValueNum: nft.levelsValueNum,
    levelsValueDen: nft.levelsValueDen,
    blockchainType: nft.blockchainType,
    tokenId: nft.tokenId,
    itemId: nft.itemId,
    ercType: nft.ercType,
  }
  return data
}

export default nftTransferInitializer
