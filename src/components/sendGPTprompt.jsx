import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw";
import { convertToExcalidrawElements } from "@excalidraw/excalidraw"
import { serializeAsJSON } from "@excalidraw/excalidraw"
import axios from 'axios';

export async function sendGPTprompt(prompt, handleResponse, handleError) {
    try {
        const res = await axios.post(
            'http://localhost:8080/api/proxy', // 스프링 부트 프록시 서버 주소
            {
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: "You are a diagram generator that outputs diagrams exclusively in mermaid syntax. " +
                            "When provided with a description of a diagram—such as a use-case, sequence diagram, " +
                            "algorithm flowchart, or mind map—you respond solely with the corresponding mermaid code. " +
                            "Do not include any explanations, headers, or code block delimiters (e.g., ```). " +
                            "Only provide the pure mermaid syntax."
                    },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.7,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const mermaidSyntax = res.data.choices[0].message.content;

        const { elements, files } = await parseMermaidToExcalidraw(mermaidSyntax, {
            fontSize: 10,
        });

        const excalidrawElements = convertToExcalidrawElements(elements);
        const contents = serializeAsJSON(excalidrawElements, {}, files);


        handleResponse(contents);
    } catch (err) {
        handleError(err);
    } finally {

    }
}