
//protect function
exports.protect = async (req, res, next) => {
  try {
    if (!req.cookies.username) {
      throw new Error("Cookies expired");
    }
    next();
  } catch (err) {
    res.status(400).json(err.message);
  }
};

exports.setCookie = async (req, res, next) => {
  try {
    const { username } = req.body;
    res.cookie('username', username, { maxAge: 900000, httpOnly: true });
    res.send('Cookie has been set');
  } catch (err) {
    res.status(400).json(err.message);
  }
};

exports.getCookies = async (req, res, next) => {
  try {
    console.log('Cookies: ', req.cookies);
    res.send(req.cookies);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

exports.clearCookie = async (req, res, next) => {
  try {
    res.clearCookie('username');
    res.send('Cookie has been cleared');
  } catch (err) {
    res.status(400).json(err.message);
  }
};