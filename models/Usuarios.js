const mongoose = require ('mongoose')
const Schema = mongoose.Schema


const Usuario = new Schema({
    usuario: {
        type: String,
        require:true
    },
    email: {
        type: String,
        require: true
    },
    eAdmin: {           //é pra definir se usuario é admin ou não (0 não adm / 1 é adm)
        type: Number,
        default: 0
    }, 
    senha: {
        type: String,
        require: true
    }
})
    
mongoose.model("usuarios", Usuario)