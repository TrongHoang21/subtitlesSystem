import parseSRT from 'parse-srt'


 //this function is for inside call. using Adapter pattern to plug n play
 const parseSRTtoJSON = (srtData) => {
    var jsonSubs = parseSRT(srtData);
    return jsonSubs;
}

const isSRTParsable = (srtData) => {
    try {
        var jsonSubs = parseSRT(srtData);
        console.log('thử parse: ', jsonSubs);
        
        if (jsonSubs){
            return true;
        }
        else{
            return false;
        }
    } catch (error) {
        return false
    }
}

export {parseSRTtoJSON, isSRTParsable} ;




