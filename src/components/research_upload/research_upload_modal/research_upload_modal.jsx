import React, { useRef, useState } from 'react';
import {firestore} from '../../../service/firebase';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {storage} from '../../../service/firebase';
import style from './research_upload_modal.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";




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


    const keyword = keywords.map((keyword,i) => 
        <li className={style.research_keyword} key={i}>
            {keyword}
            <FontAwesomeIcon className={style.research_del} onClick={()=>handleDelete(i)} icon={faTimes}/>
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
                <div className={style.container}>
                    <div className={style.header}>
                        <div className={style.title}>컨텐츠 등록</div>
                        <button
                        className={style.modal_btn}
                        onClick={modalClose}
                        >x</button>
                    </div>
                    <form onSubmit={onSubmit}>
                        <div className={style.input_container}>
                            <div className={style.sub_title}>제목</div>
                            <input 
                            className={style.input}
                            type="text"
                            name='title'
                            value={title}
                            onChange={onChange}
                            />
                        </div>
                        <div className={style.input_container}>
                            <div className={style.sub_title}>소제목</div>
                            <input 
                            className={style.sub_input}
                            type="text"
                            name='subTitle'
                            value={subTitle}
                            onChange={onChange}
                            />
                        </div>
                        <div className={style.input_container}>
                            <div className={style.sub_title}>컨텐츠 키워드</div>
                            <div className={style.input_box}>
                                <input 
                                className={style.research_input}
                                type="text"
                                name='keywords'
                                value={input}
                                onChange={onChange}
                                onKeyDown={onKeyDown}
                                />
                                <ul className={style.research_ul}>
                                    {keyword}
                                </ul>
                            </div>
                        </div>
                        <div className={style.input_container}>
                            <div className={style.sub_title}>날짜 등록</div>
                            <div className={style.select_container}>
                                 <select className={style.select} name="year" onChange={onChange}>
                                      <option value="2021">년</option>
                                      <option value="2021">2021</option>
                                     <option value="2022">2022</option>
                                 </select>
                                 <select className={style.select} name="month" onChange={onChange}>
                                  {monthList.map((mon,i) => <option key={i} value={mon}>{mon}</option>)}
                                 </select>
                            </div>
                        </div>
                        <div className={style.input_container_img}>
                            <div className={style.sub_title}>대표 이미지 등록(1장)</div>
                            <label htmlFor="file">
                                <div className={img ? style.in_box : style.out_box}>
                                    <div className={style.box}>{!img ? '+':'ㅇ'}</div>
                                </div>
                            </label>
                            <input 
                            type="file"
                            accept="imgage/*"
                            id="file"
                            name="img"
                            onChange={onChange}
                            ref={fileInput}
                            required
                            style={{display:'none'}}
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
                            } }
                            />
                        </div>
                        <input className={style.submit} type="submit"/>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResearchUploadModal;
