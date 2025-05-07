import ProfileImage from "@/components/layout/ProfileImage";

export default function Profile({name}:{name:string}) {
  return <div className={"w-[150px] p-4 flex-col flex"}>
    <ProfileImage size={"120px"}/>
    <div className={"w-full text-left text-gray-700 text-xl mt-1 mb-5 px-5"}>
      {name}
    </div>
  </div>
}