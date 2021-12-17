import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import './App.css';
import isWalletConnected from './methods/isWalletConnected';
import { CONTRACT_ADDRESS, transformCharacterData } from './constants'
import NftJson from './utils/MyNftGame.json'


function App() {

  const [options, setOptions] = useState({
    walletNo: null,
    playerCharacter: null
  })

  const checkNetwork = async () => {
    try {
      if (window.ethereum.networkVersion !== '4') {
        alert("Please connect to Rinkeby!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    isWalletConnected(options, setOptions);
    checkNetwork()
  }, [])

  useEffect(() => {
    const checkPlayerHasNft = async () => {
      console.log("Checking player has nft on address : ", options.walletNo);
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(CONTRACT_ADDRESS, NftJson.abi, signer);

        const txn = await nftContract.checkIfUserHasNft();
        if (txn.name) {
          console.log('User has NFT');
          setOptions({ ...options, playerCharacter: transformCharacterData(txn) });
          console.log(options.playerCharacter)
        }
        else
          console.log('Player does not have any nft')
      }
      else {
        console.log('Make sure you have metamask');
      }
    }

    if (options.walletNo) {
      checkPlayerHasNft();
    }

  }, [options.walletNo])
  return (
    <div className="App">
      <Header options={options} setOptions={setOptions} />
      <Main options={options} setOptions={setOptions} />
    </div>
  );
}

export default App;
