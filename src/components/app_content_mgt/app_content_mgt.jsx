import React, { useEffect, useState } from 'react';
import style from './app_content_mgt.module.css';
import './app_content_mgt.css';
import { firestore } from '../../service/firebase';


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
            setTimeout(() => {
                window.location.reload()
            }, 700);
        }
    },[checked]) 

    const onChange = e => {
        const {target:{name,value}} = e;
        const values = {name,value}
        getChecked(values)
      
    }

    
    const content = contents.map((content,i) => 
            
            <label key={i}>
                <input type="checkbox" checked={content.active ? true : false} name={content.title_app_keyword} value={content.id} onChange={onChange}/>
                <span>{content.app_name} ver: {content.app_ver}</span>
            </label>
        )

    return (
        <div className={style.session}>
            AppContentMgt
            <div>
            
            {content}
                {/* <label class='switch'>
                     <input type="checkbox" value='hi' onChange={onChange}/>
                     <span class='slider round'>gdgd</span>
                </label> */}

                


            </div>
        </div>
    );
};

export default AppContentMgt;