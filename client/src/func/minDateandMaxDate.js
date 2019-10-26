
import * as d3 from 'd3';
const minDateandMaxDate = (item) => { 

    if(item.length>=1){
    var minD=d3.min(item);
    var currentDate=new Date(`${new Date().getMonth()+1}/${new Date().getDate()}/${new Date().getFullYear()}`)
    var daysapart = currentDate.getTime() - new Date(minD).getTime();
    daysapart = daysapart / (24 * 60 * 60 * 1000);
    return { minD, daysapart }
    }else {
        minD = null;
        daysapart = null
        return { minD, daysapart }
    }
}

export default minDateandMaxDate