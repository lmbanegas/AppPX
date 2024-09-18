function userValidation(req, res, next) {
    console.log('User in session:', req.session.user);

    if (req.session.user === "liclg") {
        next();
    } else {
        res.redirect('/login')
    }
}
module.exports = userValidation;