
let income = parseFloat(localStorage.getItem('income')) || 0;
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

fetch('currencies.php')
  .then(response => response.json())
  .then(data => {
    if (data.symbols) {
      const currencySelect = document.getElementById('currency-select');
      Object.entries(data.symbols).forEach(([code, details]) => {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = `${code} (${details.description})`;
        currencySelect.appendChild(option);
      });
    } else {
      console.error('Error fetching currencies:', data.error);
    }
  })
  .catch(error => console.error('Fetch error:', error));


function updateDisplay(currency) {
  document.querySelector('#income-display').textContent = `Monthly Income: ${currency} ${income.toFixed(2)}`;
  updateTransactions(currency);
  updateSummary(currency);
}


function updateTransactions(currency) {
  const transactionsContainer = document.getElementById('transactions-container');
  transactionsContainer.innerHTML = '';
  transactions.forEach((transaction, index) => {
    const transactionCard = document.createElement('div');
    transactionCard.classList.add('transaction-card');
    transactionCard.innerHTML = `
      <div>
        <strong>${transaction.description}</strong><br>
        <span>${currency}${transaction.amount.toFixed(2)}</span><br>
        <span>${transaction.date}</span>
      </div>
      <button onclick="deleteTransaction(${index})">❌</button>
    `;
    transactionsContainer.appendChild(transactionCard);
  });
}

function updateSummary(currency) {
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const savings = income - totalSpent;

  document.querySelector('#summary').innerHTML = `
    <strong>Total Income:</strong> ${currency}${income.toFixed(2)}<br>
    <strong>Total Spent:</strong> ${currency}${totalSpent.toFixed(2)}<br>
    <strong>Savings:</strong> ${currency}${savings.toFixed(2)}
  `;
}


document.getElementById('set-income').addEventListener('click', () => {
  const incomeInput = document.getElementById('income-input').value;
  if (incomeInput) {
    income = parseFloat(incomeInput);
    localStorage.setItem('income', income);
    const selectedCurrency = localStorage.getItem('currency') || '₹';
    updateDisplay(selectedCurrency);
    document.getElementById('income-input').value = '';
  } else {
    alert('Please enter a valid income amount.');
  }
});


document.getElementById('add-transaction').addEventListener('click', () => {
  const description = document.getElementById('description-input').value;
  const amount = parseFloat(document.getElementById('amount-input').value);
  const date = document.getElementById('date-input').value;

  if (description && amount && date) {
    transactions.push({ description, amount, date });
    localStorage.setItem('transactions', JSON.stringify(transactions));
    const selectedCurrency = localStorage.getItem('currency') || '₹';
    updateTransactions(selectedCurrency);
    updateSummary(selectedCurrency);


    document.getElementById('description-input').value = '';
    document.getElementById('amount-input').value = '';
    document.getElementById('date-input').value = '';
  } else {
    alert('Please fill out all transaction details.');
  }
});


function deleteTransaction(index) {
  transactions.splice(index, 1);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  const selectedCurrency = localStorage.getItem('currency') || '₹';
  updateTransactions(selectedCurrency);
  updateSummary(selectedCurrency);
}

document.addEventListener('DOMContentLoaded', () => {
  const currentMonth = new Date().getMonth();
  const lastVisitedMonth = parseInt(localStorage.getItem('lastVisitedMonth'), 10);

  if (lastVisitedMonth === undefined || lastVisitedMonth !== currentMonth) {

    showMonthlySummary();
    localStorage.setItem('lastVisitedMonth', currentMonth);
    resetMonthlyData();
  }


  updateDisplay(localStorage.getItem('currency') || '₹');
  updateTransactions(localStorage.getItem('currency') || '₹');
  updateSummary(localStorage.getItem('currency') || '₹');
});


function showMonthlySummary() {
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const savings = income - totalSpent;
}


function resetMonthlyData() {
  transactions = [];
  localStorage.setItem('transactions', JSON.stringify(transactions));
}


document.getElementById('clear-data').addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all data?')) {
    income = 0;
    transactions = [];
    localStorage.clear();
    const selectedCurrency = localStorage.getItem('currency') || '₹';
    updateDisplay(selectedCurrency);
    updateTransactions(selectedCurrency);
    updateSummary(selectedCurrency);
  }
});
