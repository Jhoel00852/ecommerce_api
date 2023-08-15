const path = require("path");
const ejs = require("ejs");
const transporter = require("./mailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const sendMail = (email, subject, template, attachments) => {
  transporter.sendMail({
    to: email,
    subject,
    html: template,
    attachments,
  });
};

// ! para confirmar el correo enviamos la url del front y un token
// localhost:5173/?token=aldkñjfhlkadsñjfalsdkfjlsad

const sendConfirmEmail = async (email,subject, data) => {
  // obtener la ruta del template
  const templatePath = path.join(__dirname, "../views/welcome/welcome.ejs");
  // obtener la fecha
  // generar un arreglo con el nombre de los 12 meses en español con js ?
  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  const date = new Date();
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.getMonth();
  // renderizar el template

  // generar los archivos adjuntos
  const basePath = "../views/welcome/images/";

  const attachments = [
    {
      filename: "_logo.png",
      path: path.join(__dirname, "../views/welcome/images/_logo.png"),
      cid: "logo",
    },
    {
      filename: "contacts_no-bg.gif",
      path: path.join(__dirname, basePath, "contacts_no-bg.gif"),
      cid: "contacts",
    },

  ];

  // genrar un token
  const token = jwt.sign(data, process.env.JWT_CONFIRM_SECRET, {
    algorithm: "HS512",
    expiresIn: "2h",
  });

  //generar url
  const url = process.env.NODE_ENV === 'production' ? `${process.env.URL}/confirm-email` :
  `${process.env.URL}:${process.env.PORT}/confirm-email`;

  const template = await ejs.renderFile(templatePath, {
    ...data,
    date: `${day} ${months[month]} ${year}`, // 3 agosto 2023
    url,
    token,
  });
  sendMail(email, subject, template, attachments);
};

const sendWelcomeEmail = async (email,subject, data) => {
  const templatePath = path.join(__dirname, "../views/welcome/welcomeEmail.ejs");

  const template = await ejs.renderFile(templatePath)
  const attachments = [
    {
      filename: "_logo.png",
      path: path.join(__dirname, "../views/welcome/images/_logo.png"),
      cid: "logo",
    }
  ];
  sendMail(email,subject, template, attachments)
}

const sendOrderEmail = async (emails, subject, data) => {
  const templatePath = path.join(__dirname, "../views/welcome/orderEmail.ejs");
  const attachments = [
    {
      filename: "_logo.png",
      path: path.join(__dirname, "../views/welcome/images/_logo.png"),
      cid: "logo",
    }
  ]
  const { fullname, email, orderId, total, productDetail} = data
  const template = await ejs.renderFile(templatePath, {
    fullname,
    email,
    orderId,
    total,
    productDetail,
  });
  // console.log(...data)
  sendMail(emails, subject, template, attachments)
}

module.exports = {
  sendConfirmEmail,
  sendWelcomeEmail,
  sendOrderEmail
};
