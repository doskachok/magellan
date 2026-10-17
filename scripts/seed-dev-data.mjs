// Seeds a local WiseSplit API with demo users, groups and expenses for UI development.
// Usage: node scripts/seed-dev-data.mjs [apiBaseUrl]   (default http://localhost:5236/)
// Sign in afterwards as `alicedemo` / `Password1` (all demo users share that password).

const BASE_URL = process.argv[2] ?? 'http://localhost:5236/';
const PASSWORD = 'Password1';
const USERS = [
  { username: 'alicedemo', email: 'alice@demo.test', name: 'Alice Novak' },
  { username: 'bobdemo', email: 'bob@demo.test', name: 'Bob Carter' },
  { username: 'caroldemo', email: 'carol@demo.test', name: 'Carol Diaz' },
  { username: 'davedemo', email: 'dave@demo.test', name: 'Dave Kim' },
  // In no group yet: someone to replace the placeholder "Eve" with.
  { username: 'erindemo', email: 'erin@demo.test', name: 'Erin Walsh' },
];

const SplitMethod = { AssignedAmount: 0, Percentage: 1, Equal: 2 };

const request = async (path, { token, method = 'GET', body } = {}) => {
  const response = await fetch(new URL(path, BASE_URL), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`${method} ${path} -> ${response.status}: ${text}`);
  return text ? JSON.parse(text) : null;
};

const signIn = (login) => request('users/authorize', { method: 'POST', body: { login, password: PASSWORD } });

const daysAgo = (days) => new Date(Date.now() - days * 86_400_000).toISOString();

const sessions = {};
for (const user of USERS) {
  try {
    await request('users', {
      method: 'POST',
      body: { username: user.username, email: user.email, password: PASSWORD, passwordConfirmation: PASSWORD },
    });
  } catch (error) {
    if (!String(error).includes('already in use')) throw error;
  }
  const auth = await signIn(user.username);
  sessions[user.username] = auth;
  await request('users', { token: auth.token, method: 'PUT', body: { id: auth.id, name: user.name } });
}

const alice = sessions.alicedemo;
const ids = Object.fromEntries(Object.entries(sessions).map(([name, auth]) => [name, auth.id]));

const createGroup = async (name, currencyCode, members) => {
  const group = await request('transaction-groups', { token: alice.token, method: 'POST', body: { name, currencyCode } });
  for (const member of members) {
    await request(`transaction-groups/${group.id}/participants`, {
      token: alice.token,
      method: 'POST',
      body: { userId: ids[member] },
    });
  }
  return group;
};

const addExpense = (groupId, currencyCode, name, days, payers, participants, splitMethod = SplitMethod.Equal, { note, token = alice.token } = {}) =>
  request('transactions', {
    token,
    method: 'POST',
    body: {
      groupId,
      name,
      currencyCode,
      note,
      paymentDateUtc: daysAgo(days),
      payerDetails: Object.entries(payers).map(([user, amount]) => ({ payerId: ids[user], amount })),
      partialsAssignments: Object.entries(participants).map(([user, partialAmount]) => ({
        userId: ids[user],
        partialAmount,
        splitMethod,
      })),
    },
  });

const everyone = { alicedemo: 0, bobdemo: 0, caroldemo: 0, davedemo: 0 };

const trip = await createGroup('Lisbon trip', 'EUR', ['bobdemo', 'caroldemo', 'davedemo']);
await addExpense(trip.id, 'EUR', 'Airbnb', 6, { alicedemo: 640 }, everyone);
await addExpense(trip.id, 'EUR', 'Dinner at Time Out Market', 5, { bobdemo: 96.4 }, everyone);
await addExpense(trip.id, 'EUR', 'Tram 28 tickets', 5, { caroldemo: 24 }, { alicedemo: 0, caroldemo: 0, davedemo: 0 });
await addExpense(trip.id, 'EUR', 'Sintra day tour', 4, { alicedemo: 180 },
  { alicedemo: 45, bobdemo: 45, caroldemo: 60, davedemo: 30 }, SplitMethod.AssignedAmount,
  { note: 'Carol took the palace tickets too; Dave skipped lunch.' });
const duplicate = await addExpense(trip.id, 'EUR', 'Taxi to airport', 0, { bobdemo: 32 }, everyone);
await request(`transactions/${duplicate.id}`, { token: alice.token, method: 'DELETE' });
await request(`transaction-groups/${trip.id}/settlements`, {
  token: alice.token,
  method: 'POST',
  body: { debtorId: ids.bobdemo, lenderId: ids.alicedemo, amount: 50, currencyCode: 'EUR' },
});
await addExpense(trip.id, 'EUR', 'Pastéis de nata', 1, { davedemo: 14.5 }, everyone);

const flat = await createGroup('Flat 4B', 'UAH', ['bobdemo']);
await addExpense(flat.id, 'UAH', 'Electricity — September', 12, { bobdemo: 1840 }, { alicedemo: 0, bobdemo: 0 });
await addExpense(flat.id, 'UAH', 'Groceries', 3, { alicedemo: 2310.75 }, { alicedemo: 50, bobdemo: 50 }, SplitMethod.Percentage);

const eve = await request(`transaction-groups/${flat.id}/placeholders`, { token: alice.token, method: 'POST', body: { name: 'Eve' } });
ids.eve = eve.id;
await addExpense(flat.id, 'UAH', 'Internet', 2, { alicedemo: 450 }, { alicedemo: 0, bobdemo: 0, eve: 0 });

// Dave settles up and leaves, so his expense stays in the history but can't be changed any more.
const ski = await createGroup('Ski weekend', 'EUR', ['davedemo']);
await addExpense(ski.id, 'EUR', 'Lift passes', 9, { davedemo: 50 }, { alicedemo: 0, davedemo: 0 });
await request(`transaction-groups/${ski.id}/settlements`, {
  token: alice.token,
  method: 'POST',
  body: { debtorId: ids.alicedemo, lenderId: ids.davedemo, amount: 25, currencyCode: 'EUR' },
});
await request(`transaction-groups/${ski.id}/leave`, { token: sessions.davedemo.token, method: 'POST', body: {} });

const games = await createGroup('Board games night', 'USD', ['caroldemo']);
await request(`transaction-groups/${games.id}/archive`, { token: alice.token, method: 'POST' });

console.log('Seeded. Sign in as alicedemo / Password1');
