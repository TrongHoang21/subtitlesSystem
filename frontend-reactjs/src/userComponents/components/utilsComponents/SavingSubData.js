//Purpose is to use makeChunk

//This func will trigger subData change, so dont use SubData as effect Dependency. use other hook instead
export const ArrayToSrtFormat = (jsonSubs) => { //Can't export directly, because of redux cant be used as a param
    // console.log('jsonSubs status: ', jsonSubs);
    
    if(jsonSubs){
        let result = "";

        // console.log('subdata: ', jsonSubs);
        
        jsonSubs.map((item, index) => (
            <div>
            {
                result += makeChunk(item.id, item.start, item.end, item.text)
            }
            </div>
        
        ))    
        
        return result
    }
    
    return ""
    
}

   


export const makeChunk = (currIndex, currStart, currEnd, currText) => {
    // console.log('before: ', currStart)

    if(isNaN(currStart) || currStart.toString().trim() === ""){
        currStart = 0
    }
    if(isNaN(currEnd) || currEnd.toString().trim() === ""){
        currEnd = 0
    }
      
    
        const chunk = `${currIndex}\n` +
        `${secToHhmmssms(currStart)} --> ${secToHhmmssms(currEnd)}\n` +
        `${currText}\n\n`;
      
        // console.log('after: ', chunk)

        return chunk
      }
      
function secToHhmmssms(sec) {
    
    const ms = sec.toFixed(3).toString().substr(-3);
    const h = Math.floor(sec / 3600).toString().padStart(2, '0');
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    

    return `${h}:${m}:${s},${ms}`;
    }











