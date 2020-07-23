const express     =require('express');
     app        =express();
    bodyParser  =require('body-parser');
    mongoose    =require('mongoose');
    nodemailer  =require('nodemailer');
    methodOverride=require('method-override');
    passport    =require('passport');
    LocalStrategy=require('passport-local');
    user=require('./models/user');
    customer=require('./models/cutomer');
    
    
mongoose.set('useCreateIndex', true);//(node:11068) DeprecationWarning:
mongoose.connect(":mongodb://localhost/mobiledb", {useNewUrlParser: true, useUnifiedTopology: true });//connects to database



app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname +('/public')));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');

//passport configuration
app.use(require('express-session')({
    secret:'mask fatta',
    resave:false,
    saveUninitialized:false
}));
//passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.get('/',function(req,res){
    res.render('home.ejs');
});
app.get('/confirmation',function(req,res){
    res.render('confirmation');
})

app.get('/sathi',isLoggedIn,function(req,res){
    //get customer from db
    customer.find({},function(err,customer){
        if(err){
            console.log(err);
        }else{
             //show it in the sathi page
            res.render('sathi',{friends:customer});
        }
    });
    //show it in the sathi page
   
});
app.post('/sathiNaya',function(req,res){//create--------------
    var name=req.body.name;
    var p=req.body.problem;
    var e=req.body.email;
    var nc={name:name, problem:p}
    customer.create(nc,function(err,cutomer){
        if(err){
            console.log(err);
        }else{
            res.redirect("/confirmation");
        }
    })


    // //body for nodemailer
    // async function main() {
    //     // Generate test SMTP service account from ethereal.email
    //     // Only needed if you don't have a real mail account for testing
      
    //     // create reusable transporter object using the default SMTP transport
    //     let transporter = nodemailer.createTransport({
    //       host: "smtp.ethereal.email",
    //       port: 587,
    //       secure: false, // true for 465, false for other ports
    //       auth: {
    //         user: "hunter.zemlak61@ethereal.email ", // generated ethereal user
    //         pass: 'Sp3yzzsaYGavSRBtTz', // generated ethereal password
    //       },
    //     });
      
    //     // send mail with defined transport object
    //     let info = await transporter.sendMail({
    //       from: '"Fred Foo 👻" <foo@example.com>', // sender address
    //       to: e, // list of receivers
    //       subject: 'test', // Subject line
    //       text: "please click the imagined link to verify your account ...link.." // plain text body
    //       // html body
    //     });
      
    //     console.log("Message sent: %s", info.messageId);
    //     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      
    //     // Preview only available when sending through an Ethereal account
    //     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    //     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    //   }
      
    //   main().catch(console.error);
});

app.delete('/delet/:id',isLoggedIn,function(req,res){
    customer.findByIdAndDelete(req.params.id,function(err){
        console.log(req.params.id)
        if(err){
            console.log(err);
        }else{
            console.log('succesfully deleted');
            res.redirect('back');
        }
    })
});

app.get('/register',function(req,res){
    res.render('register');
});
app.post('/register',function(req,res){
    user.register(new user({username:req.body.username}),req.body.password, function(err,user){
        if(err){
            console.log(err);
            return res.redirect('/register');
        }passport.authenticate('local')(req,res,function(){
            res.redirect('/sathi');
        })
    })
});
app.get('/login',function(req,res){
    res.render('login');
})
app.post('/login',passport.authenticate('local',{//middleware passport.authenticate will compare the input with the registeres user in the database.
    successRedirect: '/sathi',
    failureRedirect: '/login'
}),function(req,res){
});
app.get('/logout',function(req,res){
    req.logout();
    res.redirect('/');
})
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }res.redirect('/login');
}
//facebook login
// window.fbAsyncInit = function() {
//     FB.init({
//       appId      : '2709738269305443',
//       cookie     : true,
//       xfbml      : true,
//       version    : 'v1'
//     });
      
//     FB.AppEvents.logPageView();   
      
//   };

//   (function(d, s, id){
//      var js, fjs = d.getElementsByTagName(s)[0];
//      if (d.getElementById(id)) {return;}
//      js = d.createElement(s); js.id = id;
//      js.src = "https://connect.facebook.net/en_US/sdk.js";
//      fjs.parentNode.insertBefore(js, fjs);
//    }(document, 'script', 'facebook-jssdk'));

app.listen(3000,function(req,res){
    console.log('server is listening');
});
