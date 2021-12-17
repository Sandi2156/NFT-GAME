import './selectCharacter.css'
import React, { useState, useEffect } from 'react';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import { ethers } from 'ethers';
import NftJson from '../../utils/MyNftGame.json';

const SelectCharacter = ({ options, setOptions }) => {

    const [characters, setCharacters] = useState([]);
    const [gameContract, setGameContract] = useState(null);

    const mintCharacterNft = async (characterIdx) => {
        try {
            const txn = await gameContract.mintCharaterNFT(characterIdx);
            await txn.wait();
            console.log(txn);
        } catch (error) {
            console.log(error);
        }
    }

    const renderCharacter = () => {
        return characters.map((character, index) => {
            return <div className='warrior-container' key={character.name}>
                <div className="warrior-name">{character.name}</div>
                <img src={character.image} alt="warrior image" className='warrior-image' />
                <button type='button' className='warrior-mint-button' onClick={() => mintCharacterNft(index)}>
                    {`Mint ${character.name}`}
                </button>
            </div>
        })
    }

    useEffect(() => {
        const { ethereum } = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const gameContract = new ethers.Contract(CONTRACT_ADDRESS, NftJson.abi, signer);
            setGameContract(gameContract);
        }
        else
            console.log('Make sure you have metamask');
    }, []);

    useEffect(() => {
        const getCharacters = async () => {
            console.log('Fetching all characters..');
            const txn = await gameContract.getAllDefaultCharacters();
            console.log('Fetched');
            const chrs = txn.map((character) => {
                return transformCharacterData(character);
            })

            setCharacters(chrs);
        }

        const onCharacterMint = async (sender, tokenId, characterIndex) => {
            console.log(
                `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
            );

            if (gameContract) {
                const nft = await gameContract.checkIfUserHasNft();
                console.log('nft : ', nft);
                setOptions({ ...options, playerCharacter: transformCharacterData(nft) })
            }
        }


        if (gameContract) {
            getCharacters();
            gameContract.on('CharacterNftMinted', onCharacterMint);
        }

        return () => {
            if (gameContract) {
                gameContract.off('CharacterNftMinted', onCharacterMint);
            }
        }
    }, [gameContract])

    return (
        <div className="selectNft">
            <h1>Choose Your NFT wisely</h1>
            {/* <iframe src="https://giphy.com/embed/Om2ozaOw3rNciJCf2t" width="480" height="400" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/theoffice-Om2ozaOw3rNciJCf2t">via GIPHY</a></p> */}
            <div className="select-warrior">
                {
                    renderCharacter()
                }
            </div>
        </div>
    )
}

export default SelectCharacter
