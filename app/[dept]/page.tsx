import { notFound } from "next/navigation";
import {Semester} from "../components/semester";
export async function generateStaticParams(){
    return[
        {dept:'gd'},
        {dept:'cse'},
        {dept:'ece'},
        {dept:'it'}
    ];
}


export default async function Dept({params}:{
    params:Promise<{dept:string}>
}) 
{
    const title =(await params).dept;
        if(title === 'cse'|| title=== 'it'||title==='ece' || title === 'gd'){
            return(
        <div>
           <Semester link={title} />
        </div>
            )
        }
            return(
                notFound()
    )
}
