const config = {
    'host': 'localhost',
    'port': 5432,
    'user': 'postgres',
    'password': '',
    'database': 'expresstrips'
}

const pg = require('pg-promise')()
const db = pg(config)

const bcrypt = require('bcrypt')

function wrap(string){
    return '\'' + string + '\''
}

function createTable(tbName, colDescArr){
    return db.any('CREATE TABLE ' + tbName + ' ( ' + colDescArr.join(', ') + ' ) ;')
}

function checkDefaultTables(){
    db.any('SELECT * FROM users;')
    .then(after => {
        console.log('> PostgreSQL connected and user table okay.')
    })
    .catch(err => 
        createTable('users', [
            'ID SERIAL PRIMARY KEY',
            'username VARCHAR(20) NOT NULL',
            'email VARCHAR(255) NOT NULL',
            'pswd VARCHAR(255) NOT NULL'
        ]).then(console.log('> PostgreSQL connected and user table created.')).catch(err => setTimeout(checkDefaultTables,2000)))
    db.any('SELECT * FROM trips;')
    .then(after => {
        console.log('> PostgreSQL trip table okay.')
    })
    .catch(err => 
        createTable('trips', [
            'id SERIAL PRIMARY KEY',
            'uid INTEGER NOT NULL',
            'location VARCHAR(50) NOT NULL',
            'datestart DATE NOT NULL',
            'dateend DATE',
            'imageurl TEXT',
            'details TEXT'
        ]).then(console.log('> PostgreSQL trips table created.')).catch(err => setTimeout(checkDefaultTables,2000)))
}

function insertNewData(tbName,colArr,valArr){
    return db.any('INSERT INTO ' + tbName + '(' + colArr.join(', ') + ')' + ' VALUES ' + ' ( ' + valArr.join(', ') + ' ) ')
}

function updateData(tbName,colArr,valArr,filColArr,filArr){
    let comm = 'UPDATE ' + tbName + ' SET'
    if(colArr.length == 1){
        comm += ' ' + colArr[0] + ' = ' + valArr[0] + ' '
    }
    else{
        for(let i = 0;i < colArr.length;i++){
            comm += ' ' + colArr[i] + ' = ' + valArr[i]
            if(i < colArr.length - 1){
                comm += ', '
            }
        }
    }
    comm += 'WHERE'
    if(filColArr.length == 1){
        comm += ' ' + filColArr[0] + ' = ' + filArr[0]
    }
    else{
        for(let i = 0;i < filArr.length;i++){
            comm += ' ' + filArr[i] + ' = ' + filArr[i]
            if(i < filArr.length - 1){
                comm += ' AND '
            }
        }
    }
    return db.any(comm + ';')
}

function selectTableAll(tbName){
    return db.any('SELECT * FROM ' + tbName + ';')
}

function filterData(tbName,colArr,filColArr,filArr){
    let comm = 'SELECT '
    if(colArr.length == 1){
        comm += colArr[0]
    }
    else{
        comm += '( '
        for(let i = 0;i < colArr.length;i++){
            comm += ' ' + colArr[i]
            if(i < colArr.length - 1){
                comm += ', '
            }
        }
        comm += ' )'
    }
    comm += ' FROM ' + tbName
    if(filColArr){
        comm += ' WHERE'
        if(filColArr.length == 1){
            comm += ' ' + filColArr[0] + ' = ' + filArr[0]
        }
        else{
            for(let i = 0;i < filArr.length;i++){
                comm += ' ' + filColArr[i] + ' = ' + filArr[i]
                if(i < filArr.length - 1){
                    comm += ' AND '
                }
            }
        }
    }
    console.log(comm)
    return db.any(comm + ';')
}

checkDefaultTables()

exports.encryptPassword = (pswd) => bcrypt.hash(pswd, 5)
exports.comparePasswords = (givenPswd,dbPswd) => bcrypt.compare(givenPswd, dbPswd)

exports.wrap = (string) => wrap(string)

exports.createTable = (tbName, colDescArr) => createTable(tbName, colDescArr)
exports.insertNewData = (tbName,colArr,valArr) => insertNewData(tbName,colArr,valArr)
exports.updateData = (tbName,colArr,valArr,filColArr,filArr) => updateData(tbName,colArr,valArr,filColArr,filArr)
exports.selectTableAll = (tbName) => selectTableAll(tbName)
exports.filterData = (tbName,colArr,filColArr,filArr) => filterData(tbName,colArr,filColArr,filArr)