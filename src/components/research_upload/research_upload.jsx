import React, { useEffect, useState } from 'react';
import {firestore} from '../../service/firebase';
import ResearchUploadModal from './research_upload_modal/research_upload_modal';
import style from './research_upload.module.css';

const ResearchUpload = () => {

    const [modalOpen,setModalOpen] = useState(false);
    const [input,setInput] = useState('');
    const [contents,getContents] = useState([]);
    const [keywords,setKeywords] = useState([]);
    const [checkedItems,setCheckItems] = useState([]);
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
                // fireStore.doc(`${trimmedInput}`).set({
                //     active:false
                // })
                setInput('');
            }catch(err) {
                console.log('research keyword upload err' + err);
            }
        }
    }

    // const submitKeywords = e => {
    //     const trimmedInput = input.trim();

    //     e.preventDefault();
    //     try{
    //         fireStore.doc(`${trimmedInput}`).set({
    //             active:false
    //         })
    //         setInput('');
    //     }catch(err) {
    //         console.log('research keyword upload err'+ err);
    //     }
    // };


    // const handleDeleteKeyword = e => {
    //     const del = window.confirm('are you sure delete research keyword in contents?')
    //     if(del) {
    //         fireStore.where('keywords',"array-contains",e)
    //         .onSnapshot(snapshot => {
    //             const array = snapshot.docs.map(doc => ({
    //                 id:doc.id
    //             }))
    //             for(let i = 0; i < array.length; i++) {
    //                 fireStore.doc(array[i].id).delete();
    //             }
    //         });
    //     }
    //     alert('suc');
    // }
    // researchKeyword ???????????? ???????????? 


    const modalClose = () => {
        setModalOpen(!modalOpen);
    }

    const handleDelete = () => {
        const del = window.confirm('????????? ???????????? ????????????????')
        if(del) {
            firestore.collection('researchDate').onSnapshot(snapshot => {
                const array = snapshot.docs.map(doc => ({
                    id:doc.id
                }))
                array.forEach(date => {
                    for(let i = 0; i < checkedItems.length; i++) {
                    firestore.collection('researchDate').doc(date.id).collection('research').doc(checkedItems[i]).delete();
                    
                    }
                })
            })
        }
        alert('?????????????????????~');
    };


    
    const checkHandler = e => {
        const {target:{value,checked}} = e;
 
        if(checked) {
            setCheckItems(prevState => [...prevState,value]);
        }else {
            setCheckItems(checkedItems.filter(el => el !== value))
        }
    }



    useEffect(()=> {
        firestore.collection('researchDate').onSnapshot(snapshot => {
            const array = snapshot.docs.map(doc => ({
                id:doc.id
            }))
            array.forEach(date => {
                firestore.collection('researchDate').doc(date.id).collection('research')
                .onSnapshot(snapshot => {
                    const array = snapshot.docs.map(doc => ({
                        id:doc.id,
                        ...doc.data()
                    }))
                    getContents(prevState => [...prevState,array])
                    for(let i = 0; i <array.length; i++) {
                        const arr = array[i].keywords;
                        setKeywords(prevState => [...prevState,arr]);
                    }
                })
            })
           
        })
    },[])
    

    const keywordFlat = keywords.flat();
    const keywordSet = new Set(keywordFlat);
    const keywordArr = [...keywordSet];


    const keyword = keywordArr.map((keyword,i) => 
        <li className={style.keyword} key={i}>
            {/* <button onClick={()=>handleDeleteKeyword(keyword)}>x</button> */}
            {keyword}</li>
        )

    const content = contents.flat().map((content,i) => 
        <li className={style.contents_li} key={i}>
            <input 
            className={style.checkbox}
            type="checkbox"
            value={content.id}
            onChange={checkHandler}
            />
            <div className={style.app}>{content.title}</div>
        </li>
        )

  


    return (
     <div className={style.container}>
         <div className={style.title}>????????????</div>
            <div className={style.category}>???????????? ????????? ??????</div>
            <div className={style.keyword_add}>??? ????????? ??????</div>
            <input 
            className={style.input}
            type="text"
            value={input}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder='?????????'
            />
            <button className={style.button} /*onClick={submitKeywords}*/>??????</button>

            <div className={style.keyword_list}>????????? ????????? ??????</div>
            <ul className={style.keyword_ul}>
                {keyword}
            </ul>

            <div className={style.contents_container}>
                <div className={style.contents}>
                    <div className={style.contents_list}>??? ????????? ??????</div>
                    <div className={style.handle_btn}>
                        <button className={style.handle_del} onClick={handleDelete}>????????? ??????</button>
                        <button className={style.modal} onClick={modalClose} >????????? ??????</button>
                        {modalOpen && <ResearchUploadModal modalClose={modalClose}/>}
                    </div>
                </div>
                <ul className={style.contents_ul}>
                    {content}
                </ul>
            </div>
     </div>

    );
};

export default ResearchUpload;

