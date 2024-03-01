const { db } = require('../connection');

const fs = require('fs');

module.exports = {
    test: async (req, res) => {
        res.status(200).send('Everything is working fine :)');
    }
};