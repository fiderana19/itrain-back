const authorize = (roles = []) => {
    if(typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        const userRole = req.user.role;

        if(!userRole || (roles.length > 0 && !roles.includes(userRole))) {
            return res.status(403).send({
                success: false,
                message: "Route non autorisés !"
            }) 
        }

        next();
    }
}

module.exports = authorize;