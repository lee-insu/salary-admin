import React, { useRef, useState } from 'react';
import style from './upload_modal.module.css';
import {firestore, storage} from '../../../service/firebase';

const UploadModal = ({keywords}) => {

    const store = firestore.collection('appContent');
    const imgStore = firestore.collection('imgs');
    const fileInput = useRef();

    const [appName,setAppName] = useState('');
    const [appVer,setAppVer] = useState('');
    const [titleKeyword, setTitleKeyword] = useState('');
    const [researchInput,setResearchInput] = useState('');
    const [researchKeywords,setResearchKeywords] = useState([]);
    const [imgs,setImgs] = useState([]);
    const [preview,setPreview] = useState([]);
    const [urls,setUrls] = useState([]);
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
        store.doc(`${appName}${appVer}`).set({
            app_name:appName,
            app_ver:appVer,
            title_app_keyword:titleKeyword,
            app_keyword:keywords,
            keyword:researchKeywords
            
        })
        alert('suc');
    };

    const handleKeyword = e => {
        setTitleKeyword(e.target.innerText); 
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
                const ref = storage.ref(`images/${appName}/${appVer}/${img.name}`);
                return ref 
                .put(img)
                .then(()=>ref.getDownloadURL())
            });

            Promise.all(promises)
            .then((urls) => {
                imgStore.doc(`${appName}${appVer}`).collection('img').add({
                    app_name:appName,
                    app_ver:appVer,
                    sub:subText,
                    imgs:urls
                    
                })
                
                alert('suc!');
                setUrls(prevState => [prevState,...urls]);
                setImgs([]);
                setPreview([]);
                setSubText('');
            })
          .catch(err => console.log(err));
          console.log(imgs);
          console.log(preview);

    }



    return (
        <>
            <div>
                -------------
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
                    -----------
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
                style={{width:'300px',height:'300px'}}
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
        </>
    );
};

export default UploadModal;