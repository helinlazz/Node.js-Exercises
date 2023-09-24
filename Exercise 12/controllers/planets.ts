const express = require("express");
const { Planet, Planets } = require("../server");

let planets = [
  {
    id: 1,
    name: "Earth",
  },
  {
    id: 2,
    name: "Mars",
  },
];

const getAll = (req, res) => {
  res.status(200).json(planets);
};

const getOneById = (req, res) => {
  const { id } = req.params;
  const planet = planets.find((p) => p.id === Number(id));

  if (planet) {
    res.status(200).json(planet);
  } else {
    res.status(404).json({ msg: `Planet with ID ${id} not found.` });
  }
};

const create = (req, res) => {
  const { id, name } = req.body;
  const newPlanet = { id, name };
  planets = [...planets, newPlanet];

  res.status(201).json({ msg: "Planet successfully created." });
};

const updateById = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  planets = planets.map((p) => (p.id === Number(id) ? { ...p, name } : p));

  res.status(200).json({ msg: "Planet updated successfully." });
};

const deleteById = (req, res) => {
  const { id } = req.params;
  planets = planets.filter((p) => p.id !== Number(id));

  res.status(200).json({ msg: "Planet deleted successfully." });
};

module.exports = {
  getAll,
  getOneById,
  create,
  updateById,
  deleteById,
};
