"use client"
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { readContract, writeContract } from "@wagmi/core";
import { config } from "@/utils/providers";

import { marketplaceAddress, marketplaceAbi } from "@/utils/market-abi";
import { NFTAddress, NFTAbi } from "@/utils/nft-abi";
import { shortenAddress, processIPFSString } from "@/utils/config";
import { parseEther } from "viem";

import { Waveform } from '@/components/waveform'
import { ShareButton } from '@/components/share-button'

import { motion, AnimatePresence } from 'framer-motion';

/*
NFT Display Card

This contains all the functions to interact with the NFTs, highly reusable in purpose

PARAMS

- keyProp: In case NFT is listed on the marketplace, specify listingId here (ONLY ADD IF LISTED)
- contractAddressProp: Specify NFT's contract address here
- tokenIdProp: Specify NFT's id here
- priceProp: Thec NFT's cost here
- seller: The one selling the NFT (ONLY ADD IF LISTED)
- config: Wether the value's can be modificable or not

*/

function BaseDisplay({ nft, children }){
    return (
        <AnimatePresence>
            <motion.div
                className={"flex p-3 w-full items-center"}
                style={{ position: 'relative', borderRadius: '30px', color: '#fff',  overflow: 'hidden' }}
                initial = {{ opacity: 0, y: 20, scale: 0.8 }}
	whileInView = {{ opacity: 1, y: 0, scale: 0.98 }}
	whileHover = {{ opacity: 1, y: 0, scale: 1 }}
                exit = {{ opacity: 0, y: 20, scale: 0.8 }}
            >
                {/* The backgorund image */}
                <img src={processIPFSString(nft.image)} alt={nft.name} style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'blur(8px) brightness(0.4)',
                    zIndex: 0,
                }} />

                {/* The image at the left side */}
                <div  style={{  position: 'relative', zIndex: 1, margin: '1%'}}>
                    <img src={processIPFSString(nft.image)} alt={nft.name} 
                        style={{ width: '200px', height: '200px', borderRadius: '8%', objectFit: 'cover', }}
                    />
                </div>

                <div className={"flex-grow w-full relative z-10 mr-3 p-2"} 
                    style={{position: 'relative', zIndex: 1, width:'100%' }}
                >
                    <div className="flex flex-grow w-full flex-col md:flex-row" style={{width:'100%'}}>
                        {/* Title and desc, aligned to the left */}
                        <div className="md:w-2/3 flex-grow" style={{width:'80%'}}>
                            <h5>{nft.name}</h5>
                            <p className="mb-1">{nft.description}</p>
                        </div>
                        {/* Timestamp and Genre, aligned to the right */}
                        <div className="md:w-1/3 text-right flex-grow">
                            { nft.attributes && <div>
                                {nft.attributes.map((attr, index) => {
                                    return <p key={index} className="mb-0"><strong>{attr.trait_type}:</strong> {attr.value}</p>;
                                })}
                            </div>}
                        </div>
                    </div>

                    {/* The audio display */}
                    <div className="w-full mt-2">
                            <Waveform audioUrl={processIPFSString(nft.audio)}  />
                    </div>
                    
                    <div className={"flex flex-grow w-full justify-between items-center mt-2 md:flex-row"}>
                        {children}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export function NFTDisplay({ keyProp='', contractAddressProp=NFTAddress, tokenIdProp='', priceProp='', seller='', configurable="true"}) {
    const [contractAddress, setContractAddress] = useState(contractAddressProp);
    const [tokenId, setTokenId] = useState(tokenIdProp);
    const [nft, setNft] = useState(null);
    const [price, setPrice] = useState(priceProp);
    const [isOwner, setIsOwner] = useState(false);
    const { address } = useAccount();

    // Reads data about the NFT from the blockchain
    // Checks if user owns the NFT
    // Updates data and display accordingly
    const fetchNFT = async () => {
        try {
            const tokenUri = await readContract(config, {
                abi: NFTAbi,
                address: contractAddress,
                functionName: "tokenURI",
                args: [tokenId]
            });
            const ownerAddress = await readContract(config, {
                abi: NFTAbi,
                address: contractAddress,
                functionName: "ownerOf",
                args: [tokenId]
            });
            
            const meta = await fetch(processIPFSString(`${tokenUri}`)).then(res => res.json());

            console.log(tokenUri, meta);
            console.log(meta["name"]);
            console.log(meta.name);

            const newNft = {
                tokenId: tokenId,
                name: meta["name"],
                description: meta.description,
                image: meta.image,
                audio: meta.audio,
                artist: meta.artist,
                attributes: meta.attributes,
                owner: ownerAddress
            };

            setNft(newNft);

            console.log(newNft);

            setIsOwner(address == ownerAddress || address == seller);
        } catch (error) {
        }
    };

    // When first loaded, auto fetch NFT if data specified
    useEffect( () => {
        if(address){
             fetchNFT();
        }
        return () => {
            setNft(null);
        };
    }, [contractAddress, tokenId, address]);


    // Adds the token to the marketplace
    // Checks user is the owner to not lose gas doing a transaction that will revert
    // First, approves market to move the user's NFTs at NFT's address
    // Then, places a listing in Market's contract
    const addToMarketplace = async () => {
        if (!price) {
            alert("Please enter a price for the NFT.");
            return;
        }
            

        try {
            // Check they're the owner
            const ownerAddress = nft.owner;
            if(address != ownerAddress){ // They don't own the NFT!
                alert("You don't own this NFT!");
                return
            }

            // Check if Token's approved, if it's not, get approval
            const isApproved = await readContract(config, {
                abi: NFTAbi,
                address: contractAddress,
                functionName: "isApprovedForAll",
                args: [address, marketplaceAddress]
            });

            if(!isApproved) {
                const transaction = await writeContract(config, {
                    abi: NFTAbi,
                    address: contractAddress,
                    functionName: "setApprovalForAll",
                    args: [marketplaceAddress, true]
                })
                alert("Waiting for approval to be mined, we'll prompt for listing soon.");
            }

            // Create a contract instance of the marketplace
            const priceInWei = parseEther(price);
            const transaction = await writeContract(config, {
                abi: marketplaceAbi,
                address: marketplaceAddress,
                functionName: "listToken", //(address,uint256,uint256)
                args: [contractAddress, tokenId, 1, priceInWei, 1]
            })
        
            alert("NFT added to the marketplace successfully!");
        } catch (error) {
            console.error("Failed to add NFT to the marketplace:", error);
            alert("Failed to add NFT to the marketplace. See console for details.");
        }
    };

    // Buys an NFT from the marketplace
    // TODO: Check displayed NFT is the listed one!
    const buyNFT = async () => {
        try {
            // Convert the price to Wei (assuming the price is in Ether)
            const priceInWei = parseEther(price);
            
            // Call the function to buy the NFT
            const transaction = await writeContract(config, {
                abi: marketplaceAbi,
                address: marketplaceAddress,
                functionName: "buyToken",
                value: priceInWei,
                args: [keyProp]
            })
            
            alert("NFT purchased successfully!");
        } catch (error) {
            console.error("Failed to buy NFT:", error);
            alert("Failed to buy NFT. See console for details.");
        }
    };

    // Cancels a listing
    // TODO: check user is the seller!
    const cancelListing = async () => {        
        try {
            // Call the function to buy the NFT
            const transaction = await writeContract(config, {
                abi: marketplaceAbi,
                address: marketplaceAddress,
                functionName: "cancelListing",
                args: [keyProp]
            })
            
            alert("NFT unlisted successfully!");
        } catch (error) {
            console.error("Failed to cancel listing:", error);
            alert("Failed to cancel listing. See console for details.");
        }
    };

    // COMPONENTS

    function configNFTInfo(){
        return (
            <div className={"card row p-5 m-3"}>
                <input
                    type="text"
                    placeholder="Contract Address"
                    value={contractAddress}
                    className={"bg-gray-800 text-white rounded-l"}
                    onChange={(e) => setContractAddress(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="NFT Id"
                    value={tokenId}
                    className={"bg-gray-800 text-white rounded-r"}
                    onChange={(e) => setTokenId(e.target.value)}
                />
            </div>
        )
    }

    function renderActionBtns(){
        if(isOwner && seller == ''){
            // User's the owner and it's not being sold. Render 'Add to Market' button
            return (<div className={"flex flex-row"}>
                <input
                type="text"
                className={"bg-gray-800 text-white rounded-l md:mb-0"}
                placeholder="Price in ETH"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                />
                <button
                className={"btn btn-primary bg-gray-500 hover:bg-gray-700 text-white px-2 py-2 rounded-r"}
                onClick={addToMarketplace}>
                    Sell
                </button>
            </div>)
        }
        if(!isOwner && seller != ''){
            // User's not the owner and it's being sold. Render 'Buy' button
            return (<button 
                className="btn btn-success me-2 bg-green-500 text-white px-4 py-2 rounded"
                onClick={buyNFT}>
                    Buy This
                </button>)
        }
        if(isOwner && seller != '') {
            // User's the owner and it's being sold. Render 'Cancel' button
            return (<button
                className="btn btn-danger bg-red-500 text-white px-4 py-2 rounded" 
                onClick={cancelListing}>
                    Cancel Listing
                </button>)
        }

        return <div></div>
    }

    return (
        <div>
            {/* {configurable} is set to true in the /view-nft/ route, but not in the marketplace.
                This renders a menu to chose which NFT to display by its ID and Contract Address */}
            { configurable == "true" && configNFTInfo()}

            {nft ? (
            <BaseDisplay nft={nft}>
                {nft.owner != marketplaceAddress ? (
                    <div className={"md:w-2/3 flex-grow"} style={{width:'100%'}}>
                        <strong>Owner:</strong>{shortenAddress(nft.owner)}
                    </div>
                ) : (
                    <div className={"md:w-2/3 flex-grow"} style={{width:'100%'}}>
                        <p className="mb-0"><strong>Price:</strong> {price} ETH</p>
                        <p className="mb-0"><strong>Seller:</strong> {shortenAddress(seller)}</p>
                    </div>
                )}

                <div className={"md:w-1/3 flex flex-grow flex-row"}>
                    {renderActionBtns()}
                    <ShareButton address={contractAddress} tokenId={tokenId}></ShareButton>
                </div>
            </BaseDisplay>
            ) : (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>LOADING NFT...</motion.p>
            )}
        </div>
    );
}