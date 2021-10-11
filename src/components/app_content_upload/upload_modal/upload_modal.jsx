import React, { useEffect, useRef, useState } from 'react';
import style from './upload_modal.module.css';
import {firestore, storage} from '../../../service/firebase';

const UploadModal = ({modalClose}) => {

    const fireStore = firestore.collection('appKeyword');
    const imgStore = firestore.collection('imgs');
    const fileInput = useRef();

    const [appName,setAppName] = useState('');
    const [appVer,setAppVer] = useState('');
    const [titleKeyword, setTitleKeyword] = useState('');
    const [researchInput,setResearchInput] = useState('');
    const [researchKeywords,setResearchKeywords] = useState([]);
    const [keywords,setKeywords] = useState([]);
    const [imgs,setImgs] = useState([]);
    const [preview,setPreview] = useState([]);
    const [urls,setUrls] = useState([]);
    const [getImgs,getImgsData] = useState([]);
    const [subText,setSubText] =useState('');


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

        if (key === ',' && trimmedInput.length && !researchKeywords.includes(trimmedInput)) {
            e.preventDefault();
            setResearchKeywords(prevState => [...prevState, trimmedInput]);
            setResearchInput('');

          }
    };


    const onSubmit = async(e) => {
        e.preventDefault();
        if(titleKeyword) {
            fireStore.doc(`${titleKeyword}`).set({
                active:true
            })
            fireStore.doc(`${titleKeyword}`).collection('appContents').doc(`${appName}${appVer}`).set({
                app_name:appName,
                app_ver:appVer,
                title_app_keyword:titleKeyword,
                research_keyword:researchKeywords,
                active:true,
                
            })
            alert('suc');

        }
    };

    const handleKeyword = e => {
        const keyword = e.target.innerText
        setTitleKeyword(keyword);
    
    }


    const deleteKeyword = e => {
        setResearchKeywords(prevState => prevState.filter((keyword,i)=> i !== e))
    }

    const deleteImages = e => {
        setPreview(prevState => prevState.filter((img,i) => i !==e))
        setImgs(prevState => prevState.filter((img,i) =>i !==e))
    }


    const imgChange = e => {
        const {target:{name,value}} = e;
        if(name === 'subtext') {
            setSubText(value)
        }else if(name === 'img') {
            for(let i = 0; i <e.target.files.length; i++) {
                const newImgs = e.target.files[i];
                newImgs['id'] = Math.random();
                setImgs(prevState => [...prevState,newImgs]);
                try {
                   const createUrl = URL.createObjectURL(newImgs);
                   setPreview(prevState => prevState.concat(createUrl));
                   URL.revokeObjectURL(newImgs);

                }catch(err) {
                    console.log('image preview error',err)
                }
            }
        }

    }

    const imgSubmit = async(e) => {
        e.preventDefault();

            const promises = imgs.map(img => {
                const ref = storage.ref(`images/${titleKeyword}/${appName}/${appVer}/${img.name}`);
                return ref 
                .put(img)
                .then(()=>ref.getDownloadURL())
            });

            Promise.all(promises)
            .then((urls) => {
                imgStore.doc(`${titleKeyword}`).collection('img').doc(`${appName}${appVer}`).collection('list').add({
                    app_name:appName,
                    app_ver:appVer,
                    sub:subText,
                    imgs:urls,
                    time: new Date()
                    
                })
                
                alert('suc!');
                setUrls(prevState => [prevState,...urls]);
                setImgs([]);
                setPreview([]);
                setSubText('');
            })
          .catch(err => console.log(err));

    }


    useEffect(()=> {
        fireStore.onSnapshot(snapshot => {
            const array = snapshot.docs.map(doc => ({
                id:doc.id,
            }));
            setKeywords(array);
        })
        if(titleKeyword && appName && appVer) {
            const imgStore = firestore.collection('imgs').doc(`${titleKeyword}`).collection('img').doc(`${appName}${appVer}`).collection('list');
           imgStore.orderBy('time')
           .onSnapshot(snapshot => {
            const array = snapshot.docs.map(doc => ({
                id:doc.id,
                ...doc.data()
            }));
            getImgsData(array);
        })
        }

    },[titleKeyword,appName,appVer])

    const keyword = keywords.map(keyword => 
        <li 
        key={keyword.id}
        onClick={handleKeyword}
        >
            {keyword.id}
        </li>
        );

    const getImg = getImgs.map(imgList => 
    <li key={imgList.id}>
        <div>{imgList.sub}</div>
        {imgList.imgs.map(img => 
            <img 
            style={{width:'223px',height:'482px'}}
            src={img} />
            )}
    </li>)

    return (
        <div className={style.modal_container}>
            <div className={style.modal}>

                <button
                className={style.modal_btn} 
                onClick={modalClose}>x</button>

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
                    {keyword}
                </ul>


                <div>집중탐구 키워드</div> 

                <input 
                type="text"
                name='researchKeyword'
                value={researchInput}
                onChange={onChange}
                onKeyDown={onKeyDown}
                />

                <div>{researchKeywords.map((keyword,index)=>
                <div>
                    {keyword}
                    <button onClick={()=>deleteKeyword(index)}>x</button>
                </div>
                )}</div>

                ----

                <input type="submit"/>
                </form>


                <ul>
                    {getImg}
                </ul>


                <form onSubmit={imgSubmit}>

                <input 
                type="text"
                name="subtext"
                value={subText}
                onChange={imgChange}
                />


                <input 
                accept="image/*"
                type="file" 
                multiple
                id="file"
                name="img"
                onChange={imgChange}
                ref={fileInput}
                />

                <input type="submit"/>
                </form>

            


            
            {preview.map((url,i) => (
                <div>
                    <img
                key={i}
                style={{width:'223px',height:'482px'}}
                src={url}
                />
                <button onClick={()=>deleteImages(i)}>x</button>

                </div>
                
            ))}

                {/* <div>
                    ---result 
                    {urls.map((url,i) =>(
                 <img
                 key={i}
                 style={{width:'300px',height:'300px'}}
                 src={url}
                 />
             ))}

                </div> */}
                
             
            </div>
        </div>
    );
};

export default UploadModal;