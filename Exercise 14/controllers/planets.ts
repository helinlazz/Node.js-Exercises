import { Request, Response } from "express";
import Joi from "joi";
import multer from "multer";
import path from "path";
import pgPromise from "pg-promise";

const db = pgPromise()("postgres://postgres:110010@localhost:5432/database");

const setupDB = async () => {
    await db.none(`
        DROP TABLE IF EXISTS planets;
    
        CREATE TABLE planets (
            id SERIAL NOT NULL PRIMARY KEY,
            name TEXT NOT NULL,
            image TEXT
        );
    `);

    await db.none(`INSERT INTO planets (name) VALUES ('Earth')`);
    await db.none(`INSERT INTO planets (name) VALUES ('Mars')`);
};

setupDB();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext); 
    },
});

const upload = multer({ storage: storage });

const getAll = async (req: Request, res: Response) => {
    const planets = await db.many(`SELECT * FROM planets;`);
    res.status(200).json(planets);
};

const getOneById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const planet = await db.oneOrNone(`SELECT * FROM planets WHERE id=$1;`, Number(id));
    res.status(200).json(planet);
};

const planetSchema = Joi.object({
    name: Joi.string().required(),
});

const create = async (req: Request, res: Response) => {
    const { name } = req.body;
    const newPlanet = { name };
    const validatedNewPlanet = planetSchema.validate(newPlanet);

    if (validatedNewPlanet.error) {
        return res.status(400).json({ msg: validatedNewPlanet.error.details[0].message });
    } else {
        await db.none(`INSERT INTO planets (name) VALUES($1)`, name);
        res.status(201).json({ msg: "Il pianeta è stato creato." });
    }
};

const updateById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;

    await db.none(`UPDATE planets SET name=$2 WHERE id=$1`, [Number(id), name]);

    res.status(200).json({ msg: "Il pianeta è stato aggiornato." });
};

const deleteById = async (req: Request, res: Response) => {
    const { id } = req.params;
    await db.none(`DELETE FROM planets WHERE id=$1`, Number(id));

    res.status(200).json({ msg: "Il pianeta è stato eliminato." });
};

const uploadImage = async (req: Request, res: Response) => {
    const { id } = req.params;

    upload.single('image')(req, res, async function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const imagePath = req.file.path;

        try {
            await db.none(`UPDATE planets SET image=$2 WHERE id=$1`, [Number(id), imagePath]);
            res.status(200).json({ msg: "Immagine caricata con successo." });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};

export {
    getAll, getOneById, create, updateById, deleteById, uploadImage
};
