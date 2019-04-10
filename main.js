const rp = require('request-promise');
const cheerio = require('cheerio');
const open = require('opn')

const options = {
    uri : `https://in.bookmyshow.com/bengaluru/movies/avengers-endgame/ET00090482`, //URL of the Movie in BookMyShow
    transform: function (body) {
        return cheerio.load(body);
    }
}

const checkStatus = (keywords) => {
    try{
    return new Promise((resolve,reject) => {
    console.log("Checking...")
    rp(options).
    then(function(data){
        let raw = data.html()
        keywords.forEach((word) => {
            if(raw.toLowerCase().indexOf(word) >=0){
                resolve(true)
            }
        })
        resolve(false)
    }).catch(function(error){
        console.log(error)
        Promise.reject('Error')
    })
    })
    }
    catch(err){
        throw err
    }
}

const sleep = async (ms) =>{
    return new Promise( (resolve,reject) => {
        setTimeout(()=>{ resolve()}, ms)
    })
}

const main = async () =>{
    try{
        while(1){
            if(await checkStatus(['book tickets'])){
                console.log("Booking open. Opening browser")
                open(options.uri)
                await sleep(250)
                break
            }
            else{
                console.log("Not found. Waiting 10 seconds.")
                await sleep(10000)
            }
        }
        process.exit(1)
    }  
    catch(err){
        console.log("Error")
    }
}

main()