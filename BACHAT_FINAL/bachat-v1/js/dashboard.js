document.addEventListener('DOMContentLoaded', function () {

  const totalExpensesDiv = document.getElementById('total-expenses');
  const balanceSummaryDiv = document.getElementById('balance-summary');
  const expenseHistoryDiv = document.getElementById('expense-history');

  const remindersListDiv = document.getElementById('reminders-list');

  const groups = getLocalData('groups', []);
  const expenses = getLocalData('expenses', []);

  const groupedExpenses = {};
  expenses.forEach(exp => {
    if (!groupedExpenses[exp.group]) {
      groupedExpenses[exp.group] = [];
    }
    groupedExpenses[exp.group].push(exp);
  });


  function calculateBalances(members, groupExpenses) {
    const balances = {};
    members.forEach(m => balances[m] = { paid: 0, owed: 0, net: 0 });

    groupExpenses.forEach(exp => {
      exp.involved.forEach(mem => balances[mem].owed += exp.splitAmount);
      balances[exp.paidBy].paid += exp.amount;
    });

    members.forEach(m => {
      balances[m].net = +(balances[m].paid - balances[m].owed).toFixed(2);
    });

    return balances;
  }

 
  if (totalExpensesDiv) {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    totalExpensesDiv.innerHTML = `
      <h2>Overall Summary</h2>
      <p><strong>Total Expenses:</strong> ₹${total.toFixed(2)}</p>
      <p><strong>Total Groups:</strong> ${groups.length}</p>
      <p><strong>Total Transactions:</strong> ${expenses.length}</p>
    `;
  }

 
  if (balanceSummaryDiv) {
    let html = `<h2>Group Breakdown</h2>`;

    groups.forEach(group => {
      const groupExp = groupedExpenses[group.name] || [];
      const total = groupExp.reduce((sum, e) => sum + e.amount, 0);
      const balances = calculateBalances(group.members, groupExp);

      html += `
        <div class="card">
          <h3>${group.name}</h3>
          <p><strong>Total:</strong> ₹${total.toFixed(2)}</p>
          <p><strong>Members:</strong> ${group.members.join(', ')}</p>
          <p><strong>Expenses:</strong> ${groupExp.length}</p>
      `;

      html += `<table style="width:100%;margin-top:1rem;">`;
      html += `<tr><th>Member</th><th>Net Balance</th></tr>`;

      group.members.forEach(m => {
        html += `
          <tr>
            <td>${m}</td>
            <td style="color:${balances[m].net >= 0 ? 'green' : '#e74c3c'}">
              ₹${balances[m].net.toFixed(2)}
            </td>
          </tr>
        `;
      });

      html += `</table></div>`;
    });

    balanceSummaryDiv.innerHTML = html;
  }


  if (balanceSummaryDiv) {

   
    let maxGroup = null;
    let maxAmount = 0;

    groups.forEach(group => {
      const total = (groupedExpenses[group.name] || [])
        .reduce((sum, e) => sum + e.amount, 0);

      if (total > maxAmount) {
        maxAmount = total;
        maxGroup = group.name;
      }
    });


    const spending = {};
    expenses.forEach(e => {
      spending[e.paidBy] = (spending[e.paidBy] || 0) + e.amount;
    });

    const topSpender = Object.keys(spending).length
      ? Object.keys(spending).reduce((a, b) =>
          spending[a] > spending[b] ? a : b
        )
      : "N/A";

    const insightDiv = document.createElement('div');
    insightDiv.className = 'card';
    insightDiv.innerHTML = `
      <h2>Insights</h2>
      <p><strong>Most Expensive Group:</strong> ${maxGroup || 'N/A'} (₹${maxAmount.toFixed(2)})</p>
      <p><strong>Top Spender:</strong> ${topSpender}</p>
    `;

    balanceSummaryDiv.appendChild(insightDiv);
  }

  if (expenseHistoryDiv) {
    if (expenses.length === 0) {
      expenseHistoryDiv.innerHTML = '<p>No expenses added yet.</p>';
    } else {
      expenseHistoryDiv.innerHTML = '';
      expenses.slice().reverse().forEach(exp => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
          <strong>${exp.title}</strong>
          <span style="float:right;">₹${exp.amount.toFixed(2)}</span><br>
          <small>${new Date(exp.date).toLocaleString()}</small><br>
          <span>Group: ${exp.group}</span><br>
          <span>Category: ${exp.category}</span><br>
          <span>Paid by: ${exp.paidBy}</span><br>
          <span>Split among: ${exp.involved.join(', ')}</span>
        `;
        expenseHistoryDiv.appendChild(div);
      });
    }
  }

  if (remindersListDiv) {
    const user = getLocalData('user', { name: '' });
    remindersListDiv.innerHTML = '';

    if (!user.name) {
      remindersListDiv.innerHTML = '<p>Please set your name first.</p>';
      return;
    }

    let hasReminders = false;

    groups.forEach(group => {
      if (!group.members.includes(user.name)) return;

      const groupExp = groupedExpenses[group.name] || [];
      const balances = calculateBalances(group.members, groupExp);

      if (balances[user.name].net < 0) {
        hasReminders = true;

        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
          You owe ₹${(-balances[user.name].net).toFixed(2)} in <strong>${group.name}</strong>
        `;
        remindersListDiv.appendChild(div);
      }
    });

    if (!hasReminders) {
      remindersListDiv.innerHTML = '<p>No pending settlements 🎉</p>';
    }
  }

});