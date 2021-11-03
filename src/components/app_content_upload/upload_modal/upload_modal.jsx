import React, { useEffect, useRef, useState } from 'react';
import style from './upload_modal.module.css';
import {firestore, storage} from '../../../service/firebase';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";


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
    const [order,setOrder] = useState('');
    const orderList = ['',1,2,3,4,5,6,7,8,9,10];


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
            fireStore.doc(`${titleKeyword}`).collection('appContents').doc(`${appName}${appVer}`).set({
                app_name:appName,
                app_ver:appVer,
                title_app_keyword:titleKeyword,
                research_keyword:researchKeywords,
                active:false,
                
            })
            alert('이제 이미지를 등록해주세요');

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
        }else if(name === 'order') {
            setOrder(value)
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
                    order,
                })

                alert('suc!');
                setUrls(prevState => [prevState,...urls]);
                setImgs([]);
                setPreview([]);
                setOrder("");
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

    const keyword = keywords.map((keyword,i) => 
        <li 
        key={i}
        className={keyword.id === titleKeyword ? style.li_active :style.li_unactive}
        onClick={handleKeyword}
        >
            {keyword.id}
        </li>
        );



    return (
        <div className={style.modal_container}>
            <div className={style.modal}>
                <div className={style.container}>
                    <div className={style.header}>
                        <div className={style.title}>이미지 등록</div>
                        <button
                          className={style.modal_btn} 
                          onClick={modalClose}>x</button>
                    </div>
                    <form onSubmit={onSubmit}>
                        <div className={style.input_container}>
                            <div className={style.sub_title}>앱(App) 이름</div>
                            <input 
                            className={style.input}
                            type="text"
                            name='app'
                            value={appName}
                            onChange={onChange}
                            /> 
                        </div>

                        <div className={style.input_container}>
                            <div className={style.sub_title}>앱(App) 버전</div>
                            <input 
                            className={style.input}
                            type="text"
                            name='ver'
                            value={appVer}
                            onChange={onChange}
                            /> 
                        </div>

                        <div className={style.input_container_app}>
                        <div className={style.sub_title}>앱 키워드 등록</div>
                            <ul className={style.keyword_ul}>
                                {keyword}
                            </ul>
                        </div>
                        <div className={style.input_container}>
                            <div className={style.sub_title}>집중탐구 키워드</div>
                            <div className={style.input_box}>
                                <input 
                                className={style.research_input}
                                type="text"
                                name='researchKeyword'
                                value={researchInput}
                                onChange={onChange}
                                onKeyDown={onKeyDown}
                                placeholder='키워드를 검색해주세요'
                                />  
                                <div className={style.research_list}>
                                    {researchKeywords.map((keyword,i)=>
                                        <div key={i} className={style.research_keyword}>
                                            {keyword}
                                            <FontAwesomeIcon className={style.research_del} onClick={()=>deleteKeyword(i)} icon={faTimes}/>
                                        </div>
                                        )}
                                </div>
                            </div>
                        </div>

                        <input type="submit" className={style.submit}/>

                    </form>

                    <div className={style.input_container_img}>
                                <div className={style.sub_title}>이미지 등록</div>
                        </div>    

                    <ul className={style.upload_container}>
                        {urls.map((imgs,i) => 
                        <li className={style.upload} key={i}>
                            <div className={style.upload_sub}>{imgs.sub}</div>
                            <img
                            className={style.upload_img}
                            src={imgs}
                            />
                        </li>
                        )}
                    </ul>


                    <div className={style.preview_container}>
                        {preview.map((url,i)=> (
                            <div className={style.preview} key={i}>
                                 <FontAwesomeIcon className={style.preview_del} onClick={()=>deleteImages(i)} icon={faTimes}/>
                                <img 
                                className={style.preview_img}
                                src={url} alt={url}/>
                                 
                        
                            </div>

                        ))}
                     </div> 
                    <form onSubmit={imgSubmit}>
                         <div className={style.img_container}>
                                 <div className={style.order_container}>
                                         <input 
                                           className={style.input_img}
                                           type="text"
                                           name="subtext"
                                           value={subText}
                                           onChange={imgChange}
                                           /> 
                                           <div className={style.order_text}>순서</div>
                                              <select name="order" onChange={imgChange}>
                                              {orderList.map((order,i) => <option key={i} value={order}>{order}번</option>)}   
                                              </select>  

                                            <label htmlFor="file">
                                              <div className={style.file_btn}>파일 올리기</div>
                                            </label>  


                                          <input 
                                          accept="image/*"
                                          type="file"
                                          multiple
                                          id="file"
                                          name="img"
                                          onChange={imgChange}
                                          ref={fileInput}
                                          style={{display:'none'}}
                                          />
                                    </div>
                                </div> 
                                <input className={style.img_submit} type="submit" value='이미지 제출'/>                
                    </form>

                </div>
            </div>
        </div>


    );
};

export default UploadModal;