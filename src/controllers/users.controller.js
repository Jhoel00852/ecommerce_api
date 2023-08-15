// const Users = require('../models/users.models');
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Users, Cars } = require("../models");
const { sendConfirmEmail, sendWelcomeEmail } = require("../utils/sendMail");

const createUser = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    const hashed = await bcrypt.hash(password, 10);
    const user = await Users.create({ username, email, password: hashed });
    
   
    res.status(201).end();
    
    sendConfirmEmail(email, "Confirm email", { username, email, id: user.id });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ where: { email, validEmail: true } });

    if (!user) {
      return next({
        status: 400,
        errorName: "Invalid credentials",
        error: "incorrect email / password or confirm email",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return next({
        status: 400,
        errorName: "Invalid credentials",
        error: "incorrect email / password",
      });
    }

    // generar un token
    const {
      id,
      username,
      firstname,
      role,
      lastname,
      profileImage,
      validEmail,
      createdAt,
      updatedAt,
    } = user;

    const token = jwt.sign(
      { id, username, email, firstname, lastname, role },
      process.env.JWT_SECRET,
      { algorithm: "HS512", expiresIn: "2h" }
    );

    res.json({
      id,
      username,
      email,
      firstname,
      lastname,
      profileImage,
      validEmail,
      createdAt,
      updatedAt,
      token,
    });
  } catch (error) {
    next(error);
  }
};

const confirmEmail = async (req, res, next) => {
  try {
    const { token } = req.query;

    const decoded = jwt.verify(token, process.env.JWT_CONFIRM_SECRET, {
      algorithms: "HS512",
    });
    // { username, email, id }
    await Users.update({ validEmail: true }, { where: { id: decoded.id } });
    await Cars.create({ userId: decoded.id })
    res.status(201).json({msg: "Confirmation correct!"});
    sendWelcomeEmail(decoded.email, `Welcome ${decoded.username}`, decoded.username)
  } catch (error) {
    next(error);
  }
};

const uploadProfileImage = async(req, res, next) =>  {
  try {
   
    const {file, body} = req;
    // let url = "hola"
    // validamos para subir imagen
 
      const url = process.env.NODE_ENV === 'production' ? `${process.env.URL}/public/images/${file.filename}` :
      `${process.env.URL}:${process.env.PORT}/public/images/${file.filename}`
      //const url = `http://localhost:9000/public/images/${file.filename}`;
      const result = await Users.update({profileImage : url}, {where : {id: Number(body.id)} })
   
      result[0] === "0" || result[0] === 0  ? 
      res.json({msg: "User no exist, verified id!"}) : 
      res.json({msg : "Update correct!"})

    
  } catch (error) {
    next(error)
  }
}

//firsname, lastname, password
const updateUser = async (req, res, next) => {
  try {
    const {id} = req.params;
    console.log(req.body.password)
    // const {firstname, lastname} = req.body;
    let result = "";
    if (!req.body.password ) {
       
        result = await Users.update(req.body, {
          where: {id}
        });
        result[0] === "0" || result[0] === 0  ? 
        res.json({msg: "User no exist, verified id!"}) : 
        res.json({msg: "Update correct!"})
    }

    if (req.body.password) {

      const hashed = await bcrypt.hash(req.body.password, 10);
      result = await Users.update({password: hashed}, {
        where: {id}
      });
      result[0] === "0" || result[0] === 0  ? 
      res.json({msg : "User no exist, verified id!"}) : 
      res.json({msg: "Change password correct!"})
    }
    
  } catch (error) {
    next(error)
  }
  
}

module.exports = {
  createUser,
  loginUser,
  confirmEmail,
  uploadProfileImage,
  updateUser
};

// protegiendo endpoints -> autenticando peticiones
