import { useState } from "react"

interface TwoFactorProps {
  username: string
  onVerified: () => void
  onCancel: () => void
}

function base32Encode(buffer: Uint8Array): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
  let result = ""
  let bits = 0
  let value = 0
  for (const byte of buffer) {
    value = (value << 8) | byte
    bits += 8
    while (bits >= 5) {
      result += alphabet[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }
  if (bits > 0) result += alphabet[(value << (5 - bits)) & 31]
  return result
}

function base32Decode(encoded: string): Uint8Array {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
  const clean = encoded.toUpperCase().replace(/=+$/g, "")
  let bits = 0
  let value = 0
  const output: number[] = []
  for (const char of clean) {
    const idx = alphabet.indexOf(char)
    if (idx < 0) continue
    value = (value << 5) | idx
    bits += 5
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255)
      bits -= 8
    }
  }
  return new Uint8Array(output)
}

async function hmacSHA1(key: Uint8Array, data: Uint8Array): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw", key, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]
  )
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, data)
  const hash = new Uint8Array(signature)
  const offset = hash[19] & 0xf
  const code = (
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff)
  ) % 1000000
  return code.toString().padStart(6, "0")
}

async function generateTOTP(secret: string, offset = 0): Promise<string> {
  const time = Math.floor(Date.now() / 1000 / 30) + offset
  const timeHex = time.toString(16).padStart(16, "0")
  const timeBytes = new Uint8Array(8)
  for (let i = 0; i < 8; i++) {
    timeBytes[i] = parseInt(timeHex.slice(i * 2, i * 2 + 2), 16)
  }
  const key = base32Decode(secret)
  return hmacSHA1(key, timeBytes)
}

function generateSecret(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(20))
  return base32Encode(bytes)
}

export function TwoFactor({ username, onVerified, onCancel }: TwoFactorProps) {
  const [secret] = useState(() => generateSecret())
  const [qrUrl, setQrUrl] = useState("")
  const [code, setCode] = useState("")
  const [step, setStep] = useState<"setup" | "verify">("setup")
  const [error, setError] = useState("")

  const configurar = () => {
    const otpauth = `otpauth://totp/SendSol:${username}?secret=${secret}&issuer=SendSol&algorithm=SHA1&digits=6&period=30`
    const qr = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(otpauth)}`
    setQrUrl(qr)
    setStep("verify")
  }

  const verificar = async () => {
    const expected = await generateTOTP(secret, 0)
    const prev = await generateTOTP(secret, -1)
    const next = await generateTOTP(secret, 1)
    console.log("Esperado:", expected, "Anterior:", prev, "Proximo:", next, "Digitado:", code)
    if (code === expected || code === prev || code === next) {
      localStorage.setItem("sendsol_2fa_" + username, secret)
      onVerified()
    } else {
      setError("Codigo incorreto. Tente novamente.")
    }
  }

  return (
    <div className="two-factor">
      <h3>Autenticacao de 2 Fatores</h3>
      {step === "setup" && (
        <div className="form">
          <p style={{fontSize: "13px", color: "rgba(255,255,255,0.5)", textAlign: "center"}}>
            Proteja sua conta com o Google Authenticator
          </p>
          <button className="btn-principal" onClick={configurar}>
            Configurar Google Authenticator
          </button>
          <button className="btn-secundario" onClick={onCancel}>
            Pular por enquanto
          </button>
        </div>
      )}
      {step === "verify" && (
        <div className="form">
          <p style={{fontSize: "13px", color: "rgba(255,255,255,0.5)", textAlign: "center"}}>
            Escaneie o QR Code com o Google Authenticator
          </p>
          {qrUrl && <img src={qrUrl} alt="QR Code" style={{width: "180px", margin: "0 auto", display: "block", borderRadius: "8px"}} />}
          <label>Digite o codigo de 6 digitos</label>
          <input
            placeholder="000000"
            value={code}
            onChange={e => setCode(e.target.value)}
            maxLength={6}
          />
          {error && <p style={{color: "#ff6b6b", fontSize: "12px"}}>{error}</p>}
          <button className="btn-principal" onClick={verificar}>
            Verificar
          </button>
        </div>
      )}
    </div>
  )
}
