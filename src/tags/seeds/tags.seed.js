require('dotenv/config');
const Tag = require('../tags.model');
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
    const tags = [];

    try {
        const tagsData = await readFile('./src/tags/seeds/tags.json');
        for (const currentTag of tagsData) {
            tags.push({
                name: currentTag.name,
                color: currentTag.color,
            });
        }

        return tags;
    } catch (error) {
        throw Error(error);
    }
}

async function seedTags() {
    try {
        await startDatabase();
        const tags = await treatData();
        await Tag.insertMany(tags);
        console.log("Tags criadas");
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

seedTags();