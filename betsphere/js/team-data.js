// Team data with names and actual team logo URLs
const teamData = {
  // Basketball teams
  "Lakers": {
    logoUrl: "https://a.espncdn.com/i/teamlogos/nba/500/lal.png",
    sport: "basketball"
  },
  "Warriors": {
    logoUrl: "https://a.espncdn.com/i/teamlogos/nba/500/gs.png",
    sport: "basketball"
  },
  
  // Football teams
  "Chiefs": {
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png",
    sport: "football"
  },
  "Eagles": {
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/phi.png",
    sport: "football"
  },
  
  // Baseball teams
  "Yankees": {
    logoUrl: "https://a.espncdn.com/i/teamlogos/mlb/500/nyy.png",
    sport: "baseball"
  },
  "Red Sox": {
    logoUrl: "https://a.espncdn.com/i/teamlogos/mlb/500/bos.png",
    sport: "baseball"
  },
  
  // Soccer teams
  "Arsenal": {
    logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/359.png",
    sport: "soccer"
  },
  "Chelsea": {
    logoUrl: "https://a.espncdn.com/i/teamlogos/soccer/500/363.png",
    sport: "soccer"
  }
};

// Function to update team logos
function updateTeamLogos() {
  // Get all team elements
  const teamElements = document.querySelectorAll('.team');
  
  teamElements.forEach(teamElement => {
    const teamNameElement = teamElement.querySelector('.team-name');
    if (!teamNameElement) return;
    
    const teamName = teamNameElement.textContent;
    const teamData = window.teamData[teamName];
    
    if (teamData) {
      const logoElement = teamElement.querySelector('.team-logo');
      if (logoElement) {
        logoElement.src = teamData.logoUrl;
        logoElement.alt = teamName + " logo";
        logoElement.style.backgroundColor = "transparent";
        logoElement.style.width = "60px";
        logoElement.style.height = "60px";
        logoElement.style.objectFit = "contain";
        logoElement.onerror = function() {
          // If image fails to load, create a fallback with first letter
          this.outerHTML = `<div class="team-logo">${teamName.charAt(0)}</div>`;
        };
      }
    }
  });
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', updateTeamLogos);