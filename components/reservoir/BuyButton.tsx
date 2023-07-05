import { getClient } from '../../lib/utils';
// import { adaptEthersSigner } from '@reservoir0x/ethers-wallet-adapter';
import { useWallets } from '@privy-io/react-auth';
import { getGelatoAdapter } from '../../lib/gelatoAdapter';

export default function BuyButton() {
    const {wallets} = useWallets();
    const wallet = wallets[0];

    const collectionId = '0x05a0b0985ba3b7bd9ade8a7478caa2fa4fda24e5'
    return (
       <div>
        <button
            className='text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white'
            onClick={async () => {
                if (!wallet) {
                    console.error('Wallet not available');
                    return;
                }

                const provider = await wallet.getEthersProvider();

                getClient().actions.buyToken({
                    items: [
                    {
                        collection: collectionId,
                    },
                    ],
                    // options: {
                    //     currency: 'USDC',
                    //     usePermit: true,

                    // },
                    wallet: getGelatoAdapter(provider),
                    onProgress: () => {},
                });
            }}
        >
            Buy
        </button>
        </div>
    )
}