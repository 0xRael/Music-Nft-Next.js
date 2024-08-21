"use client"
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { readContract, writeContract } from "@wagmi/core";
import { config } from "@/utils/providers"
import { NFTAddress, NFTAbi } from "@/utils/nft-abi";

/*

    NFT MINTING MENU

    This menu allows user to mint their NFTs in {contracts/NFT.sol}.
    Check {static/NFTAbi.js} to see the contract's address.

*/

export default function MintNFT() {
    const [formInput, setFormInput] = useState({ name: '', description: '', audio: '', image: '', artist: '', genre: '', releaseDate: '' });
    const [uploading, setUploading] = useState(false);
    const { address } = useAccount();

    const handleInputChange = (e) => {
        setFormInput({ ...formInput, [e.target.name]: e.target.value });
    }

    const uploadData = async (metadata) => {
        if(!address){
            alert("Connect your wallet first");
            return
        };
        try {
          setUploading(true);
          const data = new FormData();
          data.set("file", JSON.stringify(metadata));
          const uploadRequest = await fetch("/api/json", {
            method: "POST",
            body: data,
          });
          const uploadData = await uploadRequest.json();
          setUploading(false);
          return `ipfs://${uploadData.IpfsHash}`;
        } catch (e) {
          console.log(e);
          setUploading(false);
          alert("Trouble uploading file");
        }
      };

    const mintNFT = async () => {
        const { name, description, audio, image, artist, genre, releaseDate } = formInput;
        if (!name || !audio || !artist) return;

        // This is the metadata we need to save to NFT's URI
        // Following the standard format supported by OpenSea or Rarible
        const metadata = {
            name: name,
            description: description,
            image: image,
            audio: audio,
            attributes: [
                {
                    trait_type: "Genre",
                    value: genre
                },
                {
                    trait_type: "Artist",
                    value: artist
                },
                {
                    trait_type: "Release Date",
                    value: releaseDate
                }
            ]
        };
        
        const metadataUrl = await uploadData(metadata);
        console.log(metadataUrl);
        if(metadataUrl == "ipfs://undefined"){
            alert("Error uploading to IPFS")
            return
        }
        
        // We call the minting function in the NFT's contract
        //const transaction = await contract.mint(metadataUrl);
        const transaction = await writeContract(config, {
            abi: NFTAbi,
            address: NFTAddress,
            functionName: "mint",
            args: [metadataUrl]
        });
        
        alert('NFT minted successfully!');
    };
    
    return (
    <div>
        <h1>Mint a New NFT</h1>

        <div className="row g-3">
            <div className="col-md-6">
                <input type="text" className="form-control" name="name" placeholder="Song Title" onChange={handleInputChange} />
            </div>
            <div className="col-md-6">
                <input type="text" className="form-control" name="artist" placeholder="Artist" onChange={handleInputChange} />
            </div>
            
            <div className="col-md-12">
                <input type="text" className="form-control" name="description" placeholder="Description" onChange={handleInputChange} />
            </div>
            <div className="col-md-6">
                <input type="text" className="form-control" name="audio" placeholder="Audio URL" onChange={handleInputChange} />
            </div>
            <div className="col-md-6">
                <input type="text" className="form-control" name="image" placeholder="Image URL" onChange={handleInputChange} />
            </div>
            <div className="col-md-6">
                <input type="text" className="form-control" name="genre" placeholder="Genre" onChange={handleInputChange} />
            </div>
            <div className="col-md-6">
                <input type="date" className="form-control" name="releaseDate" placeholder="Release Date" onChange={handleInputChange} />
            </div> 

            <button className="btn btn-primary" onClick={mintNFT}>Mint NFT</button>
        </div>
    </div>
    );
}