async function test() {
    try {
        const unique = Date.now().toString().slice(-6);
        const mobile = `9000${unique}`;
        const email = `test${unique}@gmail.com`;
        
        console.log(`Registering user with mobile: ${mobile}, email: ${email}`);
        
        let res = await fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName: "Test User",
                mobile: mobile,
                email: email,
                password: "Password123!",
                role: "DRIVER",
                preferredLoginType: "EMAIL_PASSWORD"
            })
        });
        let data = await res.json();
        console.log("Registration Response:", res.status, data);
        
        console.log("Attempting Login...");
        res = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                loginType: "EMAIL_PASSWORD",
                email: email,
                password: "Password123!"
            })
        });
        data = await res.json();
        console.log("Login Response:", res.status, data);
        
    } catch (error) {
        console.error("Error:", error);
    }
}

test();
