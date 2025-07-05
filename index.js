const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const bcrypt = require('bcrypt');
const { sequelize, User } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  store: new SQLiteStore(),
  secret: 'mySecretKey123',
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') {
    req.session.flash = 'Access denied';
    return res.redirect('/');
  }
  next();
}

app.get('/', async (req, res) => {
  const users = await User.findAll();
  res.render('index', { users });
});

app.get('/admin', requireAdmin, async (req, res) => {
  const users = await User.findAll();
  res.render('admin', { users });
});

app.post('/add', requireAdmin, async (req, res) => {
  const { name, username, password, role } = req.body;
  if (name && username && password && role) {
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, username, password: hashed, role });
    req.session.flash = 'User added successfully';
  }
  res.redirect('/admin');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { name, username, password } = req.body;
  try {
    await User.create({ name, username, password, role: 'user' });
    req.session.flash = 'Registered successfully';
    res.redirect('/login');
  } catch (err) {
    res.send('Registration error: ' + err.message);
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });

  console.log("Login attempt for:", username);
  if (!user) {
    console.log("User not found");
    return res.send('Login failed: Invalid credentials.');
  }

  console.log("stored password", user.password);
  //console.log("user entered (hashed)", password, await bcrypt.hash('adminpass', 10));
  console.log("user entered:", password);
  const isMatch = await bcrypt.compare(password, user.password);
  console.log("🔐 Password match:", isMatch);

  if (isMatch) {
    req.session.user = { id: user.id, name: user.name, username: user.username, role: user.role };
    req.session.flash = 'Logged in successfully';
    res.redirect('/');
  } else {
    res.send('Login failed: Invalid credentials.');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

app.post('/users/:id/delete', requireAdmin, async (req, res) => {
  const id = req.params.id;
  await User.destroy({ where: { id } });
  req.session.flash = 'User deleted';
  res.redirect('/admin');
});

app.get('/users/:id/edit', requireAdmin, async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.send('User not found');
  res.render('edit', { user });
});

app.post('/users/:id/edit', requireAdmin, async (req, res) => {
  const { name, username, role } = req.body;
  await User.update({ name, username, role }, { where: { id: req.params.id } });
  req.session.flash = 'User updated successfully';
  res.redirect('/admin');
});

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
