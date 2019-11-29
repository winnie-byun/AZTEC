
import addAccess from './metadata/addAccess';
import encryptedViewingKey from './encryptedViewingKey';
import { METADATA_AZTEC_DATA_LENGTH } from './config/constants';


/**
 * @method grantAccess - grant an Ethereum address view access to a note
 * @param {Object} access - mapping between an Ethereum address and the linked public key. The specified address
 * is being granted access to the note
 * @param {} noteViewKey - viewing key of the note
 * @param {string} owner - Ethereum address that owns the note
 */
export default function generateAccessMetaData(access, noteViewKey, owner) {
    let accessUsers = access;
    if (typeof access === 'string') {
        accessUsers = [
            {
                address: owner,
                linkedPublicKey: access,
            },
        ];
    } else if (!Array.isArray(access)) {
        accessUsers = [access];
    }
    const realViewingKey = noteViewKey;
    const metaDataAccess = accessUsers.map(({ address, linkedPublicKey }) => {
        return {
            address,
            viewingKey: encryptedViewingKey(linkedPublicKey, realViewingKey).toHexString(),
        };
    });
    const newMetaData = addAccess('', metaDataAccess);
    return newMetaData.slice(METADATA_AZTEC_DATA_LENGTH + 2);
};

