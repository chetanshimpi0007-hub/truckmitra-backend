const BASE_URL = 'http://localhost:8080/api';

async function runWalletTest() {
    console.log("==========================================");
    console.log("STARTING WALLET API TEST");
    console.log("==========================================\n");

    try {
        // 1. Login with an existing user (we'll use the driver we just registered)
        console.log(`[1] Logging in as user`);
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                loginType: "EMAIL_PASSWORD",
                email: "shipper1781582800587@gmail.com", // Valid user from E2E test
                password: "Password123!"
            })
        });
        const loginData = await loginRes.json();
        if (!loginData.success) {
             console.log("Login failed!", loginData);
             return;
        }
        
        const userToken = loginData.data.token;
        console.log("✅ Step 1 Complete\n");

        // 2. Fetch Wallet Data
        console.log(`[2] Fetching wallet data`);
        const walletRes = await fetch(`${BASE_URL}/wallet/my`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${userToken}` }
        });
        const walletData = await walletRes.json();
        console.log("Wallet Response:", walletRes.status, walletData);
        if (!walletRes.ok) throw new Error("Failed to fetch wallet");
        console.log("✅ Step 2 Complete\n");

        // 3. Fetch Wallet Transactions
        console.log(`[3] Fetching wallet transactions`);
        const transRes = await fetch(`${BASE_URL}/wallet/my/transactions`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${userToken}` }
        });
        const transData = await transRes.json();
        console.log("Transactions Response:", transRes.status, transData);
        if (!transRes.ok) throw new Error("Failed to fetch transactions");
        console.log("✅ Step 3 Complete\n");

        console.log("==========================================");
        console.log("WALLET TEST COMPLETED SUCCESSFULLY");
        console.log("==========================================");

    } catch (e) {
        console.error("Test Failed:", e);
    }
}

runWalletTest();
