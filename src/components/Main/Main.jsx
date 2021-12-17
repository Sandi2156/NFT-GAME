import './main.css'
import SelectCharacter from '../SelectCharacter/SelectCharacter'
import Arena from '../Arena/Arena'
const Main = ({ options, setOptions }) => {

    const renderComponent = () => {
        if (!options.walletNo) {
            return <div className='connectWalletMessage'>
                Connect with your wallet
            </div>
        }
        else if (!options.playerCharacter) {
            return <SelectCharacter setOptions={setOptions} options={options} />
        }
        else {
            return <Arena setOptions={setOptions} options={options} />
        }

    }

    return (
        <div className="main">
            {
                renderComponent()
            }
        </div>
    )
}

export default Main
