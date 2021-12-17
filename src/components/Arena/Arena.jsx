import './arena.css';
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import myEpicGame from '../../utils/MyNftGame.json';


const Arena = ({ options, setOptions }) => {
    //state
    const [gameContract, setGameContract] = useState(null);
    const [boss, setBoss] = useState(null);
    // const [character, setCharacter] = useState(options.playerCharacter);
    const [attackState, setAttackState] = useState('');


    useEffect(() => {
        const { ethereum } = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, myEpicGame.abi, signer);

            setGameContract(contract);
        }
        else {
            console.log('Make sure you have metamask');
        }

    }, []);

    useEffect(() => {
        const fetchBoss = async () => {
            try {
                const txn = await gameContract.getBoss();
                console.log(txn);
                setBoss(transformCharacterData(txn));
            } catch (error) {
                console.log(error);
            }
        }

        const onAttackComplete = (bossHp, playerHp) => {
            console.log(`Boss Hp :  ${bossHp.toNumber()} Player Hp : ${playerHp.toNumber()}`);
            setBoss({ ...boss, hp: bossHp.toNumber() });
            setOptions({ ...options, playerCharacter: { ...options.playerCharacter, hp: playerHp.toNumber() } })

        }

        if (gameContract) {
            fetchBoss();
            gameContract.on('bossAttackCompleted', onAttackComplete);
        }

        return () => {
            if (gameContract)
                gameContract.off('bossAttackCompleted', onAttackComplete);
        }

    }, [gameContract])

    const onAttack = async () => {
        try {
            if (gameContract) {
                console.log('Attacking boss..');
                setAttackState('attacking');
                const txn = await gameContract.attackBoss();
                await txn.wait();
                console.log('attackTxn:', txn);
                setAttackState('hit');
            }
        } catch (error) {
            console.log('error while attacking ', error)
        }
    }

    return (
        <div className='arena'>
            {
                boss && (
                    <div className="arena-container">
                        {/* Boss Avatar */}
                        <div className={`boss-container ${attackState}`}>
                            <div className='boss-name'>{boss.name}</div>
                            <img src={boss.image} className='boss-image' alt="titan" />
                            <div className="health-bar">
                                <div className='bar' style={{ "width": `${(boss.hp / boss.maxHp) * 100}%` }}></div>
                            </div>
                        </div>
                        <div className="attack-container">
                            <button type='button' className='attack-button' onClick={onAttack}>Attack {boss.name}</button>
                        </div>
                        <div className={`hero-container ${attackState}`}>
                            <div className='hero-name'>{options.playerCharacter.name}</div>
                            <img src={options.playerCharacter.image} alt="" className='hero-image' />
                            <div className="health-bar">
                                <div className='bar' style={{ "width": `${(options.playerCharacter.hp / options.playerCharacter.maxHp) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}


export default Arena
