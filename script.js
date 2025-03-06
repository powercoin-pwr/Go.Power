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
    },
    {
        "constant": true,
        "inputs": [
            { "name": "owner", "type": "address" },
            { "name": "spender", "type": "address" }
        ],
        "name": "allowance",
        "outputs": [{ "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    }
];

const lpTokenContract = new web3.eth.Contract(lpTokenABI, lpTokenAddress);

document.getElementById("approveButton").addEventListener("click", async () => {
    const accounts = await web3.eth.getAccounts();
    try {
        await lpTokenContract.methods.approve(contractAddress, web3.utils.toWei("1000000", "ether")).send({ from: accounts[0] });
        alert("Approval successful! Now you can stake.");
    } catch (error) {
        console.error("Approval failed:", error);
        alert("Approval failed. Check console for details.");
    }
});

document.getElementById("stakeButton").addEventListener("click", async () => {
    const accounts = await web3.eth.getAccounts();
    const userAddress = accounts[0];

    if (!userAddress) {
        alert("Please connect your wallet first.");
        return;
    }

    const stakeAmount = document.getElementById("stakeAmount").value;
    if (!stakeAmount || stakeAmount <= 0) {
        alert("Enter a valid stake amount.");
        return;
    }

    try {
        // Verificar si el usuario aprobó suficientes LP Tokens
        const allowance = await lpTokenContract.methods.allowance(userAddress, contractAddress).call();
        console.log("Allowance:", allowance);

        if (BigInt(allowance) < BigInt(web3.utils.toWei(stakeAmount, "ether"))) {
            alert("You need to approve more LP Tokens before staking.");
            return;
        }

        // Llamar a stake() en el contrato de staking
        await contract.methods.stake(web3.utils.toWei(stakeAmount, "ether")).send({ from: userAddress, gas: 300000 });

        alert("Stake successful!");
        updateActiveStakes();
    } catch (error) {
        console.error("Stake failed:", error);
        alert(`Stake failed: ${error.message}`);
    }
});
