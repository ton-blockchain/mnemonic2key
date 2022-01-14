const TonWeb = require("tonweb");
const mnemonic = require("tonweb-mnemonic");
const fs = require("fs");

const len = process.argv.length;
const isVerbose = process.argv[2] === '-v';
const offset = 2 + (isVerbose ? 1 : 0);

if (len !== offset + 24 && len !== offset + 25) {
    console.error('Usage: node index.js word1 word2 ... word24 [address]');
    return;
}

const words = process.argv.slice(offset, offset + 24);
const addressString = process.argv[offset + 24];

const init = async () => {
    if (!(await mnemonic.validateMnemonic(words))) {
        console.error('invalid mnemonic')
        return;
    }

    const seed = await mnemonic.mnemonicToSeed(words);
    if (isVerbose) {
        console.log('HEX: ' + TonWeb.utils.bytesToHex(seed));
        console.log('base64: ' + TonWeb.utils.bytesToBase64(seed));
    } else {
        fs.writeFileSync('wallet.pk', seed);

        if (addressString) {
            const address = new TonWeb.utils.Address(addressString);
            const addressBytes = new Uint8Array( 32 + 4);
            addressBytes.set(address.hashPart, 0);
            for (let i = 32; i < 32 + 4; i++) {
                addressBytes[i] = address.wc === -1 ? 0xff : 0x00;
            }
            fs.writeFileSync('wallet.addr', addressBytes);
        }
    }
}

init();