// DOM Elements
const oddsButtons = document.querySelectorAll('.odds-btn');
const betSlipItems = document.getElementById('bet-slip-items');
const betSlipEmpty = document.getElementById('bet-slip-empty');
const betSlipSummary = document.getElementById('bet-slip-summary');
const betCount = document.getElementById('bet-count');
const totalOddsElement = document.getElementById('total-odds');
const stakeInput = document.getElementById('stake-amount');
const potentialWinningsElement = document.getElementById('potential-winnings');
const placeBetBtn = document.getElementById('place-bet-btn');
const clearSlipBtn = document.getElementById('clear-slip-btn');
const betSuccessModal = document.getElementById('bet-success-modal');
const addFundsModal = document.getElementById('add-funds-modal');
const addFundsBtn = document.getElementById('add-funds');
const modalOkBtn = document.getElementById('modal-ok-btn');
const closeModalButtons = document.querySelectorAll('.close-modal');
const fundsOptions = document.querySelectorAll('.funds-option');
const confirmFundsBtn = document.getElementById('confirm-funds-btn');
const customFundsInput = document.getElementById('custom-funds');
const userBalanceElement = document.getElementById('user-balance');

// App State
let userBalance = 1000;
let betSlip = [];
let selectedBets = new Set();

// Initialize the app
function init() {
    // Load user balance from localStorage if available
    const savedBalance = localStorage.getItem('userBalance');
    if (savedBalance) {
        userBalance = parseFloat(savedBalance);
        updateBalanceDisplay();
    }
    
    // Create placeholder team logos
    createPlaceholderLogos();
    
    // Add event listeners
    addEventListeners();
}

// Create placeholder logos for teams
function createPlaceholderLogos() {
    const teamLogos = document.querySelectorAll('.team-logo');
    teamLogos.forEach((logo, index) => {
        // Check if the image exists, if not create a placeholder
        logo.onerror = function() {
            const teamName = logo.closest('.team').querySelector('.team-name').textContent;
            logo.outerHTML = `<div class="team-logo">${teamName.charAt(0)}</div>`;
        };
    });
}

// Add event listeners
function addEventListeners() {
    // Odds buttons
    oddsButtons.forEach(button => {
        button.addEventListener('click', handleOddsClick);
    });
    
    // Stake input
    stakeInput.addEventListener('input', updatePotentialWinnings);
    
    // Place bet button
    placeBetBtn.addEventListener('click', placeBet);
    
    // Clear slip button
    clearSlipBtn.addEventListener('click', clearBetSlip);
    
    // Modal OK button
    modalOkBtn.addEventListener('click', () => {
        betSuccessModal.style.display = 'none';
    });
    
    // Add funds button
    addFundsBtn.addEventListener('click', () => {
        addFundsModal.style.display = 'flex';
    });
    
    // Close modal buttons
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            betSuccessModal.style.display = 'none';
            addFundsModal.style.display = 'none';
        });
    });
    
    // Funds options
    fundsOptions.forEach(option => {
        option.addEventListener('click', () => {
            fundsOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            customFundsInput.value = option.dataset.amount;
        });
    });
    
    // Confirm funds button
    confirmFundsBtn.addEventListener('click', addFunds);
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === betSuccessModal) {
            betSuccessModal.style.display = 'none';
        }
        if (e.target === addFundsModal) {
            addFundsModal.style.display = 'none';
        }
    });
}

// Handle odds button click
function handleOddsClick(e) {
    const button = e.currentTarget;
    const matchCard = button.closest('.match-card');
    const matchTime = matchCard.querySelector('.match-time').textContent;
    const teams = matchCard.querySelectorAll('.team-name');
    const homeTeam = teams[0].textContent;
    const awayTeam = teams[1].textContent;
    const selection = button.dataset.team;
    const odds = parseFloat(button.dataset.odds);
    const betId = `${homeTeam}-${awayTeam}-${selection}`;
    
    // Check if bet is already in slip
    if (selectedBets.has(betId)) {
        // Remove bet
        selectedBets.delete(betId);
        betSlip = betSlip.filter(bet => bet.id !== betId);
        button.classList.remove('selected');
    } else {
        // Add bet
        selectedBets.add(betId);
        betSlip.push({
            id: betId,
            homeTeam,
            awayTeam,
            selection,
            odds,
            matchTime
        });
        
        // Deselect other odds buttons in the same match
        const siblingButtons = matchCard.querySelectorAll('.odds-btn');
        siblingButtons.forEach(btn => {
            if (btn !== button) {
                const btnId = `${homeTeam}-${awayTeam}-${btn.dataset.team}`;
                if (selectedBets.has(btnId)) {
                    selectedBets.delete(btnId);
                    betSlip = betSlip.filter(bet => bet.id !== btnId);
                    btn.classList.remove('selected');
                }
            }
        });
        
        button.classList.add('selected');
    }
    
    updateBetSlip();
}

