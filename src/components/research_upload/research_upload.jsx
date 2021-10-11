import React, { useEffect, useState } from 'react';
import {firestore} from '../../service/firebase';
import ResearchUploadModal from './research_upload_modal/research_upload_modal';

const ResearchUpload = () => {

    const [modalOpen,setModalOpen] = useState(false);
    const [input,setInput] = useState('');
    const [keywords,setKeywords] = useState([]);
    const fireStore = firestore.collection('researchKeyword');

    const onChange = e => {
        const {value} =e.target;
        setInput(value);
    }

    const onKeyDown = e => {
        const {key} = e;
        const trimmedInput = input.trim();

        if(key === ',' && trimmedInput.length && !keywords.includes(trimmedInput)) {
            e.preventDefault();
            try{
                fireStore.doc(`${trimmedInput}`).set({
                    active:false
                })
                setInput('');
            }catch(err) {
                console.log('research keyword upload err' + err);
            }
        }
    }

    const submitKeywords = e => {
        const trimmedInput = input.trim();

        e.preventDefault();
        try{
            fireStore.doc(`${trimmedInput}`).set({
                active:false
            })
            setInput('');
        }catch(err) {
            console.log('research keyword upload err'+ err);
        }
    };


    const deleteKeyword = async(e) => {
        const del = window.confirm('are you sure delete research keyword in contents?')
        if(del) {
            await fireStore.doc(e).delete();
        }
    }

    const modalClose = () => {
        setModalOpen(!modalOpen);
    }



    useEffect(()=> {
        fireStore.onSnapshot(snapshot => {
            const array = snapshot.docs.map(doc => ({
                id:doc.id
            }));
            setKeywords(array)
        })
    },[])


  const keyword = keywords.map(keyword => 
    <li key={keyword.id}>
        {keyword.id}
        <button onClick={()=>deleteKeyword(keyword.id)}>x</button>
        </li>
    )




    return (
        <div>
          <div>집중탐구 콘텐츠</div>
          <input 
          type="text"
          value={input}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="research Keyword"
          />

          <button onClick={submitKeywords}>등록하기</button>

        <ul>
            {keyword}
        </ul>
            <button onClick={modalClose}>컨텐츠 등록</button>
            {modalOpen && <ResearchUploadModal modalClose={modalClose}/>}
            
        </div>
    );
};

export default ResearchUpload;