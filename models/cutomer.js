var mongoose=require('mongoose');
var customerSchema = new mongoose.Schema({
    name:String,
    problem:String,
    created:{type:Date, default: Date.now}
})
module.exports=mongoose.model('cusomer',customerSchema);