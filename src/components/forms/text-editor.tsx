

import {useRef} from 'react';
import {Editor} from "@tinymce/tinymce-react";

const TextEditor = ({editroText="", onChangeFunction}:any)  => {
    const editorRef:any = useRef(null);
    return (
        <Editor
            apiKey='avs3nh8kbz12qohe6xhkjiuw9u0safetix75kluo813u73j1'
            onInit={(_, editor) => editorRef.current = editor}
            value={editroText}
            onEditorChange={onChangeFunction}
            init={{
                height: 300,
                menubar: true,
                plugins: [
                    'advlist','autolink', 'lists','link','image','charmap','preview','anchor','searchreplace','visualblocks','fullscreen','insertdatetime','media','table','help','wordcount'
                ],
                toolbar: [
                    'casechange blocks fontsize | undo redo | removeformat | table link image imagetools',
                    'alignleft aligncenter alignright alignjustify | bold italic underline | forecolor backcolor | bullist numlist checklist outdent indent ',
                    ''
                ],
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                images_upload_url: 'postAcceptor.php',
                automatic_uploads: false
            }}
        />
    )
}

export default TextEditor;