import { useState, useEffect } from 'react'

import Navbar from './Navbar'
import TextBlock from './TextBlock'
import GraphBlock from './GraphBlock'

import {
    getDocumentNames,
    createDocument,
    readDocumentContents,
    updateDocumentContents,
    deleteDocument,
} from "./localStoragePrototype";

function Editor() {
    const [docBlocks, setDocBlocks] = useState([]);
    const [fileURL, setFileURL] = useState([]);
    
    function pushToDB() {
        // docBlocks 자체를 모두 저장
        const rawText = JSON.stringify(docBlocks);
        updateDocumentContents(fileURL,rawText);
    };

    function pullFromDB() {
        const rawText = readDocumentContents(fileURL);
        if (rawText) {
            importContents(rawText);
        }
    };

    function addTextBlock(contents) {
        setDocBlocks((prev) => [...prev,
        {
            isTextBlock: true,
            id: prev.length,
            contents: contents,
        }
        ]);
    };

    function removeBlock(id) {
        const updatedBlocks = docBlocks.filter((block) => block.id !== id);
        for (let idx in updatedBlocks) {
            updatedBlocks[idx].id = idx;
        }
        setDocBlocks(updatedBlocks);
    };

    function addGraphBlock(contents) {
        setDocBlocks((prev) => [
            ...prev,
            {
                isTextBlock: false,
                id: prev.length,
                contents: contents,
            }
        ]);
    };

    function updateContents(idx, contents, isTextBlock) {
        setDocBlocks((prev) => prev.map((block) => {
            if (block.id === idx) {
                return { ...block, contents: contents };
            }
            return block;
        }));
    };

    function printContents() {
        console.log(docBlocks);
    };

    function importContents(documentRawText) {
        const allContents = JSON.parse(documentRawText);
        setDocBlocks(allContents);
    }

    function insertGraphBlock(id, contents) {
        setDocBlocks((prev) => {
            const targetIndex = prev.findIndex((block) => block.id === id);

            const updatedBlocks = [
                ...prev.slice(0, targetIndex + 1),
                {
                    isTextBlock: false,
                    id: prev.length,
                    contents: contents,
                },
                ...prev.slice(targetIndex + 1),
            ];

            return updatedBlocks.map((block, index) => ({
                ...block,
                id: index,
            }));
        });
    }

    useEffect(() => {
        pullFromDB();
    }, [fileURL]);

    useEffect(() => {
        pushToDB();
    }, [docBlocks]);

    return (
        <>
            <Navbar
                handleAddTextBlock={() => addTextBlock('')}
                handleAddGraphBlock={() => addGraphBlock('')}
                handlePrintButtonClick={printContents}
                setFileURL={setFileURL}
                pushToDB={pushToDB}
                pullFromDB={pullFromDB}
            />
            <div className="doc-blocks">
                {docBlocks.map((docBlock) =>
                    docBlock.isTextBlock ? (
                        <TextBlock
                            key={docBlock.id}
                            id={docBlock.id}
                            initialContents={docBlock.contents}
                            hookContentsUpdate={updateContents}
                            removeBlock={removeBlock}
                            insertGraphBlock={insertGraphBlock}
                        />
                    ) : (
                        <GraphBlock
                            key={docBlock.id}
                            id={docBlock.id}
                            initialContents={docBlock.contents}
                            hookContentsUpdate={updateContents}
                            removeBlock={removeBlock}
                        />
                    )
                )}
            </div>
        </>
    );
}

export default Editor