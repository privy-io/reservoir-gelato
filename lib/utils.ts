import {
createClient,
getClient as getReservoirClient,
} from '@reservoir0x/reservoir-sdk';

export const getClient = () => {
let client = getReservoirClient()

if (!client) {
    return createClient({
    chains: [
        {
        baseApiUrl: 'https://api-goerli.reservoir.tools',
        id: 5,
        active: true,
        },
    ],
    source: 'reservoirkit.demo',
    })
}

return client
}