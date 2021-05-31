const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const bcrypt = require('bcryptjs')

require("../models/Usuarios")
const Usuarios = mongoose.model("usuarios")

router.get("/registro", (req, res) => {
    res.render("usuarios/registro")
})


router.post("/registro", (req, res) => {
    //validações
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "Email inválido"})
    }

    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "Senha inválido"})
    }

    if(req.body.senha.length < 4){
        erros.push({texto: "Senha curta"})
    }

    if (req.body.senha != req.body.senha2)
        erros.push({texto: "Senhas não conferem"})

    if(erros.length > 0) {

        res.render("/usuarios/registro", {erros: erros} )

    }else {
        Usuarios.findOne({email: req.body.email}).lean().then((usuario) => {
            if(usuario) {
                req.flash("error_msg", "Já existe uma conta com este e-mail")
                req.redirect("/usuarios/registro")
            }else {
                
                const novoUsuario = new Usuarios({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })
                //Hash a senha
                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if(erro) {
                            req.flash("error_msg", "Houve um erro ao salvar usuario")
                            res.redirect('/')
                        }

                        novoUsuario.senha = hash
                        novoUsuario.save().then(() => {
                            req.flash("success_msg", "Usuario cadastrado com sucesso")
                            res.redirect("/")
                        }).catch ((err) => {
                            req.flash("error_msg", "Houve um erro ao criar usuario, tente novamente")
                            res.redirect('/usuarios/registro')
                        })
                    })
                })

            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/")
        })
    }
})

//login
router.get("/login", (req, res) => {
    res.render("usuarios/login")
})

module.exports = router