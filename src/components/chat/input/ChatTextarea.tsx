import TextareaAutosize from 'react-textarea-autosize'

export default function ChatTextarea({setText}: { className?:string, setText?: (text: string) => void }) {

  return <TextareaAutosize
    className="w-full border p-2 rounded-xl"
    style={{'resize': 'none'}}
    minRows={5}
    onChange={(event) => {
      if(setText)
        setText(event.target.value);
    }}
    placeholder={"Type Here..."}>

  </TextareaAutosize>
}