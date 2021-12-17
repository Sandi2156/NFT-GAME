const connectWallet = async (accounts, setAccounts) => {

    try {
        const { ethereum } = window;
        if (!ethereum) {
            alert('Make sure you have Metamask');
            return;
        }
        const accounts = await ethereum.request({ 'method': 'eth_requestAccounts' });
        if (accounts.length != 0) {
            console.log(accounts[0]);
            setAccounts({ ...accounts, walletNo: accounts[0] });
        }

    } catch (error) {
        console.log(error);
    }
}
export default connectWallet;