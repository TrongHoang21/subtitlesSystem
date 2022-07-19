import parseSRT from 'parse-srt'
// const sampleSRTData = `1
// 00:00:03,400 --> 00:00:06,177
// In this lesson, we're going to
// be talking about finance. And

// 2
// 00:00:06,177 --> 00:00:10,009
// one of the most important aspects
// of finance is interest.

// 3
// 00:00:10,009 --> 00:00:13,655
// When I go to a bank or some
// other lending institution

// 4
// 00:00:13,655 --> 00:00:17,720
// to borrow money, the bank is happy
// to give me that money. But then I'm

// 5
// 00:00:17,900 --> 00:00:21,480
// going to be paying the bank for the
// privilege of using their money. And that

// 6
// 00:00:21,660 --> 00:00:26,440
// amount of money that I pay the bank is
// called interest. Likewise, if I put money

// 7
// 00:00:26,620 --> 00:00:31,220
// in a savings account or I purchase a
// certificate of deposit, the bank just

// 8
// 00:00:31,300 --> 00:00:35,800
// doesn't put my money in a little box
// and leave it there until later. They take

// 9
// 00:00:35,800 --> 00:00:40,822
// my money and lend it to someone
// else. So they are using my money.

// 10
// 00:00:40,822 --> 00:00:44,400
// The bank has to pay me for the privilege
// of using my money.

//const videoSrc = "https://media.w3.org/2010/05/sintel/trailer_hd.mp4";
//const videoSrc = 'https://firebasestorage.googleapis.com/v0/b/drive-clone-concobaebe.appspot.com/o/files%2Fsample5_5p.mp4?alt=media&token=e50647b7-4116-45b1-ba75-e19e52bb043c'
const videoSrc = "http://localhost:5000/api/video/getVideo?videoPath=tempUploads/sample5_5p.mp4"


//SAMPLE DATA

const getSubData = () => {
    // const subFileSrc = "https://firebasestorage.googleapis.com/v0/b/drive-clone-concobaebe.appspot.com/o/files%2Fsubtitles.srt?alt=media&token=b7774485-252e-4e99-a6b0-4442d3291fb2"
 
    var jsonSubs = parseSRT(sampleSRTData);
    return jsonSubs;
 }

 const subData = getSubData();

 //this function is for inside call. using Adapter pattern to plug n play
 const parseSRTtoJSON = (srtData) => {
    var jsonSubs = parseSRT(srtData);
    return jsonSubs;
}
export default subData;
export {videoSrc, parseSRTtoJSON} ;




