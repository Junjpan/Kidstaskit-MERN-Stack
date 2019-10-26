module.exports=({title,rules})=>{
    const today=new Date();
    updaterule=rules.replace(/\n\n/g,'<br /><br />');
    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <link href="https://fonts.googleapis.com/css?family=Quicksand&display=swap" rel="stylesheet"> 
        <title>PDF result template</title>
        <style>
        body{
            padding:20px;
            font-family: 'Quicksand', sans-serif;
        }
        footer{
            height:25px;
            background-color:rgb(48, 78, 122);;
            text-align:center;            
            width:100%;
            color:white;
            font-size:10px;           
        }
        h1{color:rgb(48, 78, 122);
           text-align:center;}  
      p{
          font-size:15px;
      }
        </style>
      </head>
      <body>
      <footer><b style='text-align:right'>${today}</b></footer>
       <h3>${title}</h3>       
       <div> <p>${updaterule}</p></div>
      </body>
      <footer>Fun List For Kids | <span style="color:black;font-size:10px">A Family-Kids Management Platform-designed by JuneBug</span> </footer>
    </html>
    `
}
