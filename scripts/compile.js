const fs = require('fs');
const path = require('path');
const { Client, ContractCreateTransaction, FileCreateTransaction } = require('@hashgraph/sdk');

async function main() {
    try {
        // Read the contract source
        const contractPath = path.join(__dirname, '../contracts/FaidaInvestment.sol');
        const source = fs.readFileSync(contractPath, 'utf8');

        // Create a client
        const client = Client.forTestnet();

        // Create a file transaction
        const fileTransaction = new FileCreateTransaction()
            .setContents(source)
            .setMaxTransactionFee(1000000000)
            .freezeWith(client);

        // Sign and execute the transaction
        const signedTx = await fileTransaction.sign(process.env.PRIVATE_KEY);
        const txResponse = await signedTx.execute(client);
        const receipt = await txResponse.getReceipt(client);

        console.log('Contract compiled and uploaded successfully!');
        console.log('File ID:', receipt.fileId);
        
        // Save the file ID for later use
        fs.writeFileSync(
            path.join(__dirname, '../contract-info.json'),
            JSON.stringify({ fileId: receipt.fileId.toString() }, null, 2)
        );

    } catch (error) {
        console.error('Compilation failed:', error);
        process.exit(1);
    }
}

main(); 