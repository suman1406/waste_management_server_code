const { db } = require('../connection');

const fs = require('fs');

module.exports = {
    test: async (req, res) => {
        res.send('Hello World');
    }
};