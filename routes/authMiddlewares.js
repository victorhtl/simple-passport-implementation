module.exports.isAuth = (req, res, next)=>{
    if(req.isAuthenticated()){
        next();
    } else {
        res.status(400).json({msg: 'User is not authenticated'})
    }
}

module.exports.isAdmin = (req, res, next)=>{
    if(req.isAuthenticated() && req.user.admin){
        next();
    } else {
        res.status(400).json({msg: 'User is not authorized'})
    }
}