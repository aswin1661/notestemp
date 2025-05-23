import {Sem} from "@/app/components/details"
import {Section} from "@/app/components/card"
export default async function Sub({params}:{
    params:Promise<{sem:number,dept:string}>
}) {
    const sem = (await params).sem
    const branch =(await params).dept
    return(
         <div className="w-full h-auto flex flex-col items-center">
           <div className="grid align-center justify-center"  >

                 {Sem.filter((S1)=>{
                     return sem.toString() ===  S1.id.toString()

                  }).map((S1)=>(
        <Section key={S1.id} sem={sem} branch={branch} sub1={S1.sub1} sub2={S1.sub2} sub3={S1.sub3} sub4={S1.sub4} sub5={S1.sub5} sub6={S1.sub6} >
        </Section>
      ))
      }

        </div>
     </div>
    
    )
}