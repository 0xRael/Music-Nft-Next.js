"use client"
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { readContract, getStorageAt } from "@wagmi/core";
import { config } from "@/utils/providers"
import { marketplaceAddress, marketplaceAbi } from "@/utils/market-abi";
import { NFTDisplay } from "@/components/nft-display"
import { formatEther } from "viem";

/*
    NFT MarketPlace's Listings

    This just fetches the listings from the Marketplace's contract and displays them as <NFTDisplay />

    PARAMS

    - deepness: Specifies how much listings to fetch.

*/

export default function MarketListings() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const account = useAccount();
    const { address } = useAccount();
    const [deepness, setDeepness] = useState(5);

    //const { readContract } = useReadContract();
    
    const fetchListings = async () => {
        try {
            const listingIdCounter = await getStorageAt(config, {
                //abi: marketplaceAbi,
                address: marketplaceAddress,
                //functionName: "listingIdCounter",
               slot: "0x0"
            });
            let latestListings = [];
            console.log("listingIdCounter:", listingIdCounter)

            for (let i = Number(listingIdCounter) - 1; i > Number(listingIdCounter) - 1 - deepness && i >= 0; i--) {
                console.log("Deepness:", deepness);
                console.log("fetching Listing:", i);

                const listing = await readContract(config, {
                    abi: marketplaceAbi,
                    address: marketplaceAddress,
                    functionName: "listings",
                    args: [i]
                });

                console.log(listing);

                if(listing[5]  != 0){ // Check that it exists
                    latestListings.push({
                        id: i,
                        seller: listing[0],
                        tokenContract: listing[1],
                        tokenId: listing[2],
                        amount: listing[3].toString(),
                        price: formatEther(listing[4]),
                        tokenType: listing[5]
                    });
                }
            }
            
            setListings(latestListings);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching listings:', error);
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if(typeof window !== undefined){
                  setLoading(true);
                  fetchListings();
        }
    }, [deepness, address]);
    
    return (
        <div>
            {loading ? (
                <p className={"d-flex justify-content-center"}>Loading...</p>
            ) : (
                listings.map(listing => (
                    <div className={"py-3"}>
                        <NFTDisplay
                        key={listing.id}
                        keyProp={listing.id}
                        contractAddressProp={listing.tokenContract}
                        tokenIdProp={listing.tokenId}
                        priceProp={listing.price}
                        seller={listing.seller}
                        configurable="false"
                        />
                    </div>
                ))
            )}
        </div>
    );
    };