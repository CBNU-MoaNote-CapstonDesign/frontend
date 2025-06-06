import {createFile, deleteFile, editFile, getFile, getFileList} from "@/libs/server/file";
import {fetchCurrentUserServerSide} from "@/libs/server/user";
import {FileDTO, FileTypeDTO} from "@/types/dto";

export default async function Page() {
  const user = await fetchCurrentUserServerSide();
  console.log("유저 정보");
  console.log(user);


  const file = await createFile('test', FileTypeDTO.DOCUMENT, null, user) as FileDTO;

  console.log("파일 생성");
  console.log(file);

  const editedFile = await editFile({
    id: file.id,
    type: file.type,
    name: 'edited',
  }, user);

  console.log("파일 편집");
  console.log(editedFile);

  const result = await deleteFile(file.id, user);
  console.log("파일 삭제")
  console.log(result)

  return <div>

  </div>
}