const mongoose = require('mongoose')
const Schema = mongoose.Schema


const Postagem = new Schema ({
    titulo: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    conteudo: {
        type: String, 
        required: true
    },
    //relacionando id do model Categoria com esse campo categoria
    categoria: {
        type: Schema.Types.ObjectId, //armazena um id do do model categorias
        ref: "categorias", //model de referencia
        required: true
    },
    data: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model("postagens", Postagem)