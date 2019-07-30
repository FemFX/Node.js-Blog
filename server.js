const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');
const dotenv     = require('dotenv');
const cors       = require('cors'); 
const ejs        = require('ejs');
const flash      = require('connect-flash');
const session = require('express-session');


//Routes  
const indexRoutes   = require('./routes'); 
const postRoutes    = require('./routes/post');

//ENV Setup 
dotenv.config()

//Middleware
app.use(cors());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(session({
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : false
})) 
app.use(flash()); 

require('./config/passport')(app)

app.use((req,res,next) => {
    res.locals.currentUser = req.user
    res.locals.error = req.flash('error')
    res.locals.success = req.flash('success')  
    next()
})



//Routes
app.use('/', indexRoutes);
app.use('/post', postRoutes);

//Connect to db
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser : true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err))


app.listen(process.env.PORT, () => console.log(`Server started on ${process.env.PORT}`));