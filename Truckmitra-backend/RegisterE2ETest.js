const fetch = require('node-fetch'); // Assuming fetch is available globally in Node 18+

async function run() {
    const data = {
        fullName: "Snehal E2E",
        mobile: "8888888881",
        email: "snehal.e2e@example.com",
        password: "password123",
        role: "DRIVER",
        preferredLoginType: "EMAIL_PASSWORD",
        vehicleNumber: "MH05YZ1111",
        vehicleCapacity: "15 Tons",
        preferredVehicleType: "TRUCK"
    };

    try {
        const res = await fetch('http://localhost:8080/api/drivers/register-sub-driver?transporterId=39', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const text = await res.text();
        console.log("Status:", res.status);
        console.log("Response:", text);

        if (res.status === 200) {
            // Get the driver's vehicle mapping
            const parsed = JSON.parse(text);
            const driverId = parsed.data?.id; // Assumes ApiResponse returns the driver
            if (driverId) {
                const getRes = await fetch(`http://localhost:8080/api/vehicles/driver/${driverId}`);
                const getText = await getRes.text();
                console.log("Vehicles mapped to driver:", getText);
            }
        }
    } catch(e) {
        console.error("Error:", e);
    }
}

run();
