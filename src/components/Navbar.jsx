import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../assets/css/Navbar.css";
import {
    getDocumentNames,
    createDocument,
    readDocumentContents,
    updateDocumentContents,
    deleteDocument,
} from "./localStoragePrototype";

function Navbar({ handleAddTextBlock, setFileURL, pushToDB, pullFromDB, handleAddGraphBlock, handlePrintButtonClick }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [documentNames, setDocumentNames] = useState(getDocumentNames());
    const [currentDocumentName, setCurrentDocumentName] = useState('');

    function toggleMenu () {
        setMenuOpen(!menuOpen);
    };

    function handleAddClick () {
        const documentName = inputValue
        createDocument(inputValue);
        setDocumentNames(getDocumentNames());
        handleClick(documentName);
        setInputValue("");
    };

    function handleClick(documentName) {
        setCurrentDocumentName(documentName);
        setFileURL(documentName);
    };

    function handleDeleteClick(documentName) {
        if (currentDocumentName === documentName) {
            setCurrentDocumentName('');
            setFileURL('');
        }
        deleteDocument(documentName);
        setDocumentNames(getDocumentNames());
    };
    
    return (
        <>
            <nav
                className="navbar navbar-expand-lg"
                style={{
                    backgroundColor: "#9B2C5D", // 배경색 지정 (이미지의 주요 색상)
                    color: "white",
                    width: "100%"
                }}
            >
                <div className="container-fluid navbar">
                    {/* 왼쪽 햄버거 버튼 (추가된 부분) */}
                    <button className="hamburger-btn" onClick={toggleMenu}>
                        ☰
                    </button>

                    {/* 문서이름  */}
                    <a className="navbar-brand text-white ps-3" href="#" style={{ fontWeight: "bold", textAlign: "left" }}>
                        { currentDocumentName }
                    </a>

                    {/* 로고  */}
                    <div
                        className="d-flex ps-3 pe-3"
                        href="#"
                        style={{
                            margin: 0,
                            fontWeight: "bold",
                            textAlign: "right",
                            backgroundColor: "rgba(0, 0, 0, 0.5",
                            color: "white",
                            padding: "5px 10px",
                            borderRadius: "5px",
                            fontSize: "25px",
                        }}
                    >
                        MOANOTE
                    </div>
                </div>
            </nav>
            {/* 사이드 메뉴 */}
            <div className={`side-menu ${menuOpen ? "open" : ""}`}>
                <div className="menu-content">
                    <h4 className="ms-3">문서 목록</h4>
                    <ul className="ms-3 ps-3 pe-2">
                        {documentNames.map((item, index) => (
                            <li className="d-flex justify-content-between align-items-center">
                                <button className="filelink text-start" onClick={() => handleClick(item)}> {item} </button>
                                <button className="small-btn rounded-circle ms-auto" onClick={()=> handleDeleteClick(item)} style={{ width: "16px", height: "16px", "font-size": "12px", padding: "0" }}>x</button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="menu-footer">
                    <input
                        type="text"
                        className="menu-input"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="문서 제목 입력"
                    />
                    <button className="menu-add-btn" onClick={handleAddClick}>
                        추가
                    </button>
                </div>
            </div>

            {/* 플로팅 버튼 */}
            <div className="floating-container">
                {/* 플로팅 버튼들 */}
                <div className="floating-buttons">
                    {/*
                    <button className="floating-action" onClick={pushToDB}>
                        <i className="bi bi-cloud-arrow-up"></i>
                        <span>DB 저장</span>
                    </button>
                    <button className="floating-action" onClick={pullFromDB}>
                        <i className="bi bi-cloud-arrow-down"></i>
                        <span>DB 불러오기</span>
                    </button>
                    <button className="floating-action" onClick={handlePrintButtonClick}>
                        <i className="bi bi-printer"></i>
                        <span>출력</span>
                    </button>
                    */}
                    <button className="floating-action" onClick={handleAddTextBlock}>
                        <i className="bi bi-fonts"></i>
                        <span>텍스트 블록</span>
                    </button>
                    <button className="floating-action" onClick={handleAddGraphBlock}>
                        <i className="bi bi-pencil-square"></i>
                        <span>그래프 블록</span>
                    </button>
                </div>
            </div>
        </>
    );
}

export default Navbar;