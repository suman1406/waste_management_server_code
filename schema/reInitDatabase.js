const fs = require('fs');

function reInitDatabase(db){
    try {
        fs.readFile('./schema/data/data.sql', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
            }
            else {
                const quries = data.split(';')
                for(let i of quries){
                    if(i!=undefined && i!=null && i!=""){
                        db.query(i+";", (err, result) => {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log(`[MESSAGE]: Database Initialized Successfully.`);
                            }
                        });
                    }
                }
            }
        });
    } catch (err) {
        console.error(err);
    }
};


module.exports = reInitDatabase;