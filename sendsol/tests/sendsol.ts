import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Sendsol } from "../target/types/sendsol";
import { assert } from "chai";

describe("sendsol", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Sendsol as Program<Sendsol>;

  it("Registra um usuario", async () => {
    const nome = "samuel3";
    const [contaUsuario] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("usuario"), Buffer.from(nome)],
      program.programId
    );
    await program.methods
      .registrarUsuario(nome)
      .accounts({
        contaUsuario,
        usuario: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    const conta = await program.account.contaUsuario.fetch(contaUsuario);
    console.log("Usuario registrado:", conta.nome);
    assert.equal(conta.nome, nome);
  });

  it("Transfere SOL usando nome de usuario", async () => {
    const destinatario = anchor.web3.Keypair.generate();
    const nome = "samuel3";
    const [contaUsuario] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("usuario"), Buffer.from(nome)],
      program.programId
    );
    const valor = new anchor.BN(100000000);
    await program.methods
      .transferir(valor)
      .accounts({
        de: provider.wallet.publicKey,
        para: destinatario.publicKey,
        contaDestino: contaUsuario,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
  });
});
