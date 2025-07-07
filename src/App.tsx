import { useEffect, useState } from 'react';

function App() {
  const [status, setStatus] = useState('Loading...');
  useEffect(() => {
    fetch('https://api.ask-allie.com/api/health')
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(() => setStatus('Error connecting to backend'));
  }, []);
  return <div>Backend status: {status}</div>;
}

export default App;
