const { sequelize, User } = require('./models');
const bcrypt = require('bcrypt');

async function createAdmin() {
    await User.destroy({ where: { username: 'admin' } }); // add this to remove existing
  await sequelize.sync();

  const existing = await User.findOne({ where: { username: 'admin' } });
  if (!existing) {
    //const hashed = await bcrypt.hash('adminpass', 10);
    await User.create({
      name: 'Admin User',
      username: 'admin',
      password: 'adminpass',
      role: 'admin'
    });
    console.log('Admin user created!');
  } else {
    console.log('Admin user already exists.');
  }

  process.exit();
}

createAdmin();
