const web3Service = require('../../services/Web3Service');
const {
    AZTECAccountRegistryGSNConfig,
} = require('../../config/contracts');


module.exports = async ({
    signaturesHashes,
    networkId,
}) => {
    const options = {
        // TODO: must optimize this
        fromBlock: 0,
        toBlock: 'latest',
    };

    if (signaturesHashes) {
        options.filter = {
            signatureHash: signaturesHashes,
        };
    }

    const {
        name: AZTECAccountRegistryGSNContract,
        events: {
            GSNTransactionProcessed,
        },
        networks,
    } = AZTECAccountRegistryGSNConfig;

    const events = await web3Service
        .useContract(AZTECAccountRegistryGSNContract)
        .at(networks[networkId])
        .events(GSNTransactionProcessed)
        .where(options);

    const transactions = events.map(({
        blockNumber,
        transactionHash,
        returnValues: {
            signatureHash,
        },
    }) => ({
        blockNumber,
        signatureHash,
        transactionHash,
    }));

    return {
        error: null,
        transactions,
    };
}