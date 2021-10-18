import React, { StrictMode, useState } from 'react';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {storage} from '../../../service/firebase';

const Editor = () => {

    const [text,setText] = useState('')
    const API_URL = "https://77em4-8080.sse.codesandbox.io";
    const UPLOAD_ENDPOINT = "upload_files";



    const uploadAdapter = loader => {
        return {
            upload:() => {
                return new Promise((resolve,reject) => {
                    const body = new FormData();
                    loader.file.then(file => {
                        body.append('file',file);
                        const ref = storage.ref(`dd/${file.name}`)
                        return ref
                        .put(file)
                        .then(()=>ref.getDownloadURL().then(url => 
                            resolve({
                                default: `${url}`
                            })
                            ))
                    })
                    
                })

            }
        }
    }

  


    
      function uploadPlugin(editor) {
        editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
          return uploadAdapter(loader);
        };
      }

      console.log(text);
    return (
        <div>
            <CKEditor
             config={{
                extraPlugins: [uploadPlugin]
              }}
            editor = {ClassicEditor}
            data = {text}
            onChange ={(e,editor) => {
                const data = editor.getData();
                setText(data);
            }}
            >

            </CKEditor>
        </div>
    );
};

export default Editor;