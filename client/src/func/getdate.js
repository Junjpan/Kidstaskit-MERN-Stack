const getdate=(date)=>{
var year=new Date(date).getFullYear();
var month=new Date(date).getMonth()+1;
var newdate=new Date(date).getDate();
return `${month}/${newdate}/${year}`
}

export default getdate