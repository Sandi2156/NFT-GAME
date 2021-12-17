const isWalletConnected = async (options, setOptions) => {
    try {
        const { ethereum } = window;
        if (!ethereum) {
            alert("Make sure you have metamask");
            return;
        }
        const accounts = await ethereum.request({ 'method': 'eth_accounts' });
        if (accounts.length != 0) {
            console.log(accounts[0]);
            setOptions({ ...options, walletNo: accounts[0] });
        }
    } catch (error) {
        console.log(error);
    }

}
export default isWalletConnected;