/**
 * GizGoat Backend — Full E2E Test Suite (Part 14)
 * Menguji seluruh flow dari register hingga dashboard.
 * Jalankan: node test-e2e.js
 */

const BASE = 'http://localhost:3001/api';

// Utility
const post = (url, body, token) => fetch(`${BASE}${url}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  body: JSON.stringify(body),
}).then(r => r.json());

const get = (url, token) => fetch(`${BASE}${url}`, {
  headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
}).then(r => r.json());

const del = (url, token) => fetch(`${BASE}${url}`, {
  method: 'DELETE',
  headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
}).then(r => r.status === 204 ? { status: 204 } : r.json());

const put = (url, body, token) => fetch(`${BASE}${url}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  body: JSON.stringify(body),
}).then(r => r.json());

let passed = 0;
let failed = 0;

function assert(label, condition, detail = '') {
  if (condition) {
    console.log(`  ✅ PASS: ${label}`);
    passed++;
  } else {
    console.log(`  ❌ FAIL: ${label}${detail ? ' → ' + detail : ''}`);
    failed++;
  }
}

async function run() {
  console.log('\n════════════════════════════════════════════');
  console.log('  GizGoat E2E Test Suite — Part 14');
  console.log('════════════════════════════════════════════\n');

  // ─────────────────────────────────────────────────────────
  // 1. REGISTER → LOGIN → FULL FLOW
  // ─────────────────────────────────────────────────────────
  console.log('📦 [1] Full Happy Path Flow');

  const testEmail = `e2e_test_${Date.now()}@gizgoat.com`;
  const testPassword = 'TestPass123!';

  // Register
  const reg = await post('/auth/register', { email: testEmail, password: testPassword, name: 'E2E Tester' });
  assert('Register berhasil → dapat token', reg.token, JSON.stringify(reg));
  const regToken = reg.token;

  // Login
  const login = await post('/auth/login', { email: testEmail, password: testPassword });
  assert('Login berhasil → dapat token', login.token, JSON.stringify(login));
  const token = login.token;

  // Update Profile
  const profileUpdate = await put('/users/profile', {
    name: 'E2E Tester Updated',
    age: 25, gender: 'male', height: 170, weight: 65,
    occupation: 'office_worker', dailyStepsTarget: 8000,
    activityLevel: 'moderate',
  }, token);
  assert('Update profil berhasil', profileUpdate.name === 'E2E Tester Updated', JSON.stringify(profileUpdate));

  // Get Profile
  const profile = await get('/users/profile', token);
  assert('Get profil → data lengkap', profile.age === 25 && profile.gender === 'male', JSON.stringify(profile));

  // BMI
  const bmi = await post('/health/bmi', { weight: 65, height: 170 }, token);
  assert('Hitung BMI berhasil', bmi.bmi && bmi.category, JSON.stringify(bmi));

  // BMI History
  const bmiHist = await get('/health/bmi/history', token);
  assert('BMI history tersedia', Array.isArray(bmiHist.data), JSON.stringify(bmiHist));

  // Calories log
  const today = new Date().toISOString().split('T')[0];
  const cal = await post('/health/calories', {
    foodName: 'Test Nasi Goreng', calories: 550, mealType: 'lunch', date: today
  }, token);
  assert('Log kalori berhasil', cal.id && cal.calories === 550, JSON.stringify(cal));

  // Get calories hari ini
  const calList = await get(`/health/calories?date=${today}`, token);
  assert('Get kalori hari ini', Array.isArray(calList.meals) && calList.meals.length >= 1, JSON.stringify(calList));

  // Sleep
  const sleep = await post('/health/sleep', {
    bedTime: '2026-06-01T23:00:00.000Z',
    wakeTime: '2026-06-02T06:30:00.000Z',
    qualityRating: 4,
    date: today,
  }, token);
  assert('Log tidur berhasil', sleep.sleepDuration === 7.5, JSON.stringify(sleep));

  // Sleep History
  const sleepHist = await get('/health/sleep/history?days=7', token);
  assert('Sleep history tersedia', Array.isArray(sleepHist.data), JSON.stringify(sleepHist));

  // Activity
  const activity = await post('/health/activity', {
    steps: 8500, activityType: 'jogging', duration: 45, date: today
  }, token);
  assert('Log aktivitas berhasil → dapat steps & kalori', activity.steps === 8500 && activity.caloriesBurned > 0, JSON.stringify(activity));

  // Activity today
  const actToday = await get(`/health/activity?date=${today}`, token);
  assert('Get aktivitas hari ini', actToday.totalSteps >= 8500, JSON.stringify(actToday));

  // Activity history
  const actHist = await get('/health/activity/history?days=7', token);
  assert('Activity history tersedia', Array.isArray(actHist.data), JSON.stringify(actHist));

  // Recommendations
  const recs = await get('/recommendations', token);
  assert('Rekomendasi berhasil → healthScore ada', typeof recs.healthScore === 'number', JSON.stringify(recs));
  assert('Zone valid', ['Optimal', 'Stabil', 'Berisiko'].includes(recs.zone), `zone=${recs.zone}`);

  // Dashboard
  const dash = await get('/dashboard', token);
  assert('Dashboard berhasil → user.name ada', dash.user?.name === 'E2E Tester Updated', JSON.stringify(dash?.user));
  assert('Dashboard weeklyTrend ada 7 entries', Array.isArray(dash.weeklyTrend) && dash.weeklyTrend.length === 7, `length=${dash.weeklyTrend?.length}`);
  assert('Dashboard today.bmi.value > 0', dash.today?.bmi?.value > 0, JSON.stringify(dash?.today?.bmi));

  // ─────────────────────────────────────────────────────────
  // 2. ERROR CASES
  // ─────────────────────────────────────────────────────────
  console.log('\n📦 [2] Error & Edge Cases');

  // Login wrong password
  const wrongPass = await post('/auth/login', { email: testEmail, password: 'wrongpassword' });
  assert('Login password salah → 401/error', wrongPass.message || wrongPass.error, JSON.stringify(wrongPass));

  // Duplicate register
  const dupReg = await post('/auth/register', { email: testEmail, password: testPassword, name: 'Dup' });
  assert('Register email duplikat → error', dupReg.message || dupReg.error, JSON.stringify(dupReg));

  // Invalid/no token
  const noToken = await get('/users/profile');
  assert('Tanpa token → 401', noToken.message || noToken.error, JSON.stringify(noToken));

  // Expired/invalid token
  const fakeToken = await get('/dashboard', 'Bearer fake.token.xyz');
  assert('Token fake → error', fakeToken.message || fakeToken.error, JSON.stringify(fakeToken));

  // Zod Validation: BMI invalid
  const badBmi = await post('/health/bmi', { weight: 'abc', height: -5 }, token);
  assert('Validasi BMI gagal → error detail', badBmi.issues || badBmi.message, JSON.stringify(badBmi));

  // Zod Validation: Calorie missing fields
  const badCal = await post('/health/calories', { date: today }, token);
  assert('Validasi kalori gagal → issues ada', badCal.issues || badCal.message, JSON.stringify(badCal));

  // Sleep invalid type
  const badSleep = await post('/health/sleep', { bedTime: 'invalid', wakeTime: '2026-06-01T06:00:00Z', qualityRating: 4, date: today }, token);
  assert('Validasi sleep invalid time → error', badSleep.issues || badSleep.message, JSON.stringify(badSleep));

  // Activity invalid enum
  const badActivity = await post('/health/activity', { steps: 1000, activityType: 'flying', duration: 30, date: today }, token);
  assert('Validasi activity invalid type → error', badActivity.issues || badActivity.message, JSON.stringify(badActivity));

  // Edge: calorie query tanpa date
  const noDate = await get('/health/calories', token);
  assert('Kalori tanpa date query → error', noDate.message, JSON.stringify(noDate));

  // Activity query tanpa date
  const actNoDate = await get('/health/activity', token);
  assert('Activity tanpa date query → error', actNoDate.message, JSON.stringify(actNoDate));

  // ─────────────────────────────────────────────────────────
  // 3. CASCADE DELETE
  // ─────────────────────────────────────────────────────────
  console.log('\n📦 [3] Cascade Delete');

  // Cascade delete — kita perlu password dalam body
  const delFetch = await fetch(`${BASE}/users/account`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ password: testPassword }),
  });
  const deleteRes = delFetch.status === 204 ? { status: 204 } : await delFetch.json();
  assert('Delete akun berhasil → 204 atau message ok', deleteRes.status === 204 || deleteRes.message, JSON.stringify(deleteRes));

  // Setelah delete, akun tidak bisa login lagi
  const afterDelete = await post('/auth/login', { email: testEmail, password: testPassword });
  assert('Login setelah hapus akun → error', afterDelete.message || afterDelete.error, JSON.stringify(afterDelete));

  // ─────────────────────────────────────────────────────────
  // SUMMARY
  // ─────────────────────────────────────────────────────────
  console.log('\n════════════════════════════════════════════');
  console.log(`  Hasil: ${passed} passed, ${failed} failed`);
  console.log('════════════════════════════════════════════\n');

  if (failed > 0) process.exit(1);
}

run().catch(err => {
  console.error('❌ Test runner crashed:', err);
  process.exit(1);
});
