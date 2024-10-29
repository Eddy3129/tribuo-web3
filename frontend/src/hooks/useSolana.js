import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

const useSolana = () => {
  const { publicKey, sendTransaction } = useWallet();
  const connection = new Connection(process.env.VITE_RPC_URL);

  const sendSOL = async (to, amount) => {
    if (!publicKey) throw new Error('Wallet not connected');

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(to),
        lamports: amount * 1000000000, // Convert SOL to lamports
      })
    );

    const signature = await sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, 'processed');

    return signature;
  };

  return { sendSOL, connection, publicKey };
};

export default useSolana;
