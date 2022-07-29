import React, { useEffect, useState } from 'react'
import lit from './lib/lit'

const App = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [inputVal, setInputVal] = useState<string>()
  const [encryptedString, setEncryptedString] = useState<Blob>()
  const [encryptedSymmetricKey, setEncryptedSymmetricKey] = useState<string>()

  useEffect(() => {
    const initialize = async () => {
      setLoading(true)
      await lit.connect()
      setLoading(false)
    }
    initialize()
  }, [])

  const encrypt = async () => {
    const { encryptedString, encryptedSymmetricKey } = await lit.encrypt(
      inputVal!
    )
    setEncryptedString(encryptedString)
    setEncryptedSymmetricKey(encryptedSymmetricKey)
    console.log(encryptedString)
    console.log(encryptedSymmetricKey)
  }

  const decrypt = async () => {
    const result = await lit.decrypt(encryptedString!, encryptedSymmetricKey!)
    console.log(result)
  }

  if (loading) return <div />
  return (
    <div>
      <input type="text" onChange={e => setInputVal(e.target.value)} />
      <button disabled={inputVal == null || inputVal == ''} onClick={encrypt}>
        encrypt
      </button>
      <button
        disabled={encryptedString == null || encryptedSymmetricKey == null}
        onClick={decrypt}
      >
        decrypt
      </button>
      <p></p>
    </div>
  )
}

export default App
