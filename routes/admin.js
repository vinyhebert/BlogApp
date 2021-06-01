const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

require("../models/Categoria")
const Categoria = mongoose.model("categorias")


require("../models/Postagem")
const Postagem = mongoose.model("postagens")
const {eAdmin} = require("../helpers/eAdmin") //Dentro do objeto 'eAdmin' capturamos somente a função eAdmin, crinado uma variavel com esse nome



router.get("/post", eAdmin,(req, res)=> {
    res.send("Pagina de Post")
})

//Exibição de categorias criadas
router.get("/categorias", eAdmin,(req, res)=> {
    //Mostrando categorias
    Categoria.find().sort({date:'desc'}).lean().then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err)=> {
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.send('Erro ao trazer inormações da base de dados') //Linha modificada por mim
    })
    //Excluindo categorias
    Categoria.deleteOne({
        "nome": req.body.deleteOne})
    
})

//Categorias

//add categoria
router.get("/categorias/add", eAdmin, (req, res)=>{
    res.render("admin/addcategoria")
})
//edit categoria
router.post("/categoria/nova", eAdmin, (req, res)=> {

    var erros = [] //criado array vazio

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){ //Exclamação representa a condição de não envio
        erros.push({texto: "Nome invalido"}) //push para inserir dados no array
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"})
    }

    if(req.body.nome.length < 2){
        erros.push({texto: "Nome da categoria muito pequeno"})
    }

    if(erros.length > 0){
        res.render("admin/addcategoria", {erros: erros})
    
    } else {
         //Criando nv objeto
        const novaCategoria = {
            nome: req.body.nome, //.nome se refere ao nome da Tag html da pagina
            slug: req.body.slug //.slug também

        }
        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria Cadastrada com sucesso!") // passando msg, categoria cadastrada com sucesso para a variavel success_msg
            res.redirect("/admin/categorias") //após a adição será redirecionado
            console.log("Salvo com sucesso")
           
        }).catch((err)=> {
            req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente") // passando msg, houve um erro ao salvar....para a variavel error_msg
            res.redirect("/admin")
            console.log("Error")
        })
    }



})

// Trago dados para tela
router.get("/categorias/edit/:id",eAdmin, (req, res) =>{
    Categoria.findOne({_id:req.params.id}).lean().then((categoria) => {
        res.render('admin/editcategorias', {categoria: categoria})
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect("/admin/categorias")
    })
    
}) 
//edita dados do BD
router.post("/categoria/edit",eAdmin, (req, res)=> {
    Categoria.findOne({_id:req.body.id}).then((categoria)=>{
        
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(()=>{
            req.flash("success_msg", "Categoria editada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro interno ao salvar categoria")
            res.redirect("/admin/categorias")
        })

    }).catch((err) =>{
        req.flash("error_msg", "Houve um erro ao editar a categoria")
        res.redirect("/admin/categorias")
    })
})

//Deleta Categoiria
router.post("/categorias/deletar",eAdmin, (req, res) =>{
    Categoria.remove({_id: req.body.id}).then(() =>{
        req.flash('success_msg','Categoria deletada com sucesso!')
        res.redirect('/admin/categorias')
    }).catch((err)=>{
        req.flash('error_msg', 'Error ao deletar categoria')
        res.redirect('/admin/cateorias')
    })
})


//Posts

//Exibição das postagens criadas
router.get('/postagem',eAdmin, (req, res) => {
    //Com populate
    try {
        Postagem.find().populate('categoria').sort({data:'desc'}).lean().then((postagens) =>{ //populate 
            res.render("admin/postagem", {postagens: postagens})
        })
    
    }catch (err) {
        req.flash("error_msg", "Houve um erro ao listar as postagens")
        res.redirect("/admin")
    }

})

//Sem populate
/*   //Mostrando categorias
    Postagem.find().sort({data:'desc'}).lean().then((postagem) => {
        res.render("admin/postagem", {postagem: postagem})
    }).catch((err)=> {
        req.flash("error_msg", "Houve um erro ao listar Postagens")
        res.send('Erro ao trazer inormações da base de dados') //Linha modificada por mim
    })
    //Excluindo categorias
    Categoria.deleteOne({
        "nome": req.body.deleteOne})
    
}) */  

//Add Postagem
router.get("/postagem/add", eAdmin, (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("admin/addpostagem", { categorias:categorias })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulário")
        res.redirect("/admin")
    })
})

//Savar post
router.post("/postagem/nova", eAdmin,(req, res) => {

var erros = []

if(req.body.categoria == "0"){
    erros.push({texto: "Categoria Invalida, registre uma categoria"})
}

if(erros.length > 0) {
    res.render("admin/addpostagem", {erros: erros})
}else {
    const novaPostagem = {
        titulo:     req.body.titulo,
        slug:       req.body.slug,
        descricao:  req.body.descricao,
        conteudo:   req.body.conteudo,
        categoria:  req.body.categoria,
    }
    new Postagem(novaPostagem).save().then(() => {
        req.flash("success_msg", "Postagem Cadastrada com sucesso!")
        res.redirect("/admin/postagem")
        console.log("Postagem salva com sucesso")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao salvar a Postagem, tente novamente")
        res.redirect("/admin/postagem")
        console.log("Error ao salvar postagem")
    })
    }

    
})

// Trago dados para tela
router.get("/postagem/edit/:id", eAdmin,(req, res) =>{
    
    Postagem.findOne({_id:req.params.id}).lean().then((postagem) => {
        Categoria.find().lean().then((categorias) => {
            res.render("admin/editpostagem", {categorias:categorias, postagem:postagem})
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao carregar categorias")
            res.redirect("/admin/postagem")
        })
    }).catch((err) => {
        req.flash("error_msg", "Este Poste não existe")
        res.redirect("/admin/postagem")
    })
    
}) 



//edita dados do BD
router.post("/postagem/edit", eAdmin,(req, res)=> {

    Postagem.findOne({_id:req.body.id}).then((postagem)=>{
        
        postagem.titulo = req.body.titulo
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo
        postagem.categoria = req.body.categoria //??


        postagem.save().then(()=>{
            req.flash("success_msg", "Postagem editada com sucesso!")
            res.redirect("/admin/postagem")
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro interno ao salvar postagem")
            res.redirect("/admin/postagem")
        })

    }).catch((err) =>{
        console.log(err)
        req.flash("error_msg", "Houve um erro ao editar postagem")
        res.redirect("/admin/postagem")
    })
})
    

//Deleta Categoiria
router.post("/postagem/deletar",eAdmin, (req, res) =>{
    Postagem.remove({_id: req.body.id}).then(() =>{
        req.flash('success_msg','Postagem deletada com sucesso!')
        res.redirect('/admin/postagem')
    }).catch((err)=>{
        req.flash('error_msg', 'Error ao deletar Poste')
        res.redirect('/admin/postagem')
    })
})

module.exports = router