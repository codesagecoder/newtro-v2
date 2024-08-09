import getIpfsLink from "./ipfs/getIpfsLink";

const fetchCollectionWithMetadata = async (collectionAddress: Address) => {
  try {
    const response = await fetch(
      `/api/collection?collectionAddress=${collectionAddress}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch collections");
    }
    const data = await response.json();
    console.log("SWEETS DATA", data);
    const tokensWithMetadata = await Promise.all(
      data.data.tokens.map(async (token: any) => {
        try {
          console.log("SWEETS token", token);
          const metadataResponse = await fetch(
            getIpfsLink(token.token.tokenURI)
          );
          console.log("SWEETS metadataResponse", metadataResponse);
          if (!metadataResponse.ok) {
            throw new Error("Failed to fetch metadata");
          }
          const metadata = await metadataResponse.json();
          return { ...token, metadata };
        } catch (metadataError) {
          console.error("Error fetching metadata:", metadataError);
          return { ...token, metadata: null };
        }
      })
    );

    return { tokens: tokensWithMetadata, contract: data.data.contract };
  } catch (error) {
    console.error(error);
    return false;
  }
};

export default fetchCollectionWithMetadata;
