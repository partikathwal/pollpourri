


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
            text: "What was the most recent project at JCAH?",
            options: {
                opt1: "Installing new carpet on the stage",
                opt2: "Installing a new video wall",
                opt3: "Replacing the plumbing in the downstairs restrooms",
                opt4: "Renovating the kitchen"
            }
        },
        {
            text: "How many LED panels were installed on the new video wall?",
            options: {
                opt1: "15",
                opt2: "56",
                opt3: "154",
                opt4: "221"
            }
        },
        {
            text: "Approximately, how many LDC volunteers worked on the video wall project?",
            options: {
                opt1: "50",
                opt2: "100",
                opt3: "175",
                opt4: "250"
            }
        },
        {
            text: "How many nights in total did the hosts provide rooming for the LDC volunteers?",
            options: {
                opt1: "220",
                opt2: "320",
                opt3: "420",
                opt4: "520"
            }
        },
        {
            text: "Approximately, much money did the hosts save the branch in hotel fees by opening up their homes?",
            options: {
                opt1: "$10,000",
                opt2: "$30,000",
                opt3: "$40,000",
                opt4: "$50,000"
            }
        },
        {
            text: "With that savings how many Kingdom Halls in Africa is the organization able to build?",
            options: {
                opt1: "2",
                opt2: "6",
                opt3: "9",
                opt4: "15"
            }
        },
        {
            text: "What is the average travel time from the host's home to JCAH WITHOUT traffic?",
            options: {
                opt1: "10 minutes",
                opt2: "20 minutes",
                opt3: "30 minutes",
                opt4: "1 hour"
            }
        },
        {
            text: "What is the average travel time from the host's home to JCAH WITH Jersey traffic?",
            options: {
                opt1: "1 hour",
                opt2: "2 hour",
                opt3: "3 hour",
                opt4: "What am I doing in the city… I want to go home..."
            }
        },
        {
            text: "How many of our hosts have pets?",
            options: {
                opt1: "10%",
                opt2: "20%",
                opt3: "30%",
                opt4: "40%"
            }
        },
        {
            text: "How many times this past year has Alana texted you and asked you to assist with rooming?",
            options: {
                opt1: "10",
                opt2: "20",
                opt3: "30",
                opt4: "1,000"
            }
        },
        {
            text: "How have you personally benefited from extending yourself with rooming?",
            options: {
                opt1: "We have made lasting friendships",
                opt2: "We have experienced the joy of supporting theocratic projects",
                opt3: "We have set an example of hospitality for our family and others",
                opt4: "All of the above"
            }
        },
        {
            text: "How much does it cost to pick up a volunteer from LaGuardia airport?",
            options: {
                opt1: "$10.00",
                opt2: "$20.00",
                opt3: "$30.00",
                opt4: "$45.00"
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
