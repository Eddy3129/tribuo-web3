import React from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import TrainerCard from './components/TrainerCard';
import HelloWorldInteraction from './components/LogWorkout';
import 'react-toastify/dist/ReactToastify.css';
import '@solana/wallet-adapter-react-ui/styles.css';

const App = () => {
  const endpoint = 'https://rpc.devnet.soo.network/rpc';

  const wallets = [new PhantomWalletAdapter()];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="app">
            <header>
              <WalletMultiButton />
            </header>
            {/* Add HelloWorldInteraction component */}
            <HelloWorldInteraction />
            <div className="trainers">
              <TrainerCard name="John Doe" speciality="Strength Training" price={0.5} />
              <TrainerCard name="Jane Smith" speciality="Yoga" price={0.3} />
              {/* Add more TrainerCards as needed */}
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
