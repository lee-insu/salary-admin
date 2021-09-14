import React, { useState } from 'react';
import style from './app_content_upload.module.css';
import UploadModal from './upload_modal/upload_modal';

const AppContentUpload = () => {

    const [input,setInput] = useState('');
    const [keywords,setKeywords] = useState([]);



    const onChange = e => {
       const {value} =e.target;
       setInput(value);
    }

    const onKeyDown = e => {
        const {key} = e;
        const trimmedInput = input.trim();

        if (key === ',' && trimmedInput.length && !keywords.includes(trimmedInput)) {
            e.preventDefault();
            setKeywords(prevState => [...prevState, trimmedInput]);
            setInput('');
          }
    };

    const submitKeywords = e => {
        const trimmedInput = input.trim();

        if (trimmedInput.length && !keywords.includes(trimmedInput)) {
            e.preventDefault();
            setKeywords(prevState => [...prevState, trimmedInput]);
            setInput('');
          }
    }


    const deleteKeyword = e => {
        setKeywords(prevState => prevState.filter((keyword, i) => i !== e))
    }


    return (
        <div className={style.session}>
             
                <input 
                type="text"
                value={input}
                onChange={onChange}
                onKeyDown={onKeyDown}
                placeholder="keyword"
                />
                <button onClick={submitKeywords}>등록하기</button>
               
            <div>
                {keywords.map((keyword,index) => 
                <div>{keyword}
                <button onClick={()=>deleteKeyword(index)}>x</button>
                </div>)}
            </div>
            <UploadModal keywords ={keywords} />
        </div>
    );
};

export default AppContentUpload;