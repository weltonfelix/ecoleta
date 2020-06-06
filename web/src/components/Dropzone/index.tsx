import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { FiUpload } from 'react-icons/fi';

import './styles.css';

interface Props {
  onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({ onFileUploaded }) => {
  const [selectedFileUrl, setSelectedFileUrl] = useState('');

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];

    if (!file){
      return;
    }

    const fileUrl = URL.createObjectURL(file);

    setSelectedFileUrl(fileUrl);
    onFileUploaded(file);
  }, [onFileUploaded])
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
  })

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} multiple={false} accept='image/*'/>

      {
        selectedFileUrl
          ? (
            <img src={selectedFileUrl} alt="Imagem do seu estabelecimento"/>
          )
          : (
            <p>
              <FiUpload />
              Imagem do estabelecimento
            </p>
          )
      }
      
    </div>
  )
}

export default Dropzone;