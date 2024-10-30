// src/components/InitializeUserData.js

import React, { useState, useEffect } from 'react';
import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-toastify';
import './InitializeUserData.css'; // Ensure this path is correct

const InitializeUserData = () => {
  const { publicKey, sendTransaction, signTransaction } = useWallet();
  const connection = new Connection('https://rpc.devnet.soo.network/rpc');  
  const programId = new PublicKey('5p3BC3xzdS5pabm6ZWZZg9i5PFgUPyiN4mSGcHVnHxwf'); 

  const [isInitialized, setIsInitialized] = useState(false);
  const [workoutType, setWorkoutType] = useState('');
  const [duration, setDuration] = useState('');
  const [workoutLog, setWorkoutLog] = useState([]);
  const [transactionSignature, setTransactionSignature] = useState(null); // New state for signature

  useEffect(() => {
    if (publicKey) {
      checkInitialization();
      loadWorkoutLog();
    }
  }, [publicKey]);

  // Function to check if the user has already initialized their data
  const checkInitialization = async () => {
    try {
      const WORKOUT_SEED = 'workout';
      const workoutPubkey = await PublicKey.createWithSeed(publicKey, WORKOUT_SEED, programId);
      const accountInfo = await connection.getAccountInfo(workoutPubkey);
      if (accountInfo !== null) {
        setIsInitialized(true);
      }
    } catch (error) {
      console.error('Error checking initialization:', error);
    }
  };

  // Function to initialize user data
  const initializeUserData = async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet!');
      return;
    }

    try {
      const WORKOUT_SEED = 'workout';
      const workoutPubkey = await PublicKey.createWithSeed(publicKey, WORKOUT_SEED, programId);

      const transaction = new Transaction().add(
        SystemProgram.createAccountWithSeed({
          fromPubkey: publicKey,
          basePubkey: publicKey,
          seed: WORKOUT_SEED,
          newAccountPubkey: workoutPubkey,
          lamports: await connection.getMinimumBalanceForRentExemption(128), // Adjust space as needed
          space: 128, // Adjust based on your account size
          programId,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      setTransactionSignature(signature); // Store the signature in state
      await connection.confirmTransaction(signature, 'processed');

      toast.success('User data initialized successfully!');
      setIsInitialized(true);
    } catch (error) {
      console.error('Initialization error:', error);
      toast.error('Initialization failed. It might already be initialized.');
    }
  };

  // Function to handle workout logging locally
  const logWorkout = () => {
    if (!workoutType || !duration) {
      toast.error('Please enter both workout type and duration.');
      return;
    }

    const newWorkout = {
      type: workoutType,
      duration: parseInt(duration),
      timestamp: new Date().toLocaleString(),
    };

    const updatedLog = [...workoutLog, newWorkout];
    setWorkoutLog(updatedLog);
    setWorkoutType('');
    setDuration('');

    // Save to localStorage
    localStorage.setItem('workoutLog', JSON.stringify(updatedLog));

    toast.success('Workout logged successfully!');
  };

  // Function to load workouts from localStorage
  const loadWorkoutLog = () => {
    const storedWorkouts = localStorage.getItem('workoutLog');
    if (storedWorkouts) {
      setWorkoutLog(JSON.parse(storedWorkouts));
    }
  };

  return (
    <div className="initialize-user-data">
      <h3>User Data Initialization</h3>
      {!isInitialized ? (
        <button onClick={initializeUserData} className="initialize-button">
          Initialize
        </button>
      ) : (
        <div>
          <h4>Log Your Workout</h4>
          <input
            type="text"
            placeholder="Workout Type (e.g., Cardio)"
            value={workoutType}
            onChange={(e) => setWorkoutType(e.target.value)}
          />
          <input
            type="number"
            placeholder="Duration (minutes)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <button onClick={logWorkout} className="log-workout-button">
            Log Workout
          </button>

          {workoutLog.length > 0 && (
            <div className="workout-log">
              <h4>Workout Logs</h4>
              <ul>
                {workoutLog.map((workout, index) => (
                  <li key={index}>
                    <strong>Type:</strong> {workout.type} | <strong>Duration:</strong> {workout.duration} minutes |{' '}
                    <strong>Time:</strong> {workout.timestamp}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Display Transaction Signature */}
          {transactionSignature && (
            <div className="transaction-signature">
              <h4>Transaction Submitted</h4>
              <p>
                <strong>Signature:</strong> {transactionSignature}
              </p>
              <a
                href={`https://explorer.devnet.soo.network/tx/${transactionSignature}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Soon Devnet Explorer
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InitializeUserData;
