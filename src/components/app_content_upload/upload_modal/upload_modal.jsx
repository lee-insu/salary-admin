import React, { useState } from 'react';
import style from './upload_modal.module.css';
import {firestore} from '../../../service/firebase';

const UploadModal = ({keywords}) => {

    const store = firestore.collection('appContent');

    const [appName,setAppName] = useState('');
    const [appVer,setAppVer] = useState('');
    const [titleKeyword, setTitleKeyword] = useState('');
    const [researchInput,setResearchInput] = useState('');
    const [researchKeywords,setResearchKeywords] = useState([]);


    const onChange = e => {
        const {target:{name,value}} = e;
        if(name === 'app') {
            setAppName(value);
        }else if(name === 'ver') {
            setAppVer(value);
        }else if(name === 'researchKeyword') {
            setResearchInput(value);
        }

    };

    const onKeyDown = e => {
        const {key} = e;
        const trimmedInput = researchInput.trim();

        if (key === ',' && trimmedInput.length && !keywords.includes(trimmedInput)) {
            e.preventDefault();
            setResearchKeywords(prevState => [...prevState, trimmedInput]);
            setResearchInput('');
          }
    };


    const onSubmit = async(e) => {
        e.preventDefault();
        try {
            store.add({
                app_name:appName,
                app_ver:appVer,
                title_app_keyword:titleKeyword,
                app_keyword:keywords,
                keyword:researchKeywords

            })
            setAppName('');
            setAppVer('');
        }catch(e) {
            console.log(e);
        }
    };

    const handleKeyword = e => {
        setTitleKeyword(e.target.innerText); 
    }

    const deleteKeyword = e => {
        setResearchKeywords(prevState => prevState.filter((keyword,i)=> i !== e))
    }



    return (
        <>
            <div>
                <div>이미지 등록</div>
                
                <form onSubmit={onSubmit}>
                <div>앱 이름</div>
                <input 
                type="text"
                name="app"
                value={appName}
                onChange={onChange}
                />

                <div>앱 버전</div>
                <input 
                type="text"
                name="ver"
                value={appVer}
                onChange={onChange}
                />

                <ul>
                    {keywords.map(keyword => 
                    <li 
                    key={keyword.id}
                    className={style.active}
                    onClick={handleKeyword}>
                        {keyword}
                    </li>)}
                </ul>

                <div>집중탐구 키워드</div> 
                <input 
                type="text"
                name='researchKeyword'
                vaule={researchInput}
                onChange={onChange}
                onKeyDown={onKeyDown}
                />

                <div>{researchKeywords.map((keyword,index)=>
                <div>
                    {keyword}
                    <button onClick={()=>deleteKeyword(index)}>x</button>
                </div>
                )}</div>

                <input type="submit"/>
                </form>

            
               

            </div>
        </>
    );
};

export default UploadModal;