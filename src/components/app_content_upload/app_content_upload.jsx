import React, { useEffect, useState } from 'react';
import style from './app_content_upload.module.css';
import UploadModal from './upload_modal/upload_modal';
import {firestore} from '../../service/firebase';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";

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
        const {target:{value,checked}} = e;
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
                    ...doc.data()
                }))
                getContents(prevState => [...prevState,Object.assign(array)]);
                
            })
        })
    },[keywords])


 

    const keyword = keywords.map((keyword,i) => 
        <li key={i} className={style.keyword}>
            {keyword.id}
            <FontAwesomeIcon className={style.keyword_del} icon={faTimes} onClick={()=>deleteKeyword(keyword.id)}/>
        </li>
        )

    const contentList = contents.flat();
    
    const content = contentList.map((content,i) => 
        <li className={style.contents_li} key={i}>
            <input 
            className={style.checkbox}
            type="checkbox"
            value={content.id}
            onChange={checkHandler}
            />
            <div className={style.app}>{content.app_name} ver:{content.app_ver}</div>
            
        </li>
        )



    return (

        <div className={style.container}>

            <div className={style.title}>????????????</div>
            <div className={style.category}>??? ????????? ??????</div>

            <div className={style.keyword_add}>??? ????????? ??????</div>

                <input 
                className={style.input}
                type="text"
                value={input}
                onChange={onChange}
                onKeyDown={onKeyDown}
                placeholder="???????????? ??????????????????."
                />

                <button className={style.button} onClick={submitKeywords}>??????</button>


            <div className={style.keyword_list}>????????? ????????? ??????</div>
                <ul className={style.keyword_ul}>
                    {keyword}
                </ul>

            <div className={style.contents_container}>
                <div className={style.contents}>
                    <div className={style.contents_list}>??? ????????? ??????</div>
                    <div className={style.handle_btn}>
                        <button className={style.handle_del} onClick={handleDelete}>????????? ??????</button>
                        <button className={style.modal} onClick={modalClose}>????????? ??????</button>
                        {modalOpen && <UploadModal modalClose={modalClose}/>}
                    </div>
           
                </div>
                <ul className={style.contents_ul}>
                    {content}
                </ul>
            </div>
           

   
        </div>

    );
};

export default AppContentUpload;