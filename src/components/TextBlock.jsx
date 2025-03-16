import { useState, useRef, useEffect } from 'react'
import Markdown from 'react-markdown'
import { sendGPTprompt } from './sendGPTprompt';

function TextBlock({ id, initialContents, hookContentsUpdate, removeBlock, insertGraphBlock }) {
    const [contents, setContents] = useState(initialContents);
    const [isEditible, setIsEditible] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const textareaRef = useRef(null);

    function adjustHeight() {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    function focus() {
        const textarea = textareaRef.current;
        textarea.focus();
    };

    function handleContentsUpdate(e) {
        setContents(e.target.value);
        hookContentsUpdate(id, e.target.value, true);
    };

    function handleCreateGraph(){
        setIsGenerating(true);

        const handleResponse = (graphBlockContents) => {
            insertGraphBlock(id, graphBlockContents);
            setIsGenerating(false);
        }

        const handleError = (err) => {
            window.alert(err);
            console.log(err);
            setIsGenerating(false);
        }

        sendGPTprompt(contents, handleResponse, handleError);
    }

    useEffect(() => {
        if (isEditible) {
            adjustHeight();
            focus();
        }
    }, [isEditible, contents]);

    return (
        <div className="doc-block" id={id}>
            <div className="d-flex justify-content-between align-items-center pb-1">
                <button className="btn content-box-button delete" onClick={() => removeBlock(id)}>삭제</button>
                <div className="d-flex flex-row">
                    {isGenerating ? (
                        <>
                            <div class="me-2">
                                그래프를 생성중입니다...
                            </div>
                            <div class="spinner-border text-primary me-2" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </>
                    ) : (
                        <button className = "btn btn-primary btn-sm square-btn me-2" onClick = { handleCreateGraph }>생성</button>
                    )}
                    <button className="btn btn-primary btn-sm square-btn me-1">▲</button>
                    <button className="btn btn-primary btn-sm square-btn">▼</button>
                </div>
            </div>

            {isEditible ? (
                <textarea
                    name="editible"
                    ref={textareaRef}
                    type="text"
                    className="content-box"
                    value={contents}
                    onChange={handleContentsUpdate}
                    onBlur={() => setIsEditible(!isEditible)}
                />
            ) : (
                <div style={{padding:0, margin:0, width:"100%"}}
                        onClick={() => setIsEditible(!isEditible)}
                >
                    <div className="content-box">
                        <Markdown>{contents}</Markdown>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TextBlock;