export function getDocumentNames() {
    const documentNames = JSON.parse(localStorage.getItem("document-names"));
    return documentNames || [];
}

export function createDocument(name) {
    const documentNames = getDocumentNames();
    documentNames.push(name);

    localStorage.setItem("docs-" + name, "[]");
    localStorage.setItem("document-names", JSON.stringify(documentNames));
}

export function readDocumentContents(name) {
    const contents = localStorage.getItem("docs-" + name);
    return contents;
}

export function updateDocumentContents(name, contents) {
    localStorage.setItem("docs-" + name, contents);
}

export function deleteDocument(name) {
    const documentNames = JSON.parse(localStorage.getItem("document-names"));
    const updatedNames = documentNames.filter(item => item !== name);

    localStorage.removeItem("docs-" + name);
    localStorage.setItem("document-names", JSON.stringify(updatedNames));
}
