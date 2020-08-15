const mysql = require("mysql");

// Here we create a class Database
class Database {
    //
    constructor (config){
        this.config = mysql.createConnection(config);
    }
    query(sql, args){
        return new Promise( (resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if (err){
                    console.log(err.sql);
                    console.log("");
                    return reject( err);
                }
                resolve(rows);
            });
        });
    }

    end(){
        return new Promise((resolve, reject )=> {
            this.connection.end(err => {
                if (err)
                return reject(err);
                resolve();
            });
        });
    }
}
module.exports = Database;