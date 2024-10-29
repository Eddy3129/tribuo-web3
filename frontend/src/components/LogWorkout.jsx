import React, { useState } from 'react';
import { Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-toastify';

const LogWorkoutInteraction = () => {
  const { publicKey, sendTransaction } = useWallet();
  const connection = new Connection('https://rpc.devnet.soo.network/rpc'); // SOON Devnet RPC URL
  const programId = new PublicKey('5p3BC3xzdS5pabm6ZWZZg9i5PFgUPyiN4mSGcHVnHxwf'); // Replace with your actual Program ID

  const [workoutType, setWorkoutType] = useState('');
  const [duration, setDuration] = useState('');
  const [workoutLog, setWorkoutLog] = useState(null);

  // Function to log a workout session
  const logWorkout = async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet!');
      return;
    }

    if (!workoutType || !duration) {
      toast.error('Please fill in workout details.');
      return;
    }

    try {
      const WORKOUT_SEED = 'workout';
      const workoutPubkey = await PublicKey.createWithSeed(publicKey, WORKOUT_SEED, programId);

      // Check if workout account exists; if not, create it
      const workoutAccount = await connection.getAccountInfo(workoutPubkey);

      if (workoutAccount === null) {
        const lamports = await connection.getMinimumBalanceForRentExemption(128); // Adjust size as needed

        const transaction = new Transaction().add(
          SystemProgram.createAccountWithSeed({
            fromPubkey: publicKey,
            basePubkey: publicKey,
            seed: WORKOUT_SEED,
            newAccountPubkey: workoutPubkey,
            lamports,
            space: 128, // Adjust size as needed
            programId,
          })
        );

        const signature = await sendTransaction(transaction, connection);
        await connection.confirmTransaction(signature, 'processed');
        toast.success('Workout account created successfully!');
      }

      // Create and send workout instruction
      const data = Buffer.from(`${workoutType}:${duration}`); // Format workout data
      const instruction = new TransactionInstruction({
        keys: [{ pubkey: workoutPubkey, isSigner: false, isWritable: true }],
        programId,
        data,
      });

      const workoutTx = new Transaction().add(instruction);
      const signature = await sendTransaction(workoutTx, connection);
      await connection.confirmTransaction(signature, 'processed');

      toast.success('Workout logged successfully!');
      setWorkoutLog({ workoutType, duration });
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h3>Log Your Workout</h3>
      <input
        type="text"
        placeholder="Workout Type (e.g., Cardio)"
        value={workoutType}
        onChange={(e) => setWorkoutType(e.target.value)}
      />
      <input
        type="text"
        placeholder="Duration (minutes)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />
      <button onClick={logWorkout} className="log-workout-button">
        Log Workout
      </button>
      {workoutLog && (
        <div className="workout-log">
          <h4>Last Workout</h4>
          <p>Type: {workoutLog.workoutType}</p>
          <p>Duration: {workoutLog.duration} minutes</p>
        </div>
      )}
    </div>
  );
};

export default LogWorkoutInteraction;
