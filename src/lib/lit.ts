import LitJsSdk from 'lit-js-sdk'

interface LitConfig {
  chain?: string
  accessControlConditions?: Object[]
}

class Lit {
  private client?: any
  private config: LitConfig = {
    chain: 'ethereum',
    accessControlConditions: [
      {
        contractAddress: '',
        standardContractType: '',
        chain: 'ethereum',
        method: 'eth_getBalance',
        parameters: [':userAddress', 'latest'],
        returnValueTest: {
          comparator: '>=',
          value: '1000000000000',
        },
      },
    ],
  }

  async connect(config?: LitConfig) {
    const client = new LitJsSdk.LitNodeClient()
    await client.connect()
    this.client = client
    if (config != null) this.config = config
  }

  async encrypt(message: string) {
    if (this.client == null) throw Error('not initalized')

    const { chain, accessControlConditions } = this.config
    const authSig = await LitJsSdk.checkAndSignAuthMessage({
      chain,
    })

    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
      message
    )
    const encryptedSymmetricKey = await this.client.saveEncryptionKey({
      accessControlConditions,
      symmetricKey,
      authSig,
      chain,
    })

    return {
      encryptedString,
      encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
        encryptedSymmetricKey,
        'base16'
      ),
    }
  }

  async decrypt(encryptedString: Blob, encryptedSymmetricKey: string) {
    if (this.client == null) return
    const { chain, accessControlConditions } = this.config
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })
    const symmetricKey = await this.client.getEncryptionKey({
      accessControlConditions,
      toDecrypt: encryptedSymmetricKey,
      chain,
      authSig,
    })

    const decryptedString = await LitJsSdk.decryptString(
      encryptedString,
      symmetricKey
    )

    return { decryptedString }
  }
}

export default new Lit()
