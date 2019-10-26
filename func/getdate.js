module.exports=getdate=(date)=>{
var year=new Date(date).getFullYear();
var month=new Date(date).getMonth()+1;
var date=new Date(date).getDate();
return new Date(`${month}/${date}/${year}`)
}