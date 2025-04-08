import { CgProfile } from "react-icons/cg";
import Image from "next/image";

export default function ProfileImage ({size="150px",url}:{size?:string,url?:string}) {
  if(url) {
    return <div className={`rounded-full w-[${size}] h-[${size}]`}>
      <Image src={url} alt={""} className={"w-full"} />
    </div>
  } else {
    return <div className={`rounded-full w-[${size}] h-[${size}]`}>
      <CgProfile size={`${size}`}/>
    </div>
  }
}
