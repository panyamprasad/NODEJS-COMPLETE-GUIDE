//We can handle the error and make the try catch block we can use this.
const asyncHandler = require("express-async-handler");

//import the contacts models
const Contact = require("../models/contactModel");

//@Des Get All Contacts
//@Route Get/api/contacts
//@access public
const getContacts = asyncHandler(async (req, res) => {
  const contact = await Contact.find();
  res.status(200).json({ contact });
});

//@Des Create All Contact
const createContact = asyncHandler(async (req, res) => {
  console.log("The request body :", req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All Fields are required...!");
  }
  const contact = await Contact.create({
    name,
    email,
    phone,
  });
  res.status(200).json({ contact });
});

//@Des get Contact
const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json({ contact });
});

//@Des Update Contact
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found..!");
  }
  const updateContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json({ message: `Update contact for ${req.params.id}...!` });
});

//@Des Delete Contact
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found..!");
  }
  await contact.remove();
  res.json({ contact });
});

module.exports = {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
};
