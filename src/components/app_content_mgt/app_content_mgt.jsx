import React, { useEffect, useState } from 'react';
import style from './app_content_mgt.module.css';
import { firestore } from '../../service/firebase';
import classnames from 'classnames';


const AppContentMgt = () => {

    const fireStore = firestore.collection('appKeyword');
    const [contents,getContents] = useState([]);
    const [checked,getChecked] = useState();



    useEffect(()=> {   
    console.log('component did mount with useEffect!')
    if(checked) {
        fireStore.doc(checked.name).collection('appContents').doc(checked.value)
        .get().then(result => {
            const active = result.data().active;
            if(active) {
                fireStore.doc(checked.name).collection('appContents').doc(checked.value)
                .update({
                    active:false
                })

            }else {
                fireStore.doc(checked.name).collection('appContents').doc(checked.value)
                .update({
                    active:true
                })

            }
             })
    }else {
            fireStore.onSnapshot(snapshot => {
            const array = snapshot.docs.map(doc => ({
                id:doc.id
            }))
            array.map(keyword => fireStore.doc(keyword.id).collection('appContents')
            .onSnapshot(snapshot => {
                const array = snapshot.docs.map(doc => ({
                    id:doc.id,
                    ...doc.data()
                }))
                getContents(prevState => [...prevState,array].flat())
            })
            )
        })
    }
        return () => {
            console.log('component will unmount');
            // setTimeout(() => {
            //     window.location.reload()
            // }, 700);
        }
    },[checked]) 

    const onChange = e => {
        const {target:{name,value}} = e;
        const values = {name,value}
        getChecked(values)
      
    }

    


    const content = contents.map((content,i) => 
            <div className={style.content_list}>
            <label className={style.switch} key={i}>
                <input type="checkbox" checked={content.active ? true : false} name={content.title_app_keyword} value={content.id} onChange={onChange}/>
                <span className={classnames(style.slider,style.round,style.span)} ></span>
            </label>
             <div className={style.content}>{content.app_name} ver: {content.app_ver}</div>
            </div>
    )

    return (
        <div className={style.container}>
             <div className={style.title}>메인화면</div>
                 <div className={style.category}>앱 컨텐츠 관리</div>

                 <div className={style.list}>등록된 컨텐츠 목록</div>
                     <ul className={style.ul}>
                         {content}
                     </ul>
        </div>
    );
};

export default AppContentMgt;