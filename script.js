let web3;
let contract;
const contractAddress = "0x4936e0DFa40F5Ada61920d6Bbfd12D2BA88FfAe8";
const lpTokenAddress = "0xe5c56E4a8F8d96e3A91b18D83b7f0c36663C9a74";

const lpTokenABI = [
    {
        "constant": false,
        "inputs": [
            { "name": "spender", "type": "address" },
            { "name": "value", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [{ "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        document.getElementById("walletAddress").innerText = `Connected: ${accounts[0]}`;
    } else {
        alert("MetaMask not detected");
    }
}

document.getElementById("connectWallet").addEventListener("click", connectWallet);

document.getElementById("approveButton").addEventListener("click", async () => {
    const accounts = await web3.eth.getAccounts();
    const lpTokenContract = new web3.eth.Contract(lpTokenABI, lpTokenAddress);
    try {
        await lpTokenContract.methods.approve(contractAddress, web3.utils.toWei("1000000", "ether")).send({ from: accounts[0] });
        alert("Approval successful! Now you can stake.");
    } catch (error) {
        console.error("Approval failed:", error);
        alert("Approval failed. Check console for details.");
    }
});

document.getElementById("emergencyUnstakeButton").addEventListener("click", async () => {
    const accounts = await web3.eth.getAccounts();
    try {
        await contract.methods.emergencyUnstake().send({ from: accounts[0], gas: 300000 });
        alert("Emergency unstake successful!");
    } catch (error) {
        console.error("Emergency unstake failed:", error);
        alert("Failed to execute emergency unstake. Check console for details.");
    }
});
