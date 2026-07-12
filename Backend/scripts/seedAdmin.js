const dotenv = require("dotenv");
const mongoose = require("mongoose");
const adminModel = require("../src/models/user.Adminmodel");

dotenv.config();

const adminData = {
  firstname: process.env.ADMIN_FIRSTNAME || "System",
  lastname: process.env.ADMIN_LASTNAME || "Admin",
  email: process.env.ADMIN_EMAIL || "admin@ems.local",
  password: process.env.ADMIN_PASSWORD || "Admin@12345"
};

async function seedAdmin() {
  if (!process.env.DB_CONNECT) {
    throw new Error("DB_CONNECT is missing in Backend/.env");
  }

  await mongoose.connect(process.env.DB_CONNECT);

  const existingAdmin = await adminModel.findOne({ email: adminData.email });
  if (existingAdmin) {
    console.log(`Admin already exists: ${adminData.email}`);
    return;
  }

  const hashedPassword = await adminModel.hashPassword(adminData.password);
  await adminModel.create({
    fullname: {
      firstname: adminData.firstname,
      lastname: adminData.lastname
    },
    email: adminData.email,
    password: hashedPassword
  });

  console.log("Admin created successfully");
  console.log(`Email: ${adminData.email}`);
  console.log(`Password: ${adminData.password}`);
}

seedAdmin()
  .catch((error) => {
    console.error("Failed to seed admin:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
