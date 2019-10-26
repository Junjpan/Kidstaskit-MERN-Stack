import React from 'react'

export default function Pagination({totallist,paginate}) {//{totallist,paginate}=props
    const pageNumbers=[];

    for(var i=1;i<=Math.ceil(totallist/10);i++){
        pageNumbers.push(i);
    }
    return (
        <ul className="pagination">
           {pageNumbers.map((num,index)=>{
             return  <li key={index} onClick={()=>paginate(num)}>{num}</li>
           })}
        </ul>
    )
}
