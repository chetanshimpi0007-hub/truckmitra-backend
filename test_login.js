async function test() {
    try {
        console.log("Attempting Login with praju@gmail.com...");
        let res = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                loginType: "EMAIL_PASSWORD",
                email: "praju@gmail.com",
                password: "Password123!" // I'm guessing this might not match if it's unknown. But let's see the error!
            })
        });
        let data = await res.json();
        console.log("Login Response praju@gmail.com:", res.status, data);

        console.log("Attempting Login with aarti@gmail.com...");
        res = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                loginType: "EMAIL_PASSWORD",
                email: "aarti@gmail.com",
                password: "Password123!" // Guess
            })
        });
        data = await res.json();
        console.log("Login Response aarti@gmail.com:", res.status, data);
        
    } catch (error) {
        console.error("Error:", error);
    }
}

test();
