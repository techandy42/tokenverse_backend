const decodeTokenIds = (encodedString: string) => {
  if (encodedString === '') {
    return new Array()
  }
  const splitEncodedStrings = encodedString.split('&')
  const tokenIds = splitEncodedStrings.map((s) => parseInt(s.slice(3)))
  return tokenIds
}

export default decodeTokenIds
