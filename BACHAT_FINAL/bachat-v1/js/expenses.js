
const expenseForm = document.getElementById('expense-form');

if (expenseForm) {

  const groupSelect = document.getElementById('expense-group');
  const paidBySelect = document.getElementById('paid-by');
  const membersCheckboxesDiv = document.getElementById('members-checkboxes');
  const expenseFormMsg = document.getElementById('expense-form-msg');

  const groups = getLocalData('groups', []);

  groupSelect.innerHTML = '';

  if (!groups || groups.length === 0) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = 'No groups available';
    groupSelect.appendChild(opt);
  } else {
    groups.forEach(g => {
      const opt = document.createElement('option');
      opt.value = g.name;
      opt.textContent = g.name;
      groupSelect.appendChild(opt);
    });
  }

 
  function loadGroupData(groupName) {
    const group = groups.find(g => g.name === groupName);
    if (!group) return;

    const groupMembers = group.members;

   
    paidBySelect.innerHTML = '';
    groupMembers.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m;
      paidBySelect.appendChild(opt);
    });

    
    membersCheckboxesDiv.innerHTML = '';
    groupMembers.forEach(m => {
      const label = document.createElement('label');
      label.style.marginRight = '1rem';

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.value = m;
      cb.checked = true;

      label.appendChild(cb);
      label.appendChild(document.createTextNode(' ' + m));
      membersCheckboxesDiv.appendChild(label);
    });
  }


  if (groups.length > 0) {
    loadGroupData(groups[0].name);
  }

 
  groupSelect.addEventListener('change', function () {
    loadGroupData(this.value);
  });

  
  expenseForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('expense-title').value.trim();
    const amountStr = document.getElementById('expense-amount').value.trim();
    const currency = document.getElementById('expense-currency').value;
    const category = document.getElementById('expense-category').value;
    const paidBy = paidBySelect.value;
    const involved = Array.from(
      membersCheckboxesDiv.querySelectorAll('input:checked')
    ).map(cb => cb.value);

    if (!title || !amountStr || !category || !paidBy || involved.length === 0) {
      expenseFormMsg.textContent = 'Fill all fields properly.';
      return;
    }

    const amount = parseFloat(amountStr);
    const splitAmount = +(amount / involved.length).toFixed(2);
    const selectedGroup = groupSelect.value;

    const expenses = getLocalData('expenses', []);

    expenses.push({
      title,
      amount,
      currency,
      category,
      paidBy,
      involved,
      splitAmount,
      date: new Date().toISOString(),
      group: selectedGroup
    });

    setLocalData('expenses', expenses);

    expenseFormMsg.textContent = 'Expense added!';
    expenseForm.reset();

    setTimeout(() => expenseFormMsg.textContent = '', 2000);
  });
}