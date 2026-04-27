import { useState } from "react"
import "./App.css"

function App() {
  const [aba, setAba] = useState("enviar")
  const [nome, setNome] = useState("")
  const [valor, setValor] = useState("")
  const [destinatario, setDestinatario] = useState("")
  const [status, setStatus] = useState("")

  const registrar = () => {
    setStatus("Registrando @" + nome + "...")
  }

  const enviar = () => {
    setStatus("Enviando " + valor + " SOL para @" + destinatario + "...")
  }

  return (
    <div className="app">
      <div className="card">
        <div className="header">
          <h1>SendSol</h1>
          <p>Transferencias simples como Pix</p>
        </div>

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
            <p className="preview">Seu endereco: @{nome || "seu-nome"}</p>
            <button className="btn-principal" onClick={registrar}>Registrar</button>
          </div>
        )}

        {status && <div className="status">{status}</div>}
      </div>
    </div>
  )
}

export default App
