


//PLAYER SCREEN

//access page
    //create user
    //get songs list

//input name
    //update user name and connectionStatus

//waiting screen
    //listen for currentRound update

//game starts
    //get unique random options

//select option
    //update round wins/losses
    //update user wins/losses

//when time is up
    //show correct answer
    //update round losses
    //update user losses

//============

function createUser(){
    let userRef = firebase.database().ref("users").push();
    let userID = userRef.key;
    return userRef.set({
        connectionStatus: 0,
        name: ""
    }).then((err) => {
        if(err) console.log(err);
        return userID;
    })
}

function getUser(userID){
    return firebase.database().ref("users/"+userID).once("value").then((snap) => {
        let user = snap.val();
        return user;
    })
}

// function getSongs(){
//     return firebase.database().ref("songs").once("value").then((snap) => {
//         let songs = snap.val();
//         return songs;
//     })
// }
function getQuestions(){
    return [
        {
            "text": "When did they arrive at JCAH?",
            "options": {
                "opt1": "2016",
                "opt2": "2017",
                "opt3": "2018",
                "opt4": "2019"
            }
        },
        {
            "text": "Which Assembly Hall did they first serve at?",
            "options": {
                "opt1": "Madera, California",
                "opt2": "Belleville, Michigan",
                "opt3": "Denton, Texas",
                "opt4": "Richmond, Virginia"
            }
        },
        {
            "text": "Which Assembly Hall did they serve at second?",
            "options": {
                "opt1": "Conyers, Georgia",
                "opt2": "Natick, Massachusetts",
                "opt3": "La Feria, Texas",
                "opt4": "St. Louis, Missouri"
            }
        },
        {
            "text": "What was their home Assembly Hall?",
            "options": {
                "opt1": "La Feria, Texas",
                "opt2": "Conyers, Georgia",
                "opt3": "Denton, Texas",
                "opt4": "Mira Loma, California"
            }
        },
        {
            "text": "What is the proper response to this...?",
            "options": {
                "opt1": "Wuh oh",
                "opt2": "Ay ay ay",
                "opt3": "Oh Cielos",
                "opt4": "No pos wow"
            }
        },
        {
            "text": "What does Ralph say to get you to do something?",
            "options": {
                "opt1": "Just do it!",
                "opt2": "3, 2, 1... Go!",
                "opt3": "Ándale!",
                "opt4": "I'll pay you..."
            }
        },
        {
            "text": "When is the Urbinas' wedding anniversary?",
            "options": {
                "opt1": "December 28th",
                "opt2": "July 15th",
                "opt3": "October 5th",
                "opt4": "February 30th"
            }
        },
        {
            "text": "What is Ralph's favorite food?",
            "options": {
                "opt1": "🍔 Jollibee",
                "opt2": "🌮 Tacos",
                "opt3": "🍕 Pizza",
                "opt4": "🤤 Anything with hot sauce"
            }
        },
        {
            "text": "What is Ralph's favorite hobby?",
            "options": {
                "opt1": "Cooking",
                "opt2": "Playing Nintendo",
                "opt3": "Watching Documentaries",
                "opt4": "Parkour"
            }
        },
        {
            "text": "What is Adriana's favorite hobby?",
            "options": {
                "opt1": "Tennis",
                "opt2": "Reading",
                "opt3": "Horseback Riding",
                "opt4": "Sorting crayons"
            }
        },
        {
            "text": "When Ralph says \"What's his name?\" and no one is nearby, what does he really mean?",
            "options": {
                "opt1": "\"I have to call someone\"",
                "opt2": "\"I forgot what I was doing\"",
                "opt3": "\"What time is it?\"",
                "opt4": "\"Where is Adriana??\""
            }
        },
        {
            "text": "What was Adriana's job before LDC?",
            "options": {
                "opt1": "Interior Designer",
                "opt2": "Accountant",
                "opt3": "Teacher",
                "opt4": "Golf Instructor"
            }
        }
    ];
}



function updateUserName(userID, name){
    return firebase.database().ref("users/"+userID+"/name").set(name).then(() => {
        return firebase.database().ref("users/"+userID+"/connectionStatus").set(1);
    })
}


function addRoundListener(handler){
    firebase.database().ref("currentRound").off("value");

    firebase.database().ref("currentRound").on("value", (snap) => {
        let roundID = snap.val();
        
        handler(roundID);
    })
}

// function getOtherSongNames(){
//     return firebase.database().ref("otherSongNames").once("value").then((snap) => {
//         return snap.val();
//     })
// }

//remove?
async function getSongOptions(songs, correctSong, numOptions){
    //songs -> array of song titles
    //correctSongIndex -> correct song index
    //numOptions -> how many options do you want returned?
    let correctSongIndex = songs.indexOf(correctSong);
    let otherSongs = songs.filter(song => song !== songs[correctSongIndex]);
    otherSongs = otherSongs.concat(await getOtherSongNames());
    console.log(otherSongs);

    let randIndices = [];
    while(randIndices.length < (numOptions - 1)){
        let randIndex = Math.floor(Math.random() * (otherSongs.length - 1) );
        if(randIndices.includes(randIndex) === false) randIndices.push(randIndex);
    }
    let randSongs = randIndices.map(i => otherSongs[i]);
    randSongs.splice(Math.floor(Math.random() * (randSongs.length + 1)), 0, correctSong)
    return randSongs;
}


function updateTallies(userID, roundID, optionName){
    // let field = isWin ? "wins" : "losses";
    return firebase.database().ref("rounds/"+roundID+"/results/"+optionName).transaction(val => val + 1);
    // return firebase.database().ref("users/"+userID+"/question/"+optionName).transaction(val => val + 1).then((result) => {
    //     return result.snapshot;
    // });
}






//=================

// GAME MASTER

//select song
    //create round
    //update currentRound

//see totals

function createRound(question){
    let roundRef = firebase.database().ref("rounds").push();
    let roundID = roundRef.key;
    let st = new Date().getTime();
    console.log(st);
    return roundRef.set({
        question: question,
        results: {
            opt1: 0,
            opt2: 0,
            opt3: 0,
            opt4: 0
        },
        startTime: st
    }).then((err) => {
        if(err) console.log(err);

        return firebase.database().ref("currentRound").set(roundID);
    })
}

function getRound(roundID){
    return firebase.database().ref("rounds/"+roundID).once("value").then((snap) => {
        return snap.val();
    })
}

function deleteCurrentRound(){
    return firebase.database().ref("currentRound").set(null);
}



function trackCurrentRound(callback){
    firebase.database().ref("currentRound").on("value", (snap) => {
        callback(snap.val());
    })
}









//===============


function uploadQuestions(questions){
    return firebase.database().ref("questions").set(questions);
}


async function test(){
    

    uploadQuestions(getQuestions());
}
