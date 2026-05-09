

document.addEventListener('DOMContentLoaded', function () {

  const groupsListDiv = document.getElementById('groups-list');

function renderGroups() {
  if (!groupsListDiv) return;

  const groups = getLocalData('groups', []);

  groupsListDiv.innerHTML = '';

  if (groups.length === 0) {
    groupsListDiv.textContent = 'No groups created yet.';
    return;
  }

  groups.forEach(group => {
    const div = document.createElement('div');
    div.classList.add('card');

    const membersHTML = group.members.map(m => `<span>${m}</span>`).join(', ');

    div.innerHTML = `
      <h3>${group.name}</h3>
      <p><strong>Members:</strong> ${membersHTML}</p>
    `;

    groupsListDiv.appendChild(div);
  });
}

 
const addMemberBtn = document.getElementById('add-member-btn');
const memberInput = document.getElementById('member-name');
const membersList = document.getElementById('members-list');
const groupForm = document.getElementById('group-form');
const groupMsg = document.getElementById('group-form-msg');

let members = [];

if (addMemberBtn) {

 
  addMemberBtn.addEventListener('click', function () {
    const name = memberInput.value.trim();

    if (!name) return;

    if (members.includes(name)) {
      groupMsg.textContent = 'Member already added!';
      return;
    }

    members.push(name);

    const div = document.createElement('div');
    div.textContent = name;
    membersList.appendChild(div);

    memberInput.value = '';
    groupMsg.textContent = '';
  });

  
  groupForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const groupName = document.getElementById('group-name').value.trim();

    if (!groupName || members.length === 0) {
      groupMsg.textContent = 'Enter group name and members.';
      return;
    }

    const groups = getLocalData('groups', []);

    groups.push({
      name: groupName,
      members: members
    });

    setLocalData('groups', groups);

renderGroups(); 

    groupMsg.textContent = 'Group created!';
    groupForm.reset();
    membersList.innerHTML = '';
    members = [];
  });
}
    
    const userForm = document.getElementById('user-form');
    const userNameInput = document.getElementById('user-name');
    const userMsg = document.getElementById('user-msg');
    if (userForm && userNameInput) {
      // Load if already set
      const saved = getLocalData('user', { name: '' });
      if (saved.name) userNameInput.value = saved.name;
      userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = userNameInput.value.trim();
        if (!name) {
          userMsg.textContent = 'Please enter your name.';
          return;
        }
        setLocalData('user', { name });
        userMsg.textContent = 'Name saved!';
        setTimeout(() => userMsg.textContent = '', 2000);
      });
    }
 
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    if (window.location.pathname.endsWith(link.getAttribute('href'))) {
      link.classList.add('active');
    }
  });

  
  const tips = [
    "Track every expense, no matter how small!",
    "Settle balances regularly to avoid confusion.",
    "Review your spending categories every week.",
    "Save first, spend later!",
    "Discuss expenses openly with your group.",
    "Use BACHAT to avoid awkward money talks.",
    "Plan group budgets before trips.",
    "Keep receipts for big expenses.",
    "Analyze your spending patterns monthly.",
    "Aaj Bachat Kari? Start today!"
  ];
  const tipDiv = document.getElementById('tip-of-day');
  if (tipDiv) {
    const tipIndex = new Date().getDate() % tips.length;
    tipDiv.textContent = tips[tipIndex];
  }
  renderGroups();
});


function getLocalData(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}


function setLocalData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    
  }
}
