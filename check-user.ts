import connect from "./lib/db";
import User from "./models/User";

async function check() {
    await connect();
    const admin = await User.findOne({ email: "admin@system.com" });
    if (admin) {
        console.log("ADMIN_EXISTS");
    } else {
        console.log("ADMIN_MISSING");
    }
    process.exit(0);
}

check().catch(err => {
    console.error("ERROR: " + err.message);
    process.exit(1);
});
