import React, { useEffect, useState } from 'react';
import {firestore} from '../../../service/firebase';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {storage} from '../../../service/firebase';



const ResearchUploadModal = () => {

    const [text,setText] = useState('');
    const [title,setTitle] = useState('');
    const [subTitle,setSubTitle] =useState('');
    const [input,setInput] = useState('');
    const [keywords,setKeywords] = useState([]);
    

    const fireStore = firestore.collection('researchKeyword');

    const onChange = e => {
        const {target:{name,value}} = e;
        if(name === 'title') {
            setTitle(value);
        }else if(name === 'subTitle') {
            setSubTitle(value);
        }else if(name === 'keywords') {
            setInput(value);
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
        fireStore.add({
            title,
            subTitle,
            text
        })
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

    console.log(text);


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
        <div>
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
                        <option value="2020">2020</option>
                        <option value="2021">2021</option>
                    </select>
                    <select name=""></select>
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
                
                
                --

                <input type="submit"/>
            </form>
        </div>
    );
};

export default ResearchUploadModal;