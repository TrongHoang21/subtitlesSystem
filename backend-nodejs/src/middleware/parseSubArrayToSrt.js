//CURRENTLY DONT USE, CALCULATING PASS BACK TO CLIENT FOR PERFORMANCE OF THE SERVER

function ArraytoSRTFormat(jsonSubs){ //Can't export directly, because of redux cant be used as a param
    let result = "";
    
    jsonSubs.forEach(item => {
        result += makeChunk(item.id, item.start, item.end, item.text)
        
    });

    return result
    
    //"1\n00:00:01,400 --> 00:00:02,177\nIn this lesson, we're going to\ncòn thở còn gỡ nha fend\n\n2\n00:00:03,177 --> 00:00:4,009\none of the most important aspects\nof finance is interest.\n\n3\n00:00:5,009 --> 00:00:6,655\nWhen I go to a bank or some\nother lending institution\n\n4\n00:00:6,655 --> 00:00:7,720\nto borrow money, the bank is happy\nto give me that money. But then I'm\n\n5\n00:00:7,900 --> 00:00:8,480\ngoing to be paying the bank for the\nprivilege of using their money. And that"
}


const makeChunk = (currIndex, currStart, currEnd, currText) => {
        const chunk = `${currIndex}\n` +
        `${secToHhmmssms(currStart)} --> ${secToHhmmssms(currEnd)}\n` +
        `${currText}\n\n`;
      
        return chunk
      }
      
function secToHhmmssms(sec) {

    
    const ms = sec.toFixed(3).toString().substr(-3);
    const h = Math.floor(sec / 3600).toString().padStart(2, '0');
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    

    return `${h}:${m}:${s},${ms}`;
    }

    module.exports= {ArraytoSRTFormat}