// Update bet slip display
function updateBetSlip() {
    betCount.textContent = betSlip.length;
    
    if (betSlip.length === 0) {
        betSlipEmpty.style.display = 'flex';
        betSlipSummary.style.display = 'none';
        betSlipItems.innerHTML = '';
        return;
    }
    
    betSlipEmpty.style.display = 'none';
    betSlipSummary.style.display = 'block';
    
    // Render bet items
    betSlipItems.innerHTML = '';
    betSlip.forEach(bet => {
        const betItem = document.createElement('div');
        betItem.className = 'bet-item';
        betItem.innerHTML = `
            <div class="bet-item-header">
                <div class="bet-item-type">Match Winner</div>
                <div class="bet-item-time">${bet.matchTime}</div>
            </div>
            <div class="bet-item-teams">${bet.homeTeam} vs ${bet.awayTeam}</div>
            <div class="bet-item-selection">
                <div>${bet.selection}</div>
                <div class="bet-item-odds">${bet.odds.toFixed(2)}</div>
            </div>
            <button class="remove-bet" data-id="${bet.id}">×</button>
        `;
        
        betSlipItems.appendChild(betItem);
        
        // Add event listener to remove button
        const removeBtn = betItem.querySelector('.remove-bet');
        removeBtn.addEventListener('click', () => {
            selectedBets.delete(bet.id);
            betSlip = betSlip.filter(b => b.id !== bet.id);
            
            // Deselect the corresponding odds button
            document.querySelectorAll('.odds-btn').forEach(button => {
                if (button.dataset.team === bet.selection) {
                    const matchCard = button.closest('.match-card');
                    if (matchCard) {
                        const teams = matchCard.querySelectorAll('.team-name');
                        if (teams[0].textContent === bet.homeTeam && teams[1].textContent === bet.awayTeam) {
                            button.classList.remove('selected');
                        }
                    }
                }
            });
            
            updateBetSlip();
        });
    });
    
    // Calculate total odds
    const totalOdds = calculateTotalOdds();
    totalOddsElement.textContent = totalOdds.toFixed(2);
    
    // Update potential winnings
    updatePotentialWinnings();
}

// Calculate total odds
function calculateTotalOdds() {
    if (betSlip.length === 0) return 0;
    
    // For a parlay bet (accumulator), multiply all odds
    return betSlip.reduce((total, bet) => total * bet.odds, 1);
}

// Update potential winnings
function updatePotentialWinnings() {
    const stake = parseFloat(stakeInput.value) || 0;
    const totalOdds = calculateTotalOdds();
    const winnings = stake * totalOdds;
    
    potentialWinningsElement.textContent = `$${winnings.toFixed(2)}`;
}

// Place bet
function placeBet() {
    if (betSlip.length === 0) return;
    
    const stake = parseFloat(stakeInput.value) || 0;
    
    // Check if user has enough balance
    if (stake > userBalance) {
        alert('Insufficient balance. Please add more funds.');
        return;
    }
    
    // Deduct stake from balance
    userBalance -= stake;
    updateBalanceDisplay();
    
    // Show success modal
    document.getElementById('modal-stake').textContent = `$${stake.toFixed(2)}`;
    document.getElementById('modal-winnings').textContent = potentialWinningsElement.textContent;
    betSuccessModal.style.display = 'flex';
    
    // Clear bet slip
    clearBetSlip();
    
    // Save balance to localStorage
    localStorage.setItem('userBalance', userBalance.toString());
}

// Clear bet slip
function clearBetSlip() {
    betSlip = [];
    selectedBets.clear();
    
    // Deselect all odds buttons
    document.querySelectorAll('.odds-btn').forEach(button => {
        button.classList.remove('selected');
    });
    
    updateBetSlip();
}

// Add funds
function addFunds() {
    const amount = parseFloat(customFundsInput.value) || 0;
    
    if (amount <= 0 || amount > 10000) {
        alert('Please enter a valid amount between $1 and $10,000');
        return;
    }
    
    userBalance += amount;
    updateBalanceDisplay();
    
    // Close modal
    addFundsModal.style.display = 'none';
    
    // Save balance to localStorage
    localStorage.setItem('userBalance', userBalance.toString());
}

// Update balance display
function updateBalanceDisplay() {
    userBalanceElement.textContent = userBalance.toFixed(2);
}

// Initialize the app
init();