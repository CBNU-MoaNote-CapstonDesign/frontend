import { useState, useRef } from 'react'
import { Excalidraw, serializeAsJSON } from "@excalidraw/excalidraw"

function GraphBlock({ id, initialContents, hookContentsUpdate, removeBlock }) {
    const [contents, setContents] = useState(initialContents);
    const initialDataRef = useRef(null);

    if (initialDataRef.current === null) {
        initialDataRef.current = (initialContents && initialContents !== '')
            ? JSON.parse(initialContents)
            : null;
    }

    function handleContentsUpdate(excalidrawElements, appState, files) {
        const documentRawText = serializeAsJSON(excalidrawElements, appState, files);
        if (documentRawText !== contents) {
            setContents(documentRawText);
            hookContentsUpdate(id, documentRawText, false);
        }
    };

    return (
        <>
            <div className="doc-block" id={id}>
                <div className="d-flex justify-content-between align-items-center pb-1">
                    <button className="btn content-box-button delete" onClick={() => removeBlock(id) }>삭제</button>
                    <div className="d-flex flex-row">
                        <button className="btn btn-primary btn-sm square-btn me-1">▲</button>
                        <button className="btn btn-primary btn-sm square-btn">▼</button>
                    </div>
                </div>

                <div className="graph-block" id={id}>
                    <Excalidraw
                        initialData={initialDataRef.current}
                        onChange={handleContentsUpdate}
                    />
                </div>
            </div>
        </>
    )
}

export default GraphBlock;