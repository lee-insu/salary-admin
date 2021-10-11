import React, { useEffect, useState } from 'react';
import style from './app_content_upload.module.css';
import UploadModal from './upload_modal/upload_modal';
import {firestore} from '../../service/firebase';

const AppContentUpload = () => {

    const [modalOpen,setModalOpen] = useState(false);
    const [input,setInput] = useState('');
    const [keywords,setKeywords] = useState([]);
    const fireStore = firestore.collection('appKeyword');

    const onChange = e => {
       const {value} =e.target;
       setInput(value);
    }

    const onKeyDown = e => {
        const {key} = e;
        const trimmedInput = input.trim();

        if (key === ',' && trimmedInput.length && !keywords.includes(trimmedInput)) {
            e.preventDefault();
            try{
                fireStore.doc(`${trimmedInput}`).set({
                    active:false
                })
                setInput('');
            }catch(err) {
                console.log('store err',err);
            }
      
          }
    };

    const submitKeywords = e => {
        const trimmedInput = input.trim();

        e.preventDefault();
        try{
            fireStore.doc(`${trimmedInput}`).set({
                active:false
            })
            setInput('');
        }catch(err) {
            console.log('store err',err);
        }
        
    }


    const deleteKeyword = async(e) => {
        const del = window.confirm('are you sure delete keyword in contents?')
        if(del) {
            await fireStore.doc(e).delete();
            if(del) {
                const appStore = fireStore.doc(e).collection('appContents');
                appStore.get().then(keyword => {
                    const size = keyword.size;
                    for(let i = 0; i < size; i++) {
                        appStore.get().then(docs => {
                            docs.forEach(doc => {
                                appStore.doc(doc.id).delete();
                            })
                        })
                    }
                })
            }
        }
    }

    const modalClose = () => {
        setModalOpen(!modalOpen)
    }

    useEffect(()=> {
        fireStore.onSnapshot(snapshot => {
            const array = snapshot.docs.map(doc => ({
                id:doc.id
            }));
            setKeywords(array);
        })
    },[])



    const keyword = keywords.map(keyword => 
        <li key={keyword.id}>
            {keyword.id}
            <button onClick={()=>deleteKeyword(keyword.id)}>x</button>
        </li>
        )

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
            <ul>
                {keyword}
            </ul>
            <button onClick={modalClose}>컨텐츠 등록</button>
            {modalOpen && <UploadModal modalClose={modalClose}/>}
            

           
        </div>
    );
};

export default AppContentUpload;