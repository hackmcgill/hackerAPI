"use strict";
module.exports = {
    login: login
};
/**
 * Use this function to log in a user before executing a test that requires certain permissions.
 * @param {ChaiHttp.Agent} agent 
 * @param {{email:string,password:string}} credentials 
 * @param {(err?:any)=>void} callback 
 */
function login(agent, credentials, callback) {
    agent
        .post("api/auth/login")
        .type("application/json")
        .send({
            email: credentials.email,
            password: credentials.password
        }).then(callback, callback);
}