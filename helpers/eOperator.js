module.exports = {
    eOperator: function(req, res, next){
        if(req.isAuthenticated()){
            return next()
        }

        req.flash("error_msg", "Necessário o Login")
        res.redirect("usuarios/login")
    }
}