let web3;
let contract;
const contractAddress = "0x4936e0DFa40F5Ada61920d6Bbfd12D2BA88FfAe8";
const lpTokenAddress = "0xe5c56E4a8F8d96e3A91b18D83b7f0c36663C9a74";

const contractABI = [
    {
        "constant": false,
        "inputs": [
            { "name": "amount", "type": "uint256" }
        ],
        "name": "stake",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "unstake",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "claimRewards",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getAllStakes",
        "outputs": [
            {
                "components": [
                    { "name": "user", "type": "address" },
                    { "name": "amount", "type": "uint256" },
                    { "name": "startTime", "type": "uint256" },
                    { "name": "rewards", "type": "uint256" }
                ],
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        document.getElementById("walletAddress").innerText = `Connected: ${accounts[0]}`;
        contract = new web3.eth.Contract(contractABI, contractAddress);
        updateActiveStakes();
    } else {
        alert("MetaMask not detected");
    }
}

document.getElementById("connectWallet").addEventListener("click", connectWallet);

document.getElementById("stakeButton").addEventListener("click", async () => {
    const accounts = await web3.eth.getAccounts();
    const stakeAmount = document.getElementById("stakeAmount").value;
    if (!stakeAmount || stakeAmount <= 0) {
        alert("Enter a valid stake amount.");
        return;
    }
    try {
        await contract.methods.stake(web3.utils.toWei(stakeAmount, "ether")).send({ from: accounts[0] });
        alert("Stake successful!");
        updateActiveStakes();
    } catch (error) {
        console.error("Stake failed:", error);
        alert("Stake failed. Check console for details.");
    }
});

document.getElementById("unstakeButton").addEventListener("click", async () => {
    const accounts = await web3.eth.getAccounts();
    try {
        await contract.methods.unstake().send({ from: accounts[0] });
        alert("Unstake successful!");
        updateActiveStakes();
    } catch (error) {
        console.error("Unstake failed:", error);
        alert("Unstake failed. Check console for details.");
    }
});

document.getElementById("claimRewardsButton").addEventListener("click", async () => {
    const accounts = await web3.eth.getAccounts();
    try {
        await contract.methods.claimRewards().send({ from: accounts[0] });
        alert("Rewards claimed successfully!");
    } catch (error) {
        console.error("Claiming rewards failed:", error);
        alert("Claiming rewards failed. Check console for details.");
    }
});

async function updateActiveStakes() {
    try {
        const stakes = await contract.methods.getAllStakes().call();
        const tableBody = document.getElementById("activeStakeRecords");
        tableBody.innerHTML = "";
        stakes.forEach(stake => {
            const row = `<tr>
                <td>${stake.user.substring(0, 6)}...${stake.user.slice(-4)}</td>
                <td>${web3.utils.fromWei(stake.amount, "ether")} LP</td>
                <td>${new Date(stake.startTime * 1000).toLocaleString()}</td>
                <td>${web3.utils.fromWei(stake.rewards, "ether")} PWR</td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Failed to fetch active stakes:", error);
    }
}
