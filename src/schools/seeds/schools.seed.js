require('dotenv/config');
const School = require('../schools.model');
const mongoose = require('mongoose');
const fs = require('fs');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agnes';

async function readFile(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, async function (err, data) {
        if (err) {
          reject(err);
        }
        resolve(JSON.parse(data));
      });
    });
}

async function treatData() {
    const schools = [];

    try {
        const schoolData = await readFile('./src/schools/seeds/schools.json');
        for (const currentSchool of schoolData) {
            schools.push({
                name: currentSchool.name,
                address: currentSchool.address || 'Endereço não encontrado',
                location: currentSchool.location,
                grade: 0.0,
            });
        }

        return schools;
    } catch (error) {
        throw Error(error);
    }
}

async function seedSchools() {
    try {
        await startDatabase();
        const schools = await treatData();
        await School.insertMany(schools);
        console.log("Escolas criadas");
        process.exit();
    } catch (error) {
        throw Error(error);
    }
}

async function startDatabase() {
    mongoose.connection.on('connected', () => {
        console.log('MongoDB connected');
    });
    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
    });

    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

seedSchools();