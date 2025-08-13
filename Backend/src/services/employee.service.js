const userModel = require('../models/user.Employeemodel');


module.exports.createUser = async ({
    firstname, lastname, email, password
}) => {
    if (!firstname || !email || !password) {
        throw new Error('All fields are required');
    }
    const user = userModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        status: 'pending',  // explicitly mark as pending until admin approves
    })

    return user;
}