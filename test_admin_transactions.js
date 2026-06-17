const BASE_URL = 'http://localhost:8080/api';

async function runAdminTest() {
    try {
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                loginType: "EMAIL_PASSWORD",
                email: "admin@truckmitra.com",
                password: "Admin@123"
            })
        });
        const loginData = await loginRes.json();
        if (!loginData.success) {
             console.log("Admin login failed!", loginData);
             return;
        }
        
        const adminToken = loginData.data.token;
        console.log("Admin logged in!");

        const transRes = await fetch(`${BASE_URL}/admin/transactions`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const transData = await transRes.json();
        console.log("Admin Transactions Response:", transRes.status, transData);
    } catch (e) {
        console.error("Test Failed:", e);
    }
}

runAdminTest();
