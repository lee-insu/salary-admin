import React, { useEffect, useState } from 'react';
import { firestore } from '../../service/firebase';
import style from './keyword_mgt.module.css';

const KeywordMgt = () => {

    const fireStore = firestore.collection('appKeyword')
    const [keywords,getKeywords] =useState([])
    const [active,setActive] = useState('')

    useEffect(()=> {
        fireStore.onSnapshot(snapshot => {
            const array = snapshot.docs.map(doc => ({
                id:doc.id,
                ...doc.data()
            }))
            getKeywords(array)
            
        })
    },[])


    const handleActive = id => {
        fireStore.doc(id).get().then(result => {
            const data = result.data()
            if(data.active === true) {
                fireStore.doc(id).update({
                    active:false
                })
            }else {
                fireStore.doc(id).update({
                    active:true
                })
            }
        })
    };
    


    const keyword = keywords.map((keyword,i) => 
        <li key={i} className={keyword.active === true ? style.li_active : style.li_unActive} 
        onClick={()=>handleActive(keyword.id)}>{keyword.id}</li>
        )

    return (
        <div className={style.container}>

            <div className={style.title}>메인화면</div>
            <div className={style.category}>카테고리(키워드) 관리</div>

            <div className={style.list}>등록된 키워드 목록</div>
            <ul className={style.ul}>
                {keyword}
            </ul>
        </div>
    );
};

export default KeywordMgt;