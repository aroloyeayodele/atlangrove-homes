
const usernameOriginal = 'Admin01';
const passwordOriginal = 'Atlangrove@2025#';
const usernameNew = 'admin2';
const passwordNew = 'password123';

const url = 'https://atlangrove.aroloyeayodele61.workers.dev/api/admin/login';

async function testLogin(user, pass) {
    console.log(`Testing login for ${user}...`);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass })
        });
        const data = await response.json();
        console.log(`Status: ${response.status}`);
        console.log(`Response:`, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(`Error testing ${user}:`, err.message);
    }
}

async function run() {
    await testLogin(usernameOriginal, passwordOriginal);
    console.log('---');
    await testLogin(usernameNew, passwordNew);
}

run();
