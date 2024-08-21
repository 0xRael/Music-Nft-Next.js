import { PinataSDK } from "pinata"

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JWT}`,
  pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`
})

// Shortens the address returning: 0x123456...123456
export function shortenAddress(address = "", chars = 6) {
  const start = address.slice(0, chars + 2); // Keep the '0x' prefix and the first few characters
  const end = address.slice(-chars); // Keep the last few characters
  return `${start}...${end}`;
}

export function processIPFSString(inputString = "") {
  const prefix = "ipfs://";
  
  // Check if the string starts with the prefix
  if (inputString.startsWith(prefix)) {
      // Remove the prefix
      return `https://ipfs.io/ipfs/${inputString.slice(prefix.length)}`;
  }
  
  // Return the original string if the prefix is not found
  return inputString;
}
