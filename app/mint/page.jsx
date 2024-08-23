"use client"
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { readContract, writeContract } from "@wagmi/core";
import { config } from "@/utils/providers"
import { NFTAddress, NFTAbi } from "@/utils/nft-abi";
import Dropzone from 'react-dropzone';
import { Familjen_Grotesk } from "next/font/google";

/*

    NFT MINTING MENU

    This menu allows user to mint their NFTs in {contracts/NFT.sol}.
    Check {static/NFTAbi.js} to see the contract's address.

*/

function openNFT(address, tokenId){
    window.location.href = `${window.location.origin}/view-nft/${address}/${tokenId}`
}

export default function MintNFT() {
    const [formInput, setFormInput] = useState({ name: '', description: '', audio: '', image: '', artist: '', genre: '', releaseDate: '' });
    const [uploading, setUploading] = useState(false);
    const [audioFile, setAudioFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const { address } = useAccount();

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    const handleInputChange = (e) => {
        setFormInput({ ...formInput, [e.target.name]: e.target.value });
    }

    const uploadData = async (metadata) => {
        try {
          const data = new FormData();

          data.set("file", JSON.stringify(metadata));
          const uploadRequest = await fetch("/api/json", {
            method: "POST",
            body: data,
          });

          const uploadData = await uploadRequest.json();
          console.log(`Metadata uploaded: ipfs://${uploadData.IpfsHash}`);
          return `ipfs://${uploadData.IpfsHash}`;
        } catch (e) {
          console.log(e);
          alert("Trouble uploading metadata");
          return `ipfs://undefined`
        }
    };

    const uploadFile = async (file) => {
        try {
            const data = new FormData();
            data.append('file', file);
            
            const uploadRequest = await fetch('/api/files', {
                method: 'POST',
                body: data,
            });
            const uploadData = await uploadRequest.json();
            console.log(file);
            console.log(`File uploaded: ipfs://${uploadData.IpfsHash}`);
            return `ipfs://${uploadData.IpfsHash}`;
        } catch (e) {
            console.log(e);
            alert("Trouble uploading file");
            return `ipfs://undefined`
          }
    };

    const mintNFT = async () => {
        const { name, description, audio, image, artist, genre, releaseDate } = formInput;
        if (!name ) return;
        if(!address){
            alert("Connect your wallet first");
            return
        };

        setUploading(true);

        let audioUrl = audio;
        let imageUrl = image;

        if(audioFile){
            audioUrl = await uploadFile(audioFile);
            if(audioUrl == "ipfs://undefined"){
                setUploading(false);
                alert("Error uploading Audio to IPFS");
                return
            }
        }
        if(imageFile){
            imageUrl = await uploadFile(imageFile);
            if(imageUrl == "ipfs://undefined"){
                setUploading(false);
                alert("Error uploading Cover to IPFS");
                return
            }
        }

        // This is the metadata we need to save to NFT's URI
        // Following the standard format supported by OpenSea or Rarible
        const metadata = {
            name: name,
            description: description,
            image: imageUrl,
            audio: audioUrl,
            animation_url: audioUrl,
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

        if(metadataUrl == "ipfs://undefined"){
            setUploading(false);
            alert("Error uploading metadata to IPFS")
            return
        }

        setUploading(false);

        const nextTokenId = await readContract(config, {
            abi: NFTAbi,
            address: NFTAddress,
            functionName: "nextTokenId"
        });
        
        // We call the minting function in the NFT's contract
        //const transaction = await contract.mint(metadataUrl);
        const transaction = await writeContract(config, {
            abi: NFTAbi,
            address: NFTAddress,
            functionName: "mint",
            args: [metadataUrl]
        });
        
        alert(```NFT's being minted!
            Remember: Metadata can take some time to appear, you must wait IPFS gateways to retrieve it first.```);
        
        // Redirect user to NFT's page
        openNFT(NFTAddress, nextTokenId)
    };
    
    return (
    <div className={"max-w-3xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg"}>
        <h1 className={"text-2xl font-bold mb-6"}>Mint a New NFT</h1>

        <div className={"grid grid-cols-1 md:grid-cols-2 gap-6"}>
            <div>
                <input type="text" className={"w-full p-2 bg-gray-700 rounded-md"} name="name" placeholder="Song Title" onChange={handleInputChange} />
            </div>
            <div>
                <input type="text" className={"w-full p-2 bg-gray-700 rounded-md"} name="artist" placeholder="Artist" onChange={handleInputChange} />
            </div>
            
            <div className={"col-span-2"}>
                <input type="text" className={"w-full p-2 bg-gray-700 rounded-md"} name="description" placeholder="Description" onChange={handleInputChange} />
            </div>
            <div className={"w-full p-2 bg-gray-700 rounded-md"}>
                <Dropzone accept="audio/"  maxSize={MAX_FILE_SIZE} onDrop={(acceptedFiles) => setAudioFile(acceptedFiles[0])}>
                    {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps({ className: 'dropzone' })}>
                            <input {...getInputProps()} />
                            <p>{audioFile ? audioFile.name : 'Drag & drop an audio file here, or click to select one. Max. 5MB'}</p>
                        </div>
                    )}
                </Dropzone>
                <input type="text" className={"w-full p-2 bg-gray-700 rounded-md"} name="audio" placeholder="Or put an Audio's URL instead" onChange={handleInputChange} />
            </div>
            <div className={"w-full p-2 bg-gray-700 rounded-md"}>
                <Dropzone accept="image/" maxSize={MAX_FILE_SIZE} onDrop={(acceptedFiles) => setImageFile(acceptedFiles[0])}>
                    {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps({ className: 'dropzone' })}>
                            <input {...getInputProps()} />
                            <p>{imageFile ? imageFile.name : 'Drag & drop an image file here, or click to select one. Max. 5MB'}</p>
                        </div>
                    )}
                </Dropzone>
                <input type="text" className={"w-full p-2 bg-gray-700 rounded-md"} name="image" placeholder="Or put an Image's URL instead" onChange={handleInputChange} />
            </div>
            <div>
                <input type="text" className={"w-full p-2 bg-gray-700 rounded-md"} name="genre" placeholder="Genre" onChange={handleInputChange} />
            </div>
            <div>
                <input type="date" className={"w-full p-2 bg-gray-700 rounded-md"} name="releaseDate" placeholder="Release Date" onChange={handleInputChange} />
            </div> 

            {uploading ? 'Uploading...' : (
                 <button className={"col-span-2 p-3 bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-600"} onClick={mintNFT} disabled={!address}>Mint NFT</button>
            )}
        </div>
    </div>
    );
}