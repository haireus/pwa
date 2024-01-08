import { useEffect, useState } from 'react';
import './App.css';
import bananas from './Bananas.svg';
import { useNavigate } from 'react-router-dom';

function App() {
  const [isPwa, setIsPwa] = useState(false);
  const [installationStatus, setInstallationStatus] = useState('Checking...');
  const navigate = useNavigate();

  const [app, setApp] = useState<any>();

  useEffect(() => {
    const matchMedia = window.matchMedia('(display-mode: standalone)');
    matchMedia.addEventListener('change', (e) => {
      setIsPwa(e.matches);
    });
    setIsPwa(matchMedia.matches); // Set initial state
  }, []);

  useEffect(() => {
    // Check for supported methods:
    if ('getInstalledRelatedApps' in navigator) {
      checkInstallationWithGetInstalledRelatedApps();
    } else {
      checkInstallationWithHeuristics();
    }
  }, []);

  const checkInstallationWithGetInstalledRelatedApps = async () => {
    try {
      const apps = await (navigator as any).getInstalledRelatedApps();
      console.log(apps);

      setInstallationStatus(
        apps.length > 0 ? 'App is installed' : 'App is not installed'
      );

      setApp(app);
    } catch (error) {
      console.error('Error checking for installed app:', error);
      setInstallationStatus('Unable to check installation status');
    }
  };

  const checkInstallationWithHeuristics = () => {
    const isStandalone = (window.navigator as any)?.standalone;
    let promptEventHandled = false;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      promptEventHandled = true;
    });

    const isLikelyInstalled = isStandalone || promptEventHandled;
    setInstallationStatus(
      isLikelyInstalled
        ? 'App is likely installed'
        : 'App is likely not installed'
    );
  };

  // useEffect(() => {
  //   if (isPwa)
  //     navigate('https://pwa-ruby-three.vercel.app/mvpt', { replace: true });
  // }, [isPwa]);

  return (
    <div className='App'>
      <div>
        <a href='#'>
          <img src='/vite.svg' className='logo' alt='Vite logo' />
        </a>
        <a href='#'>
          <img src={bananas} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className='card'>
        <h3>PWA Boilerplate</h3>
        <p>Cache all the things!!</p>

        <p>{isPwa ? 'PWA' : 'Browser'}</p>
        <b>Installation status: {installationStatus}</b>
        <p>Text: {JSON.stringify(app)}</p>
      </div>
    </div>
  );
}

export default App;
