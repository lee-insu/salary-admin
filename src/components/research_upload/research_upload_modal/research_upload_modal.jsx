import React, { useRef, useState } from 'react';
import {firestore} from '../../../service/firebase';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {storage} from '../../../service/firebase';
import style from './research_upload_modal.module.css';




const ResearchUploadModal = ({modalClose}) => {

    const [text,setText] = useState('');
    const [title,setTitle] = useState('');
    const [subTitle,setSubTitle] =useState('');
    const [input,setInput] = useState('');
    const [keywords,setKeywords] = useState([]);
    const [year,setYear] = useState('');
    const [month,setMonth] = useState('');
    const [img,setImg] =useState(null);
    const monthList = ["월","1","2","3","4","5","6","7","8","9","10","11","12"];
    const fileInput =useRef();


    const fireStore = firestore.collection('researchKeyword');
    const fireStoreDate = firestore.collection('researchDate');

    const onChange = e => {
        const {target:{name,value}} = e;
        switch (name) {
            case ('title'):
                return setTitle(value);
            case ('subTitle'):
                return setSubTitle(value);
            case ('keywords'):
                return setInput(value);
            case ('year'):
                return setYear(value);
            case ('month'):
                return setMonth(value);   
            case ('img'):
                return setImg(e.target.files[0]);
            default :
                return value
        }
    };

    const onKeyDown = e => {
        const {key} = e;
        const trimmedInput = input.trim();

        if(key === ',' && trimmedInput.length && !keywords.includes(trimmedInput)) {
            e.preventDefault();
            setKeywords(prevState => [...prevState,trimmedInput])
            setInput('');
        }

    }


    const onSubmit = async(e) => {
        e.preventDefault();
        if(img !== null) {
            const ref = storage.ref(`research/${title}/titleImg/${img.name}`);
            ref.put(img)
            .then(()=>ref.getDownloadURL())
            .then((url) => {
                fireStoreDate.doc(`${year}년 ${month}월`).set({
                    active:true,
                })
                fireStoreDate.doc(`${year}년 ${month}월`).collection('research').add({
                    active:false,
                    title,
                    subTitle,
                    keywords,
                    year,
                    month,
                    date: new Date().getDate(),
                    img:url,
                    views:0,
                    text
                })
            })
      
        };
        alert('suc')
        
    }

    const handleDelete = async(e) => {
        setKeywords(prevState => prevState.filter((key,i) => i !== e))
    }


    const keyword = keywords.map((keyword,index) => 
        <li key={index}>
            {keyword}
            <button onClick={()=>handleDelete(index)}>x</button>
        </li>
        )



    const uploadAdapter = loader => {
        return {
            upload: () => {
               return new Promise((resolve,reject) => {
                    const body = new FormData();
                        loader.file.then(file => {
                            body.append('file',file);
                            const ref = storage.ref(`research/${title}/${file.name}`)
                            return ref
                            .put(file)
                            .then(() => ref.getDownloadURL().then(url => {
                              resolve({
                                  default: `${url}`
                              })
                            }))
                            .catch(err => {
                                reject(err);
                            }) 
                        })
                })
            }
        };
    };



    function uploadPlugin(editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return uploadAdapter(loader);
        };
    };



    return (
    <div className={style.modal_container}>
        <div className={style.modal}>
            <button 
            className={style.modal_btn}
            onClick={modalClose}
            >x</button>
            <div>컨텐츠 등록</div>
            <form onSubmit={onSubmit}>
                <div>
                    <div>제목</div>
                    <input 
                    type="text"
                    name="title"
                    value={title}
                    onChange={onChange}
                    />
                </div>
                <div>
                    <div>부제목</div>
                    <input 
                    type="text"
                    name="subTitle"
                    value={subTitle}
                    onChange={onChange}
                    />
                </div>
                <div>
                    <div>컨텐츠 키워드 등록</div>
                    <input 
                    type="text"
                    name="keywords"
                    value={input}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    />
                    <ul>
                        {keyword}
                    </ul>
                </div>
                <div>
                    <select 
                    name="year"
                    onChange={onChange}
                    >
                         <option>년</option>
                        <option value="2021">2021</option>
                        <option value="2022">2022</option>
                    </select>
                    <select 
                    name="month"
                    onChange={onChange}
                    >
                  {monthList.map(mon => <option value={mon}>{mon}</option>)}
                    </select>
                </div>

                <div>
                    <input 
                    accept="image/*"
                    id="file"
                    type="file"
                    name="img"
                    onChange={onChange}
                    ref={fileInput}
                    />

                </div>

                <div>
                    <CKEditor
                    config={{
                        extraPlugins: [uploadPlugin]
                    }}
                    editor = {ClassicEditor}
                    data = {text}
                    onChange = {(e,editor) => {
                        const data = editor.getData();
                        setText(data);
                    }}
                    />
                </div>
                <input type="submit"/>
            </form>
        </div>
    </div>
    );
};

export default ResearchUploadModal;