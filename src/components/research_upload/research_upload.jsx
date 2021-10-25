import React, { useEffect, useState } from 'react';
import {firestore} from '../../service/firebase';
import ResearchUploadModal from './research_upload_modal/research_upload_modal';

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
    // researchKeyword 기준이라 바꿔야함 


    const modalClose = () => {
        setModalOpen(!modalOpen);
    }

    const handleDelete = () => {
        const del = window.confirm('are you sure delete?')
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
        alert('suc');
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


    const keyword = keywordArr.map(keyword => 
        <li key={keyword}>
            {/* <button onClick={()=>handleDeleteKeyword(keyword)}>x</button> */}
            {keyword}</li>
        )

    const content = contents.flat().map(content => 
        <li key={content.id}>
            <input 
            type="checkbox"
            value={content.id}
            onChange={checkHandler}
            />
            <h3>{content.title}</h3>
        </li>
        )

  


    return (
        <div>
          <div>집중탐구 콘텐츠</div>
          <input 
          type="text"
          value={input}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="research Keyword"
          />

          {/* <button onClick={submitKeywords}>등록하기</button> */}

        <ul>
            {keyword}
        </ul>
            <button onClick={handleDelete}>컨텐츠 삭제</button>
            <button onClick={modalClose}>컨텐츠 등록</button>
            {modalOpen && <ResearchUploadModal modalClose={modalClose}/>}

            <div>
                <div>앱 컨텐츠 등록</div>
                <ul>
                    {content}
                </ul>
            </div>
            
        </div>
    );
};

export default ResearchUpload;

// import React, { useEffect, useState } from 'react';
// import {firestore} from '../../service/firebase';
// import ResearchUploadModal from './research_upload_modal/research_upload_modal';

// const ResearchUpload = () => {

//     const [modalOpen,setModalOpen] = useState(false);
//     const [input,setInput] = useState('');
//     const [contents,getContents] = useState([]);
//     const [keywords,setKeywords] = useState([]);
//     const [checkedItems,setCheckItems] = useState([]);
//     const fireStore = firestore.collection('researchKeyword');


//     const onChange = e => {
//         const {value} =e.target;
//         setInput(value);
//     }

//     const onKeyDown = e => {
//         const {key} = e;
//         const trimmedInput = input.trim();

//         if(key === ',' && trimmedInput.length && !keywords.includes(trimmedInput)) {
//             e.preventDefault();
//             try{
//                 fireStore.doc(`${trimmedInput}`).set({
//                     active:false
//                 })
//                 setInput('');
//             }catch(err) {
//                 console.log('research keyword upload err' + err);
//             }
//         }
//     }

//     const submitKeywords = e => {
//         const trimmedInput = input.trim();

//         e.preventDefault();
//         try{
//             fireStore.doc(`${trimmedInput}`).set({
//                 active:false
//             })
//             setInput('');
//         }catch(err) {
//             console.log('research keyword upload err'+ err);
//         }
//     };


//     const handleDeleteKeyword = e => {
//         const del = window.confirm('are you sure delete research keyword in contents?')
//         if(del) {
//             fireStore.where('keywords',"array-contains",e)
//             .onSnapshot(snapshot => {
//                 const array = snapshot.docs.map(doc => ({
//                     id:doc.id
//                 }))
//                 for(let i = 0; i < array.length; i++) {
//                     fireStore.doc(array[i].id).delete();
//                 }
//             });
//         }
//         alert('suc');
//     }

//     const modalClose = () => {
//         setModalOpen(!modalOpen);
//     }

//     const handleDelete = () => {
//         const del = window.confirm('are you sure delete?')
//         if(del) {
//             for(let i = 0; i < checkedItems.length; i++) {
//                 fireStore.doc(checkedItems[i]).delete();
//             }
//         }
//         alert('suc');
//     };
    
//     const checkHandler = e => {
//         const {target:{value,checked}} = e;
//         if(checked) {
//             setCheckItems(prevState => [...prevState,value]);
//         }else {
//             setCheckItems(checkedItems.filter(el => el !== value))
//         }
//     }




//     useEffect(()=> {
//         fireStore.onSnapshot(snapshot => {
//             const array = snapshot.docs.map(doc => ({
//                 id:doc.id,
//                 ...doc.data()
//             }));
//             getContents(array);
//             for(let i = 0; i <array.length; i++) {
//                 const arr = array[i].keywords;
//                 setKeywords(prevState => [...prevState,arr]);
//             }
//         })
//     },[])

//     const keywordFlat = keywords.flat();
//     const keywordSet = new Set(keywordFlat);
//     const keywordArr = [...keywordSet];


//     const keyword = keywordArr.map(keyword => 
//         <li key={keyword}>
//             <button onClick={()=>handleDeleteKeyword(keyword)}>x</button>
//             {keyword}</li>
//         )

//     const content = contents.map(content => 
//         <li key={content.id}>
//             <input 
//             type="checkbox"
//             value={content.id}
//             onChange={checkHandler}
//             />
//             <h3>{content.title}</h3>
//         </li>
//         )



//     return (
//         <div>
//           <div>집중탐구 콘텐츠</div>
//           <input 
//           type="text"
//           value={input}
//           onChange={onChange}
//           onKeyDown={onKeyDown}
//           placeholder="research Keyword"
//           />

//           <button onClick={submitKeywords}>등록하기</button>

//         <ul>
//             {keyword}
//         </ul>
//             <button onClick={handleDelete}>컨텐츠 삭제</button>
//             <button onClick={modalClose}>컨텐츠 등록</button>
//             {modalOpen && <ResearchUploadModal modalClose={modalClose}/>}

//             <div>
//                 <div>앱 컨텐츠 등록</div>
//                 <ul>
//                     {content}
//                 </ul>
//             </div>
            
//         </div>
//     );
// };

// export default ResearchUpload;