// src/api/health.ts
export async function fetchHealth() {
    const res = await fetch('https://api.ask-allie.com/api/health');
    if (!res.ok) throw new Error('Network error');
    return res.json();
  }
  