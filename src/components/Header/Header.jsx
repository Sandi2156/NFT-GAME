import './header.css'
import connectWallet from '../../methods/connectWallet'
const Header = ({ options, setOptions }) => {
    return (
        <div className='headerContainer'>
            <div className="header">
                <div className="logo">War<span>Sake</span> </div>
                <div className={`headerButton ${options.walletNo ? 'connected' : ''}`} onClick={() => connectWallet(options, setOptions)}>
                    {!options.walletNo ? `Connect Wallet` : `Connected`}
                </div>
            </div>
        </div>
    )
}

export default Header
