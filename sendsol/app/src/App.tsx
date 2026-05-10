import { useState } from "react"
import { Connection, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js"
import "./App.css"
import { TwoFactor } from "./TwoFactor"

declare global {
  interface Window { solana?: any }
}

function App() {
  const [aba, setAba] = useState("enviar")
  const [carteira, setCarteira] = useState("")
  const [nome, setNome] = useState("")
  const [valor, setValor] = useState("")
  const [destinatario, setDestinatario] = useState("")
  const [status, setStatus] = useState("")
  const [mostrar2FA, setMostrar2FA] = useState(false)
  const [saldo, setSaldo] = useState(0)

  const conectar = async () => {
    try {
      const { solana } = window
      if (!solana) { setStatus("Instale a carteira Phantom"); return }
      const response = await solana.connect()
      const pubkey = response.publicKey.toString()
      setCarteira(pubkey)
      setSaldo(0)
      setStatus("")
    } catch (e) {
      console.error("Erro detalhado:", e); setStatus("Erro: " + String(e))
    }
  }

  const registrar = () => {
    if (!carteira) { setStatus("Conecte sua carteira primeiro"); return }
    if (!nome) { setStatus("Digite um nome de usuario"); return }
    setStatus("Usuario @" + nome + " registrado com sucesso!")
  }

  const enviar = () => {
    if (!carteira) { setStatus("Conecte sua carteira primeiro"); return }
    if (!destinatario || !valor) { setStatus("Preencha todos os campos"); return }
    setMostrar2FA(true)
  }

  return (
    <div className="app">
      <div className="card">
        <div className="header">
          <h1>SendSol</h1>
          <p>Transferencias simples como Pix</p>
        </div>

        {carteira ? (
          <div className="carteira-info">
            <span>Conectado: {carteira.slice(0,4)}...{carteira.slice(-4)}</span>
            <span>{saldo.toFixed(2)} SOL</span>
          </div>
        ) : (
          <button className="btn-principal" onClick={conectar}>Conectar Phantom</button>
        )}

        <div className="abas">
          <button className={aba === "enviar" ? "aba ativa" : "aba"} onClick={() => setAba("enviar")}>Enviar</button>
          <button className={aba === "registrar" ? "aba ativa" : "aba"} onClick={() => setAba("registrar")}>Registrar</button>
        </div>

        {aba === "enviar" && (
          <div className="form">
            <label>Para</label>
            <input placeholder="@usuario" value={destinatario} onChange={e => setDestinatario(e.target.value)} />
            <label>Valor (SOL)</label>
            <input placeholder="0.1" type="number" value={valor} onChange={e => setValor(e.target.value)} />
            <button className="btn-principal" onClick={enviar}>Enviar SOL</button>
          </div>
        )}

        {aba === "registrar" && (
          <div className="form">
            <label>Escolha seu nome de usuario</label>
            <input placeholder="seu-nome" value={nome} onChange={e => setNome(e.target.value)} />
            <p className="preview">@{nome || "seu-nome"}</p>
            <button className="btn-principal" onClick={registrar}>Registrar</button>
          </div>
        )}

        {status && <div className="status">{status}</div>}
        {mostrar2FA && (
          <TwoFactor
            username={nome}
            onVerified={() => {
              setMostrar2FA(false)
            }}
            onCancel={() => {
              setMostrar2FA(false)
            }}
          />
        )}
      </div>
    </div>
  )
}

export default App
