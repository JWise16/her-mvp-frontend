import { useEffect, useState } from 'react';

function App() {
  const [status, setStatus] = useState('Loading...');
  useEffect(() => {
    fetch('http://ec2-54-193-232-18.us-west-1.compute.amazonaws.com:3000/api/health')
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(() => setStatus('Error connecting to backend'));
  }, []);
  return <div>Backend status: {status}</div>;
}

export default App;
