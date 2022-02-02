const Person = require('../models/person');
const router = require('express').Router();

// Create a person
router.post('/', async (request, response) => {
  const person = {
    name: request.body.name,
    approved: request.body.approved,
    salary: request.body.salary,
  };

  if (!person.name) {
    response.status(422).json({ message: 'Insert a valid name' });
    return;
  }

  try {
    await Person.create(person);
    response.status(201).json({ message: 'Person successfully included!' });
  } catch (error) {
    response.status(500).json(error.message);
  }

});

// Get all
router.get('/', async (request, response) => {
  try {
    const people = await Person.find();

    response.status(200).json(people)
  } catch (error) {
    response.status(500).json(error.message);
  }
});

// Get person
router.get('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const person = await Person.findOne({ _id: id });

    if (!person) {
      response.status(404).json({ message: 'Person not found' });
      return;
    }

    response.status(200).json(person);
  } catch (error) {
    response.status(500).json(error.message);
  }
});

// Update person
router.patch('/:id', async (request, response) => {
  const { id } = request.params;
  const person = {
    name: request.body.name,
    approved: request.body.approved,
    salary: request.body.salary,
  };

  try {
    const updatedPerson = await Person.updateOne({ _id: id }, person);

    if (!updatedPerson.matchedCount) {
      response.status(404).json({ message: 'Person not found' });
    }

    response.status(200).json(updatedPerson);

  } catch (error) {
    response.status(500).json(error.message);
  }
});

// Delete person
router.delete('/:id', async (request, response) => {
  const { id } = request.params;

  try {
    const person = await Person.findOne({ _id: id });

    if (!person) {
      response.status(404).json({ message: 'Person not found' });
      return;
    }

    await Person.deleteOne({ _id: id });

    response.status(200).json({ message: 'Person removed' });
  } catch (error) {
    response.status(500).json(error.message);
  }
});

module.exports = router;
