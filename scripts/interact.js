const { Client, ContractExecuteTransaction, ContractFunctionParameters, PrivateKey } = require("@hashgraph/sdk");
require("dotenv").config();

async function main() {
    // Grab your Hedera testnet account ID and private key from your .env file
    const myAccountId = process.env.MY_ACCOUNT_ID;
    const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

    // Create your Hedera Testnet client
    const client = Client.forTestnet();
    client.setOperator(myAccountId, myPrivateKey);

    // Your deployed contract address
    const contractId = "0x53F374ef0841daAaef734104883f45820e3fdB5c";

    // Example: Invest in the Starter Tier
    const investTx = await new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction(
            "invest",
            new ContractFunctionParameters()
                .addUint256(0) // tierIndex (0 for Starter)
                .addUint256(100000000) // amount in tinybars (1 HBAR = 100,000,000 tinybars)
        )
        .execute(client);

    const investReceipt = await investTx.getReceipt(client);
    console.log("Investment transaction status:", investReceipt.status.toString());

    // Example: Get investment details
    const getInvestmentTx = await new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction(
            "getInvestment",
            new ContractFunctionParameters()
                .addAddress(myAccountId)
        )
        .execute(client);

    const getInvestmentReceipt = await getInvestmentTx.getReceipt(client);
    console.log("Get investment transaction status:", getInvestmentReceipt.status.toString());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 