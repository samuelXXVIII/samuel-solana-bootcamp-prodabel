import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Contador } from "../target/types/contador";

describe("contador", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Contador as Program<Contador>;

  it("Inicializa o contador", async () => {
    const contador = anchor.web3.Keypair.generate();

    await program.methods
      .inicializar()
      .accounts({
        contador: contador.publicKey,
        usuario: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([contador])
      .rpc();

    const conta = await program.account.contador.fetch(contador.publicKey);
    console.log("Valor inicial:", conta.valor.toString());
  });

  it("Incrementa o contador", async () => {
    const contador = anchor.web3.Keypair.generate();

    await program.methods
      .inicializar()
      .accounts({
        contador: contador.publicKey,
        usuario: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([contador])
      .rpc();

    await program.methods
      .incrementar()
      .accounts({
        contador: contador.publicKey,
      })
      .rpc();

    const conta = await program.account.contador.fetch(contador.publicKey);
    console.log("Valor após incrementar:", conta.valor.toString());
  });
});
