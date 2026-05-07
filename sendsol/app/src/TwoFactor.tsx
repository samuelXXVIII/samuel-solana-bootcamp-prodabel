import { useState } from 'react'
import * as OTPAuth from 'otpauth'
import QRCode from 'qrcode'

interface TwoFactorProps {
  username: string
  onVerified: () => void
  onCancel: () => void
}

export function TwoFactor({ username, onVerified, onCancel }: TwoFactorProps) {
  const [qrcode, setQrcode] = useState('')
  const [secret, setSecret] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'setup' | 'verify'>('setup')
  const [error, setError] = useState('')

  const gerarQRCode = async () => {
    const totp = new OTPAuth.TOTP({
      issuer: 'SendSol',
      label: username,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: new OTPAuth.Secret(),
    })
    const uri = totp.toString()
    setSecret(totp.secret.base32)
    const qr = await QRCode.toDataURL(uri)
    setQrcode(qr)
    setStep('verify')
  }

  const verificar = () => {
    const totp = new OTPAuth.TOTP({
      issuer: 'SendSol',
      label: username,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secret),
    })
    const delta = totp.validate({ token: code, window: 5 })
    if (delta !== null) {
      localStorage.setItem('sendsol_2fa_' + username, secret)
      onVerified()
    } else {
      setError('Codigo incorreto. Tente novamente.')
    }
  }

  return (
    <div className='two-factor'>
      <h3>Autenticacao de 2 Fatores</h3>
      {step === 'setup' && (
        <div className='form'>
          <p style={{fontSize: '13px', color: '#666', textAlign: 'center'}}>
            Proteja sua conta com o Google Authenticator
          </p>
          <button className='btn-principal' onClick={gerarQRCode}>
            Configurar Google Authenticator
          </button>
          <button className='btn-secundario' onClick={onCancel}>
            Pular por enquanto
          </button>
        </div>
      )}
      {step === 'verify' && (
        <div className='form'>
          <p style={{fontSize: '13px', color: '#666', textAlign: 'center'}}>
            Escaneie o QR Code com o Google Authenticator
          </p>
          {qrcode && <img src={qrcode} alt='QR Code' style={{width: '180px', margin: '0 auto', display: 'block'}} />}
          <label>Digite o codigo de 6 digitos</label>
          <input
            placeholder='000000'
            value={code}
            onChange={e => setCode(e.target.value)}
            maxLength={6}
          />
          {error && <p style={{color: 'red', fontSize: '12px'}}>{error}</p>}
          <button className='btn-principal' onClick={verificar}>
            Verificar
          </button>
        </div>
      )}
    </div>
  )
}
