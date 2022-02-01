const Person = require('../models/person');
const router = require('express').Router();

router.post('/', async (request, response) => {
  const person = {
    name: request.body.name,
    approved: request.body.approved,
    salary: request.body.salary,
  };

  if (!person.name) {
    response.status(422).json({ message: 'Insert a valid name' });
  }

  try {
    await Person.create(person);
    response.status(201).json({ message: 'Person successfully included!' });
  } catch (error) {
    response.status(500).json({ error });
  }

});

module.exports = router;
