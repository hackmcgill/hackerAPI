"use strict";
// const server = require('../app.js');
// const util = {
//     //insert all files under util
// }


// //make sure that we are connected to the database
// before(function(done) {
//     this.timeout(0);
//     server.app.on("event:connected to db", () => {
//         //drop all information, and then add some users
//         dropAll(()=>{
//             util.user.dropUsers(() => {
//                 util.user.storeMultipleUsers(util.user.encryptMultipleUsers([util.user.admin, util.user.tutorB, util.user.tutorC, util.user.tutorD, util.user.tutorE]), done)
//             })    
//         });    
//     });
// });
// beforeEach(function(done){
//     this.timeout(0);
//     util.classes.storeMultipleClasses([util.classes.comp202, util.classes.comp273, util.classes.comp252, util.classes.comp251],
//         () => {
//             util.tutors.storeMultipleTutors([util.tutors.tutorB, util.tutors.tutorC, util.tutors.tutorE],
//                 () => {
//                     util.events.storeMultipleEvents([util.events.eventB1, util.events.eventB3, util.events.eventE3HoursAgo, util.events.eventCNow],
//                         () => {
//                             util.checkin.storeMultipleCheckIns([util.checkin.checkInTutorCOnTime, util.checkin.checkInTutorELate],
//                                 done)
//                         })
//                 });
//         });
// });
// afterEach(function(done){
//     this.timeout(0);
//     dropAll(done);
// });

// function dropAll(done){
//     util.classes.dropClasses(() => {
//         util.tutors.dropTutors(() => {
//             util.events.dropEvents(() => {
//                 util.checkin.dropCheckins(done)
//             });
//         });
//     });
// }