// import type { Web3Provider } from 'ethers';
import type { ReservoirWallet } from '@reservoir0x/reservoir-sdk';
import { arrayify } from 'ethers/lib/utils';
import type { TypedDataSigner } from '@ethersproject/abstract-signer/lib/index';
import { GelatoRelay } from "@gelatonetwork/relay-sdk";
import type { Web3Provider } from '@ethersproject/providers';


export const getGelatoAdapter = (provider: Web3Provider): ReservoirWallet => {
    return {
      // https://github.com/reservoirprotocol/reservoir-kit/blob/main/packages/ethers-wallet-adapter/src/adapter.ts
      address: async () => {
        const signer = await provider.getSigner();
        return signer.getAddress()
      },
      // https://github.com/reservoirprotocol/reservoir-kit/blob/main/packages/ethers-wallet-adapter/src/adapter.ts
      handleSignMessageStep: async (stepItem) => {
        const signer = await provider.getSigner();
        const signData = stepItem.data?.sign
        let signature: string | undefined
        if (signData) {
          // Request user signature
          if (signData.signatureKind === 'eip191') {
            console.log('Execute Steps: Signing with eip191');
            if (signData.message.match(/0x[0-9a-fA-F]{64}/)) {
              // If the message represents a hash, we need to convert it to raw bytes first
              signature = await signer.signMessage(arrayify(signData.message))
            } else {
              signature = await signer.signMessage(signData.message)
            }
          } else if (signData.signatureKind === 'eip712') {
            console.log('Execute Steps: Signing with eip712');
            signature = await (
              signer as unknown as TypedDataSigner
            )._signTypedData(signData.domain, signData.types, signData.value)
          }
        }
        return signature
      },
      handleSendTransactionStep: async (chainId, stepItem) => {
        const { gas, ...stepData } = stepItem.data;
        console.log(stepData);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        const relay = new GelatoRelay();
        const request = {
            chainId: chainId,
            target: stepData.to,
            data: stepData.data,
            user: address
        };
        const relayResponse = await relay.sponsoredCallERC2771(request, provider, process.env.NEXT_PUBLIC_GELATO_API_KEY as string);
        console.log(relayResponse);

        // Poll status of relayResponse.taskId and return transaction hash
        return '0x';
      },
    }
  }