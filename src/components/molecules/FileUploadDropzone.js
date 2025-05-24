import React, { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import StyledButton from '../atoms/StyledButton';
import styles from './FileUploadDropzone.module.scss'; // We'll create this next

const FileUploadDropzone = ({ onFilesAccepted }) => {
  // Callback when files are dropped or selected
  const onDrop = useCallback(acceptedFiles => {
    // Pass accepted files to the parent component
    if (onFilesAccepted) {
      onFilesAccepted(acceptedFiles);
    }
    // You can handle file previews or uploads here or in the parent
    console.log('Accepted files:', acceptedFiles);
  }, [onFilesAccepted]);

  // Configure react-dropzone
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isFocused,
    isDragAccept,
    isDragReject,
    acceptedFiles, // Can be used to display file names/previews
    // fileRejections // Can be used to display errors
  } = useDropzone({
    onDrop,
    accept: { // Example: Accept images only (adjust as needed)
      'image/jpeg': [],
      'image/png': [],
      'image/gif': [],
    },
    // multiple: false, // Set to false if only one file is allowed
  });

  // Dynamically generate class names based on dropzone state
  const className = useMemo(() => `
    ${styles.dropzoneBase}
    ${isFocused ? styles.dropzoneFocused : ''}
    ${isDragActive ? styles.dropzoneActive : ''}
    ${isDragAccept ? styles.dropzoneAccept : ''}
    ${isDragReject ? styles.dropzoneReject : ''}
  `, [isFocused, isDragActive, isDragAccept, isDragReject]);

  // Display accepted file names (optional)
  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <div {...getRootProps({ className: className })}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <div className={styles.placeholderContent}>
          Drag 'n' drop some files here
          <span className="mx-2">OR</span>
          {/* Use StyledButton for consistency - stopPropagation prevents dropzone activation on button click */}
          <StyledButton
            variant="outline-secondary"
            size="sm"
            onClick={(e) => e.stopPropagation()} // Prevent dropzone activation
            as="span" // Render as span to avoid button-in-button issues if dropzone is clickable
          >
            Choose a file
          </StyledButton>
        </div>
      )}
      {/* Optionally display accepted files */}
      {files.length > 0 && (
        <aside className={styles.fileList}>
          <h6>Accepted files:</h6>
          <ul>{files}</ul>
        </aside>
      )}
       {/* Optionally display rejected files */}
       {/* {fileRejections.length > 0 && ( ... display rejection messages ... )} */}
    </div>
  );
};

export default FileUploadDropzone;
