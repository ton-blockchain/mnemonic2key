const TonWeb = require("tonweb");
const mnemonic = require("tonweb-mnemonic");

if (process.argv.length !== 24 + 2) {
    console.error('Need 24 mnemonic words divided by spaces');
    return;
}

const words = process.argv.slice(2);

const init = async () => {
    const seed = await mnemonic.mnemonicToSeed(words);
    console.log('HEX: ' + TonWeb.utils.bytesToHex(seed));
    console.log('base64: ' + TonWeb.utils.bytesToBase64(seed));
}

init();