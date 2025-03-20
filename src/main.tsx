
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Remove any potential badge elements that might be injected
const removeBadges = () => {
  const badges = document.querySelectorAll('[class*="lovable"], [class*="gpt"], [id*="lovable"], [id*="gpt"]');
  badges.forEach(badge => {
    if (badge.parentNode) {
      badge.parentNode.removeChild(badge);
    }
  });
};

// Run initial cleanup
removeBadges();

// Set interval to periodically check and remove any badges that might be added later
const badgeRemovalInterval = setInterval(removeBadges, 1000);

// Create and render the app
createRoot(document.getElementById("root")!).render(<App />);
