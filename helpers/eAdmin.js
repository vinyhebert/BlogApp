module.exports = {
    eAdmin: function(req, res, next){
        if(req.isAuthenticated() && req.user.eAdmin == 1){
            console.log(req.user)
            return next();
        }

        req.flash("error_msg", "Opção exclusiva para administradores")
        res.redirect("/")
    }
}