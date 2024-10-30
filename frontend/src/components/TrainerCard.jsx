// src/components/TrainerCard.js

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { toast } from 'react-toastify';
import './TrainerCard.css'; // Create this CSS file for TrainerCard-specific styles

const TrainerCard = ({ name, speciality, price }) => {
  const { publicKey, sendTransaction } = useWallet();
  const connection = new Connection('https://rpc.devnet.soo.network/rpc');

  const handleBooking = async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet to book a session.');
      return;
    }

    try {
      const trainerAddress = new PublicKey('8cADNqD1U9DK4RsaoBko7tckRaLcvL58P2ZbyKDpV5ky'); 
      const lamports = price * 1000000000; // Convert SOL to lamports
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: trainerAddress,
          lamports: lamports,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'processed');

      toast.success(`Booking confirmed! Transaction ID: ${signature}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to book session. Please try again.');
    }
  };

  return (
    <div className="trainer-card">
      <h3>{name}</h3>
      <p><strong>Speciality:</strong> {speciality}</p>
      <p><strong>Price:</strong> {price} SOL</p>
      <button onClick={handleBooking}>Book Session</button>
    </div>
  );
};

export default TrainerCard;
