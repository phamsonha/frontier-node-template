
module.exports = () => {
    const { decodeAddress, encodeAddress, blake2AsHex } = require('@polkadot/util-crypto');

    const convertToEvmAddress = (substrateAddress) => {
        const addressBytes = decodeAddress(substrateAddress);
        return '0x' + Buffer.from(addressBytes.subarray(0, 20)).toString('hex');
    }

    const convertToSubstrateAddress = (evmAddress, prefix = 42) => {
        const addressBytes = Buffer.from(evmAddress.slice(2), 'hex');
        const prefixBytes = Buffer.from('evm:');
        const convertBytes = Uint8Array.from(Buffer.concat([ prefixBytes, addressBytes ]));
        const finalAddressHex = blake2AsHex(convertBytes, 256);
        return encodeAddress(finalAddressHex, prefix);
    }

    const help = `--evm <address>: Calculate the EVM address that corresponds to a native Substrate address.
    --substrate <address>: Calculate the Substrate address that corresponds to EVM address.`;



    if (process.argv.length < 4) {
      console.error('Please provide the <address> parameter.');
      console.error(help);
      process.exit(9);
    }
    
    const cmd =     process.argv[2];
    console.log (`cmd=${cmd}`)
    const address = process.argv[3];
    
    
    if (cmd == "--evm") {
        if (!address.match(/^[A-z0-9]{48}$/)) {
            console.error('Please enter a valid Substrate address.');
            console.error(help);
            process.exit(9);
        }
        return convertToEvmAddress (address)
    } else  if (cmd == "--substrate") {
        if (!address.match(/^0x[A-f0-9]{40}$/)) {
            console.error('Please enter a valid EVM address.');
            console.error(help);
            process.exit(9);
        }
        return convertToSubstrateAddress (address)
    } else console.error(help);
    
  };
  