const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');   

 mongoose.connect('mongodb+srv://Shagunparmar:Pshagun@98@shagunparmar-ncum2.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser:true})
  .then( () => console.log('blog database connected...'))
 const schema = new mongoose.Schema({
   blog:{
     type: String,
     require:true,
     unique: true
   },
   date:{
     type:Date,
     default:Date.now
   }
})
    
 const loginSchema = new mongoose.Schema({
   username:{
     type: String,
     require:true
   },
   email:{
    type: String,
    require:true,
    unique: true
  },
   password:{
    type: String,
    require:true,
  },
   date:{
     type:Date,
     default:Date.now
   }
})

loginSchema.plugin(passportLocalMongoose);    

const Login = mongoose.model('login', loginSchema);
const blogs = mongoose.model('blog', schema);

module.exports = {blogs, Login};
