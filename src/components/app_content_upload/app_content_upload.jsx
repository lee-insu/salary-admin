import React, { useEffect, useState } from 'react';
import style from './app_content_upload.module.css';
import UploadModal from './upload_modal/upload_modal';
import {firestore} from '../../service/firebase';

const AppContentUpload = () => {

    const [contents,getContents] = useState([]);
    const [input,setInput] = useState('');
    const [keywords,setKeywords] = useState([]);
    const [checkedItems,setCheckedItems] = useState([]);
    const fireStore = firestore.collection('appKeyword');
    const [modalOpen,setModalOpen] = useState(false);


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


    const checkHandler = (e) => {
        const {target:{value,checked}} =e ;
            if(checked) {
                setCheckedItems(prevState => [...prevState,value])
            }else {
                setCheckedItems(checkedItems.filter(el => el !== value))
            }
    }



    const handleDelete = () => {
        const del = window.confirm('are you sure delete?')
        if(del) {
            for(let i = 0; i < checkedItems.length; i ++) {
                keywords.map(keyword => {
                    fireStore.doc(keyword.id).collection('appContents').doc(checkedItems[i]).delete()   
                })
            }
        }
        alert('suc!')
        
    }



    useEffect(()=> {
        fireStore.onSnapshot(snapshot => {
            const array = snapshot.docs.map(doc => ({
                id:doc.id
            }));
            setKeywords(array);
        })
    },[])

    useEffect(()=> {
        keywords.forEach(keyword => {
            fireStore.doc(keyword.id).collection('appContents')
            .onSnapshot(snapshot=> {
                const array = snapshot.docs.map(doc => ({
                    id:doc.id,
                    ...doc.data(),
                }))
                getContents(prevState => [...prevState,Object.assign(array)]);
                
            })
        })
    },[keywords])

    const keyword = keywords.map(keyword => 
        <li key={keyword.id}>
            {keyword.id}
            <button onClick={()=>deleteKeyword(keyword.id)}>x</button>
        </li>
        )

    const contentList = contents.flat();
    
    const content = contentList.map(content => 
        <li key={content.id}>
            <input 
            type="checkbox"
            value={content.id}
            onChange={checkHandler}
            />
            {content.app_name}
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
            <button onClick={handleDelete}>컨텐츠 삭제</button>
            <button onClick={modalClose}>컨텐츠 등록</button>
            {modalOpen && <UploadModal modalClose={modalClose}/>}

            <div>
                <div>앱 컨텐츠 목록</div>    
                <ul>    
                    {content}
                </ul>    
            </div>
            

           
        </div>
    );
};

export default AppContentUpload;