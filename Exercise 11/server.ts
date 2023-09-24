const express = require("express");
const expressAsync = require("express-async-errors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const joi = require("joi");
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan("dev"));

// Database
const planets = [
  {
    id: 1,
    name: "Earth",
  },
  {
    id: 2,
    name: "Mars",
  },
];

app.get("/api/planets", (req, res) => {
  res.status(200).json(planets);
  console.log(
    "Planet Names:",
    planets.map((planet) => planet.name)
  );
});

app.get("/api/planets/:id", (req, res) => {
  const { id } = req.params;
  const planet = planets.find((p) => p.id === Number(id));
  res.status(200).json(planet);
  console.log("Planet Name:", planet);
});

const planetSchema = joi.object({
  id: joi.number().integer().required(),
  name: joi.string().required(),
});

app.post("/api/planets", (req, res) => {
  const { id, name } = req.body;
  const newPlanet = { id, name };

  const validatedNewPlanet = planetSchema.validate(newPlanet);

  if (validatedNewPlanet.error) {
    res.status(400);
    res.json({ msg: validatedNewPlanet.error });
  } else {
    planets.push(newPlanet);
    res.status(201);
    res.json({ msg: "The planet was created." });
  }

  console.log(planets);
});

app.put("/api/planets/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  for (let i = 0; i < planets.length; i++) {
    if (planets[i].id === Number(id)) {
      planets[i].name = name;
      break;
    }
  }

  res.status(200).json({ msg: "Success! The planet is updated." });

  console.log(planets);
});

app.delete("/api/planets/:id", (req, res) => {
  const { id } = req.params;
  const index = planets.findIndex((p) => p.id === Number(id));

  if (index !== -1) {
    planets.splice(index, 1);
  }

  res.status(200).json({ msg: "Success! The planet is deleted." });
  console.log(planets);
});

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
});
